import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Trash2, Plus, ChevronDown, ExternalLink, RefreshCw, X } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";
import { supabase } from "@/lib/supabaseClient";

/* ── Types ───────────────────────────────────────────────────── */
interface LineItem {
  id:          number;
  description: string;
  qty:         number;
  unit:        string;
}

interface Invoice {
  id:        string;
  customerId: string;
  created:   string;
  customer:  string;
  email:     string;
  title:     string;
  amount:    string;
  status:    "open" | "paid" | "void";
  hostedInvoiceUrl: string;
}

interface BillingCustomer {
  id: string;
  clientId: string;
  name: string;
  primaryContactName: string;
  primaryContactEmail: string;
}

interface StoredClientRow {
  id: string;
  name: string;
  email: string;
  clientAdminName: string;
}

interface AgreementFormValues {
  clientLegalName: string;
  dbaTradeName: string;
  primaryAdmin: string;
  adminEmail: string;
  candidateAssistanceContact: string;
  membershipTier: "basic" | "pro" | "enterprise";
  platformFee: string;
  perRoleFee: string;
  additionalInterviewFee: string;
  includedInterviewsPerRole: string;
  initialTermStart: string;
  initialRenewalDate: string;
  billingOption: "monthly" | "annual";
  autoRenew: "yes" | "no";
  noticeDeadlineDays: string;
}

type AgreementClientMode = "attach_existing_client" | "add_new_client";
type AgreementFieldErrorKey =
  | "attachedClientId"
  | "clientLegalName"
  | "primaryAdmin"
  | "adminEmail"
  | "candidateAssistanceContact"
  | "platformFee"
  | "perRoleFee"
  | "additionalInterviewFee"
  | "includedInterviewsPerRole"
  | "initialTermStart"
  | "initialRenewalDate";
type AgreementFieldErrors = Partial<Record<AgreementFieldErrorKey, string>>;
type DatePartKey = "month" | "day" | "year";

interface DateParts {
  month: string;
  day: string;
  year: string;
}

const env =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

function trimTrailingSlashes(value: unknown): string {
  return String(value || "").trim().replace(/\/+$/, "");
}

function firstBase(...values: unknown[]): string {
  for (const value of values) {
    const normalized = trimTrailingSlashes(value);
    if (normalized) return normalized;
  }
  return "";
}

const backendBase = firstBase(
  (env as Record<string, unknown>).VITE_BACKEND_URL,
  (env as Record<string, unknown>).VITE_API_URL,
  (env as Record<string, unknown>).VITE_PUBLIC_BACKEND_URL,
  (env as Record<string, unknown>).PUBLIC_BACKEND_URL,
  (env as Record<string, unknown>).BACKEND_URL,
);

function parseJsonSafe(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractErrorMessage(text: string): string {
  if (!text) return "Failed to load billing data.";
  const data = parseJsonSafe(text);
  const detail =
    data && typeof data === "object"
      ? (data as { detail?: unknown }).detail ??
        (data as { message?: unknown }).message ??
        (data as { error?: unknown }).error
      : null;
  if (typeof detail === "string" && detail.trim()) return detail;
  return text;
}

function normalizeInvoiceStatus(value: unknown): "open" | "paid" | "void" {
  const status = String(value || "").trim().toLowerCase();
  if (status === "paid") return "paid";
  if (status === "void" || status === "uncollectible") return "void";
  return "open";
}

function formatDateTime(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString();
}

function formatAmountFromCents(cents: unknown, currency: unknown): string {
  const amount = Number(cents);
  if (!Number.isFinite(amount)) return "$0.00";
  const code = String(currency || "usd").trim().toUpperCase() || "USD";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(amount / 100);
  } catch {
    return `$${(amount / 100).toFixed(2)}`;
  }
}

/* ── Helpers ─────────────────────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-[#0A1547] font-medium bg-white " +
  "border border-[rgba(10,21,71,0.10)] placeholder:text-[#0A1547]/25 " +
  "focus:outline-none focus:border-[#A380F6] transition-colors";

const selectCls = inputCls + " appearance-none cursor-pointer pr-8";
const fieldLabelCls = "px-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40";
const fieldErrorCls = "px-1 text-[11px] font-semibold text-red-500";
const datePartCls =
  "px-3 py-2.5 rounded-xl text-sm text-[#0A1547] font-semibold bg-white border border-[rgba(10,21,71,0.10)] " +
  "placeholder:text-[#0A1547]/25 focus:outline-none focus:border-[#A380F6] transition-colors text-center";
const REQUIRED_MARK = " *";
const AGREEMENT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(240,165,0,0.10)",   text: "#C07800"  },
  paid: { bg: "rgba(2,217,157,0.10)",   text: "#00886A"  },
  void: { bg: "rgba(10,21,71,0.07)",    text: "rgba(10,21,71,0.35)" },
};

let _lineId = 10;

function defaultAgreementFormValues(): AgreementFormValues {
  return {
    clientLegalName: "",
    dbaTradeName: "",
    primaryAdmin: "",
    adminEmail: "",
    candidateAssistanceContact: "",
    membershipTier: "basic",
    platformFee: "",
    perRoleFee: "",
    additionalInterviewFee: "",
    includedInterviewsPerRole: "",
    initialTermStart: "",
    initialRenewalDate: "",
    billingOption: "monthly",
    autoRenew: "yes",
    noticeDeadlineDays: "30",
  };
}

function buildIsoDateFromParts(parts: DateParts): string {
  const month = String(parts.month || "").trim();
  const day = String(parts.day || "").trim();
  const year = String(parts.year || "").trim();
  if (!month || !day || year.length !== 4) return "";

  const mm = Number(month);
  const dd = Number(day);
  const yy = Number(year);
  if (!Number.isInteger(mm) || mm < 1 || mm > 12) return "";
  if (!Number.isInteger(dd) || dd < 1 || dd > 31) return "";
  if (!Number.isInteger(yy) || yy < 1900 || yy > 9999) return "";

  const parsed = new Date(Date.UTC(yy, mm - 1, dd));
  if (
    parsed.getUTCFullYear() !== yy ||
    parsed.getUTCMonth() !== mm - 1 ||
    parsed.getUTCDate() !== dd
  ) {
    return "";
  }

  const mmText = String(mm).padStart(2, "0");
  const ddText = String(dd).padStart(2, "0");
  return `${year}-${mmText}-${ddText}`;
}

/* ── Component ───────────────────────────────────────────────── */
export default function AdminBillingPage() {
  const {
    clients: adminClients,
    selectedClient,
    selectedClientId,
    loading: adminClientsLoading,
    error: adminClientsError,
  } = useAdminClient();
  const [billingCustomers, setBillingCustomers] = useState<BillingCustomer[]>([]);
  const [storedClientsById, setStoredClientsById] = useState<Record<string, StoredClientRow>>({});
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);
  const [billingLoading, setBillingLoading] = useState<boolean>(false);
  const [billingError, setBillingError] = useState<string>("");
  const [refreshNonce, setRefreshNonce] = useState(0);

  /* Create billing customer */
  const [cbcCompany, setCbcCompany]   = useState("");
  const [cbcContact, setCbcContact]   = useState("");
  const [cbcEmail, setCbcEmail]       = useState("");
  const [cbcNotes, setCbcNotes]       = useState("");

  /* Send invoice */
  const [invCustomer, setInvCustomer]       = useState("");
  const [invTitle, setInvTitle]             = useState("");
  const [invDesc, setInvDesc]               = useState("");
  const [invDays, setInvDays]               = useState("7");
  const [lineItems, setLineItems]           = useState<LineItem[]>([
    { id: 1, description: "", qty: 1, unit: "" },
  ]);

  /* Agreement generator */
  const [agreementClientMode, setAgreementClientMode] = useState<AgreementClientMode>("attach_existing_client");
  const [agreementAttachedClientId, setAgreementAttachedClientId] = useState("");
  const [agreementForm, setAgreementForm] = useState<AgreementFormValues>(defaultAgreementFormValues);
  const [agreementFieldErrors, setAgreementFieldErrors] = useState<AgreementFieldErrors>({});
  const [agreementError, setAgreementError] = useState("");
  const [agreementSuccess, setAgreementSuccess] = useState("");
  const [agreementPreviewBusy, setAgreementPreviewBusy] = useState(false);
  const [agreementSendBusy, setAgreementSendBusy] = useState(false);
  const [agreementPreviewOpen, setAgreementPreviewOpen] = useState(false);
  const [agreementPreviewPdfUrl, setAgreementPreviewPdfUrl] = useState("");
  const [initialTermStartParts, setInitialTermStartParts] = useState<DateParts>({ month: "", day: "", year: "" });
  const [initialRenewalDateParts, setInitialRenewalDateParts] = useState<DateParts>({ month: "", day: "", year: "" });
  const initialTermStartMonthRef = useRef<HTMLInputElement | null>(null);
  const initialTermStartDayRef = useRef<HTMLInputElement | null>(null);
  const initialTermStartYearRef = useRef<HTMLInputElement | null>(null);
  const initialRenewalDateMonthRef = useRef<HTMLInputElement | null>(null);
  const initialRenewalDateDayRef = useRef<HTMLInputElement | null>(null);
  const initialRenewalDateYearRef = useRef<HTMLInputElement | null>(null);

  const agreementClientOptions = adminClients.filter((client) => client.id !== "all");
  const scopedAgreementClientId =
    selectedClientId === "all" ? agreementAttachedClientId : selectedClientId;

  const addLineItem = () =>
    setLineItems((prev) => [...prev, { id: _lineId++, description: "", qty: 1, unit: "" }]);

  const removeLineItem = (id: number) =>
    setLineItems((prev) => prev.filter((li) => li.id !== id));

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) =>
    setLineItems((prev) => prev.map((li) => (li.id === id ? { ...li, [field]: value } : li)));

  const filledItems   = lineItems.filter((li) => li.description.trim() && li.unit.trim());
  const canSendInvoice = invCustomer && invTitle.trim() && filledItems.length > 0;

  const updateAgreementField = <K extends keyof AgreementFormValues>(
    key: K,
    value: AgreementFormValues[K],
  ) => {
    setAgreementForm((prev) => ({ ...prev, [key]: value }));
    const errorKeyByField: Partial<Record<keyof AgreementFormValues, AgreementFieldErrorKey>> = {
      clientLegalName: "clientLegalName",
      primaryAdmin: "primaryAdmin",
      adminEmail: "adminEmail",
      candidateAssistanceContact: "candidateAssistanceContact",
      platformFee: "platformFee",
      perRoleFee: "perRoleFee",
      additionalInterviewFee: "additionalInterviewFee",
      includedInterviewsPerRole: "includedInterviewsPerRole",
      initialTermStart: "initialTermStart",
      initialRenewalDate: "initialRenewalDate",
    };
    const errorKey = errorKeyByField[key];
    if (errorKey) {
      setAgreementFieldErrors((prev) => {
        if (!prev[errorKey]) return prev;
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const updateAgreementDatePart = (
    field: "initialTermStart" | "initialRenewalDate",
    part: DatePartKey,
    rawValue: string,
  ) => {
    const sanitized = String(rawValue || "")
      .replace(/\D/g, "")
      .slice(0, part === "year" ? 4 : 2);
    const setParts = field === "initialTermStart" ? setInitialTermStartParts : setInitialRenewalDateParts;

    setParts((previous) => {
      const next = { ...previous, [part]: sanitized };
      const iso = buildIsoDateFromParts(next);
      updateAgreementField(field, iso);
      return next;
    });

    if (part === "month" && sanitized.length === 2) {
      if (field === "initialTermStart") initialTermStartDayRef.current?.focus();
      else initialRenewalDateDayRef.current?.focus();
    } else if (part === "day" && sanitized.length === 2) {
      if (field === "initialTermStart") initialTermStartYearRef.current?.focus();
      else initialRenewalDateYearRef.current?.focus();
    }
  };

  const handleAgreementDateBackspace = (
    field: "initialTermStart" | "initialRenewalDate",
    part: "day" | "year",
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace" || event.currentTarget.value) return;
    event.preventDefault();
    if (part === "day") {
      if (field === "initialTermStart") initialTermStartMonthRef.current?.focus();
      else initialRenewalDateMonthRef.current?.focus();
      return;
    }
    if (field === "initialTermStart") initialTermStartDayRef.current?.focus();
    else initialRenewalDateDayRef.current?.focus();
  };

  useEffect(() => {
    if (selectedClientId !== "all") {
      setAgreementAttachedClientId(selectedClientId);
      return;
    }
    setAgreementAttachedClientId((previous) => {
      if (previous && agreementClientOptions.some((client) => client.id === previous)) return previous;
      return agreementClientOptions[0]?.id || "";
    });
  }, [selectedClientId, agreementClientOptions]);

  useEffect(() => {
    if (agreementClientMode !== "attach_existing_client") return;
    const clientId = String(scopedAgreementClientId || "").trim();
    if (!clientId) return;

    const matchedStoredClient = storedClientsById[clientId] || null;
    const matchedOption = agreementClientOptions.find((client) => client.id === clientId);
    const matchedCustomer = billingCustomers.find((customer) => customer.clientId === clientId);

    setAgreementForm((previous) => ({
      ...previous,
      clientLegalName: String(
        matchedStoredClient?.name || matchedCustomer?.name || matchedOption?.name || "",
      ).trim(),
      primaryAdmin: String(
        matchedStoredClient?.clientAdminName || matchedCustomer?.primaryContactName || "",
      ).trim(),
      adminEmail: String(
        matchedStoredClient?.email || matchedCustomer?.primaryContactEmail || "",
      ).trim(),
    }));

    setAgreementFieldErrors((prev) => {
      const next = { ...prev };
      delete next.attachedClientId;
      if (matchedStoredClient?.name || matchedCustomer?.name || matchedOption?.name) delete next.clientLegalName;
      if (matchedStoredClient?.clientAdminName || matchedCustomer?.primaryContactName) delete next.primaryAdmin;
      if (matchedStoredClient?.email || matchedCustomer?.primaryContactEmail) delete next.adminEmail;
      return next;
    });
  }, [agreementClientMode, scopedAgreementClientId, agreementClientOptions, billingCustomers, storedClientsById]);

  useEffect(() => {
    if (agreementClientMode === "add_new_client") {
      setAgreementAttachedClientId("");
      setAgreementForm((prev) => ({
        ...prev,
        clientLegalName: "",
        dbaTradeName: "",
        primaryAdmin: "",
        adminEmail: "",
      }));
    }
    setAgreementFieldErrors((prev) => {
      const next = { ...prev };
      if (agreementClientMode === "attach_existing_client") delete next.candidateAssistanceContact;
      if (agreementClientMode === "add_new_client") delete next.attachedClientId;
      return next;
    });
  }, [agreementClientMode]);

  const buildAgreementPayload = () => ({
    client_mode: agreementClientMode,
    attached_client_id: agreementClientMode === "attach_existing_client" ? scopedAgreementClientId || null : null,
    client_id: agreementClientMode === "attach_existing_client" ? scopedAgreementClientId || null : null,
    client_legal_name: agreementForm.clientLegalName.trim(),
    dba_trade_name: agreementForm.dbaTradeName.trim() || agreementForm.clientLegalName.trim(),
    primary_admin_name: agreementForm.primaryAdmin.trim(),
    admin_email: agreementForm.adminEmail.trim(),
    candidate_assistance_contact:
      agreementClientMode === "add_new_client"
        ? agreementForm.candidateAssistanceContact.trim()
        : null,
    membership_tier: agreementForm.membershipTier,
    platform_fee:
      agreementForm.membershipTier === "enterprise"
        ? agreementForm.platformFee.trim()
        : null,
    per_role_fee:
      agreementForm.membershipTier === "enterprise"
        ? agreementForm.perRoleFee.trim()
        : null,
    additional_interview_fee:
      agreementForm.membershipTier === "enterprise"
        ? agreementForm.additionalInterviewFee.trim()
        : null,
    included_interviews_per_role:
      agreementForm.membershipTier === "enterprise"
        ? agreementForm.includedInterviewsPerRole.trim()
        : null,
    initial_term_start: agreementForm.initialTermStart.trim(),
    initial_renewal_date: agreementForm.initialRenewalDate.trim(),
    billing_option: agreementForm.billingOption,
    auto_renew: agreementForm.autoRenew === "yes",
    notice_deadline_days: Number.parseInt(agreementForm.noticeDeadlineDays, 10) || 30,
  });

  const validateAgreementForm = (): boolean => {
    const errors: AgreementFieldErrors = {};
    const adminEmail = String(agreementForm.adminEmail || "").trim();
    const hasInitialTermParts = Boolean(
      initialTermStartParts.month || initialTermStartParts.day || initialTermStartParts.year,
    );
    const hasInitialRenewalParts = Boolean(
      initialRenewalDateParts.month || initialRenewalDateParts.day || initialRenewalDateParts.year,
    );

    if (agreementClientMode === "attach_existing_client" && !String(scopedAgreementClientId || "").trim()) {
      errors.attachedClientId = "Select an existing client.";
    }
    if (!agreementForm.clientLegalName.trim()) errors.clientLegalName = "Client legal name is required.";
    if (!agreementForm.primaryAdmin.trim()) errors.primaryAdmin = "Primary admin is required.";
    if (!adminEmail) errors.adminEmail = "Admin email is required.";
    else if (!AGREEMENT_EMAIL_RE.test(adminEmail)) errors.adminEmail = "Enter a valid admin email.";
    if (!agreementForm.initialTermStart.trim()) {
      errors.initialTermStart = hasInitialTermParts
        ? "Enter a real date in MM / DD / YYYY."
        : "Initial term start is required.";
    }
    if (!agreementForm.initialRenewalDate.trim()) {
      errors.initialRenewalDate = hasInitialRenewalParts
        ? "Enter a real date in MM / DD / YYYY."
        : "Initial renewal date is required.";
    }
    if (agreementClientMode === "add_new_client" && !agreementForm.candidateAssistanceContact.trim()) {
      errors.candidateAssistanceContact = "Candidate assistance contact is required.";
    }
    if (agreementForm.membershipTier === "enterprise") {
      const platformFee = String(agreementForm.platformFee || "").trim();
      const perRoleFee = String(agreementForm.perRoleFee || "").trim();
      const additionalInterviewFee = String(agreementForm.additionalInterviewFee || "").trim();
      const includedInterviews = String(agreementForm.includedInterviewsPerRole || "").trim();
      if (!platformFee) errors.platformFee = "Membership fee is required for enterprise tier.";
      else if (!Number.isFinite(Number(platformFee)) || Number(platformFee) < 0) {
        errors.platformFee = "Enter a valid membership fee.";
      }
      if (!perRoleFee) errors.perRoleFee = "Per-role fee is required for enterprise tier.";
      else if (!Number.isFinite(Number(perRoleFee)) || Number(perRoleFee) < 0) {
        errors.perRoleFee = "Enter a valid per-role fee.";
      }
      if (!additionalInterviewFee) {
        errors.additionalInterviewFee = "Additional interview fee is required for enterprise tier.";
      } else if (!Number.isFinite(Number(additionalInterviewFee)) || Number(additionalInterviewFee) < 0) {
        errors.additionalInterviewFee = "Enter a valid additional interview fee.";
      }
      if (!includedInterviews) {
        errors.includedInterviewsPerRole = "Included interviews is required for enterprise tier.";
      } else if (!Number.isInteger(Number(includedInterviews)) || Number(includedInterviews) < 1) {
        errors.includedInterviewsPerRole = "Enter a whole number of included interviews.";
      }
    }

    setAgreementFieldErrors(errors);
    if (Object.keys(errors).length) {
      setAgreementError("Please fix the highlighted agreement fields.");
      return false;
    }

    return true;
  };

  const closeAgreementPreview = () => {
    setAgreementPreviewOpen(false);
    if (agreementPreviewPdfUrl) {
      URL.revokeObjectURL(agreementPreviewPdfUrl);
      setAgreementPreviewPdfUrl("");
    }
  };

  const handleGenerateAgreementPreview = async () => {
    if (!backendBase) {
      setAgreementSuccess("");
      setAgreementError("Missing backend base URL configuration.");
      return;
    }

    if (!validateAgreementForm()) {
      setAgreementSuccess("");
      return;
    }

    setAgreementError("");
    setAgreementSuccess("");
    setAgreementPreviewBusy(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "").trim();
      if (!token) throw new Error("Missing session token.");

      const response = await fetch(`${backendBase}/admin/billing/agreements/preview-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildAgreementPayload()),
        credentials: "omit",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(extractErrorMessage(text));
      }

      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      if (agreementPreviewPdfUrl) URL.revokeObjectURL(agreementPreviewPdfUrl);
      setAgreementPreviewPdfUrl(nextUrl);
      setAgreementPreviewOpen(true);
    } catch (error) {
      setAgreementError(error instanceof Error ? error.message : "Could not generate agreement preview.");
    } finally {
      setAgreementPreviewBusy(false);
    }
  };

  const handleSendAgreement = async () => {
    if (!backendBase) {
      setAgreementSuccess("");
      setAgreementError("Missing backend base URL configuration.");
      return;
    }

    if (!validateAgreementForm()) {
      setAgreementSuccess("");
      return;
    }

    setAgreementSendBusy(true);
    setAgreementError("");
    setAgreementSuccess("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "").trim();
      if (!token) throw new Error("Missing session token.");

      const response = await fetch(`${backendBase}/admin/billing/agreements/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildAgreementPayload()),
        credentials: "omit",
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractErrorMessage(text));
      }

      const parsed = parseJsonSafe(text);
      const agreementId =
        parsed && typeof parsed === "object"
          ? String((parsed as { agreement?: { id?: unknown } }).agreement?.id || "").trim()
          : "";
      setAgreementSuccess(
        agreementId
          ? `Agreement sent successfully (ID: ${agreementId}).`
          : "Agreement sent successfully.",
      );
      closeAgreementPreview();
    } catch (error) {
      setAgreementError(error instanceof Error ? error.message : "Could not send agreement.");
    } finally {
      setAgreementSendBusy(false);
    }
  };

  useEffect(() => {
    let alive = true;

    const loadBilling = async () => {
      if (adminClientsLoading) return;
      if (adminClientsError) {
        if (!alive) return;
        setBillingCustomers([]);
        setStoredClientsById({});
        setInvoiceHistory([]);
        setBillingError(adminClientsError);
        setBillingLoading(false);
        return;
      }
      if (!backendBase) {
        if (!alive) return;
        setBillingCustomers([]);
        setStoredClientsById({});
        setInvoiceHistory([]);
        setBillingError("Missing backend base URL configuration.");
        setBillingLoading(false);
        return;
      }

      if (!alive) return;
      setBillingLoading(true);
      setBillingError("");

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = String(session?.access_token || "").trim();
        if (!token) throw new Error("Missing session token.");

        const [customersResponse, invoicesResponse, clientsResponse] = await Promise.all([
          fetch(`${backendBase}/admin/billing/customers`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "omit",
          }),
          fetch(`${backendBase}/admin/billing/invoices`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "omit",
          }),
          fetch(`${backendBase}/admin/clients`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "omit",
          }),
        ]);

        const [customersText, invoicesText, clientsText] = await Promise.all([
          customersResponse.text(),
          invoicesResponse.text(),
          clientsResponse.text(),
        ]);

        if (!customersResponse.ok) throw new Error(extractErrorMessage(customersText));
        if (!invoicesResponse.ok) throw new Error(extractErrorMessage(invoicesText));
        if (!clientsResponse.ok) throw new Error(extractErrorMessage(clientsText));

        const customersPayload = parseJsonSafe(customersText);
        const invoicesPayload = parseJsonSafe(invoicesText);
        const clientsPayload = parseJsonSafe(clientsText);
        const customerItems =
          customersPayload &&
          typeof customersPayload === "object" &&
          Array.isArray((customersPayload as { items?: unknown }).items)
            ? ((customersPayload as { items: unknown[] }).items || [])
            : [];
        const invoiceItems =
          invoicesPayload &&
          typeof invoicesPayload === "object" &&
          Array.isArray((invoicesPayload as { items?: unknown }).items)
            ? ((invoicesPayload as { items: unknown[] }).items || [])
            : [];
        const clientItems =
          clientsPayload &&
          typeof clientsPayload === "object" &&
          Array.isArray((clientsPayload as { items?: unknown }).items)
            ? ((clientsPayload as { items: unknown[] }).items || [])
            : [];

        const mappedCustomers = customerItems
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
          .map((item) => ({
            id: String(item.id || "").trim(),
            clientId: String(item.client_id || "").trim(),
            name: String(item.name || "").trim() || "—",
            primaryContactName: String(item.primary_contact_name || "").trim(),
            primaryContactEmail: String(item.primary_contact_email || "").trim(),
          }))
          .filter((item) => Boolean(item.id));

        const customerById = Object.fromEntries(mappedCustomers.map((customer) => [customer.id, customer]));
        const storedClients = Object.fromEntries(
          clientItems
            .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
            .map((item) => {
              const id = String(item.id || "").trim();
              const row: StoredClientRow = {
                id,
                name: String(item.name || "").trim(),
                email: String(item.email || "").trim(),
                clientAdminName: String(item.client_admin_name || "").trim(),
              };
              return [id, row] as const;
            })
            .filter(([id]) => Boolean(id)),
        );

        const mappedInvoices = invoiceItems
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
          .map((item, index) => {
            const customerId = String(item.billing_customer_id || "").trim();
            const customer = customerById[customerId];
            const customerName = String(item.customer_name || "").trim() || customer?.name || customerId || "—";
            const customerEmail =
              String(item.customer_email || "").trim() || customer?.primaryContactEmail || "";
            return {
              id: String(item.id || `invoice-${index}`),
              customerId,
              created: formatDateTime(item.created_at),
              customer: customerName,
              email: customerEmail,
              title: String(item.title || item.invoice_title || "").trim() || "—",
              amount: formatAmountFromCents(item.amount_total_cents, item.currency),
              status: normalizeInvoiceStatus(item.status),
              hostedInvoiceUrl: String(item.hosted_invoice_url || "").trim(),
            };
          })
          .filter((item) => Boolean(item.id));

        if (!alive) return;
        setBillingCustomers(mappedCustomers);
        setStoredClientsById(storedClients);
        setInvoiceHistory(mappedInvoices);
      } catch (error) {
        if (!alive) return;
        setBillingCustomers([]);
        setStoredClientsById({});
        setInvoiceHistory([]);
        setBillingError(error instanceof Error ? error.message : "Failed to load billing data.");
      } finally {
        if (alive) setBillingLoading(false);
      }
    };

    void loadBilling();
    return () => {
      alive = false;
    };
  }, [selectedClientId, adminClientsLoading, adminClientsError, refreshNonce]);

  const scopedCustomers =
    selectedClientId === "all"
      ? billingCustomers
      : billingCustomers.filter((customer) => customer.clientId === selectedClientId);
  const scopedCustomerIdSet = new Set(scopedCustomers.map((customer) => customer.id));
  const filteredInvoices =
    selectedClientId === "all"
      ? invoiceHistory
      : invoiceHistory.filter((invoice) => scopedCustomerIdSet.has(invoice.customerId));
  const clientOptions = scopedCustomers;

  useEffect(() => {
    if (!invCustomer) return;
    if (clientOptions.some((customer) => customer.id === invCustomer)) return;
    setInvCustomer("");
  }, [invCustomer, clientOptions]);

  useEffect(() => {
    return () => {
      if (agreementPreviewPdfUrl) URL.revokeObjectURL(agreementPreviewPdfUrl);
    };
  }, [agreementPreviewPdfUrl]);

  const card = "bg-white rounded-2xl mb-5 overflow-hidden";
  const cardStyle = { border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" };
  const enterpriseFeePeriod = agreementForm.billingOption === "annual" ? "per year" : "per month";

  const handleClearAgreementTextFields = () => {
    setAgreementForm((prev) => ({
      ...prev,
      clientLegalName: "",
      dbaTradeName: "",
      primaryAdmin: "",
      adminEmail: "",
      candidateAssistanceContact: "",
      platformFee: "",
      perRoleFee: "",
      additionalInterviewFee: "",
      includedInterviewsPerRole: "",
      initialTermStart: "",
      initialRenewalDate: "",
      noticeDeadlineDays: "",
    }));
    setInitialTermStartParts({ month: "", day: "", year: "" });
    setInitialRenewalDateParts({ month: "", day: "", year: "" });
    setAgreementError("");
    setAgreementSuccess("");
    setAgreementFieldErrors((prev) => {
      const next = { ...prev };
      delete next.clientLegalName;
      delete next.primaryAdmin;
      delete next.adminEmail;
      delete next.candidateAssistanceContact;
      delete next.platformFee;
      delete next.perRoleFee;
      delete next.additionalInterviewFee;
      delete next.includedInterviewsPerRole;
      delete next.initialTermStart;
      delete next.initialRenewalDate;
      return next;
    });
  };

  return (
    <AdminLayout title="Billing">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Billing</h2>
        <span className="text-xs text-[#0A1547]/35 font-medium italic">
          {selectedClientId === "all" ? "Global — not scoped to selected client" : `Scoped to ${selectedClient.name}`}
        </span>
      </div>

      {/* ── Agreement Generator ───────────────────────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-black text-[#0A1547]">Agreement Generator</p>
          <p className="text-[11px] text-[#0A1547]/45 mt-1">
            Generate a membership agreement draft PDF and send a tokenized signing link.
          </p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {agreementError ? (
            <p className="text-xs font-semibold text-red-500">{agreementError}</p>
          ) : null}
          {agreementSuccess ? (
            <p className="text-xs font-semibold text-emerald-600">{agreementSuccess}</p>
          ) : null}
          <p className="text-[11px] font-semibold text-[#0A1547]/45 px-1">
            Fields marked<span className="text-red-500">{REQUIRED_MARK}</span> are required.
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-[rgba(10,21,71,0.12)] bg-white p-1">
              <button
                type="button"
                onClick={() => setAgreementClientMode("attach_existing_client")}
                className="px-3 py-1.5 text-xs font-bold rounded-full transition-colors"
                style={{
                  backgroundColor: agreementClientMode === "attach_existing_client" ? "#A380F6" : "transparent",
                  color: agreementClientMode === "attach_existing_client" ? "white" : "rgba(10,21,71,0.65)",
                }}
              >
                Attach Existing Client
              </button>
              <button
                type="button"
                onClick={() => setAgreementClientMode("add_new_client")}
                className="px-3 py-1.5 text-xs font-bold rounded-full transition-colors"
                style={{
                  backgroundColor: agreementClientMode === "add_new_client" ? "#A380F6" : "transparent",
                  color: agreementClientMode === "add_new_client" ? "white" : "rgba(10,21,71,0.65)",
                }}
              >
                Add New Client
              </button>
            </div>
            <button
              type="button"
              onClick={handleClearAgreementTextFields}
              className="px-3 py-1.5 text-xs font-bold rounded-full border border-[rgba(10,21,71,0.14)] text-[#0A1547]/70 hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>

          {agreementClientMode === "attach_existing_client" ? (
            selectedClientId === "all" ? (
              <div className="max-w-md space-y-1">
                <p className={fieldLabelCls}>
                  Attached Client<span className="text-red-500">{REQUIRED_MARK}</span>
                </p>
                <div className="relative">
                  <select
                    className={selectCls}
                    value={agreementAttachedClientId}
                    onChange={(e) => {
                      setAgreementAttachedClientId(e.target.value);
                      setAgreementFieldErrors((prev) => {
                        if (!prev.attachedClientId) return prev;
                        const next = { ...prev };
                        delete next.attachedClientId;
                        return next;
                      });
                    }}
                  >
                    <option value="">Select existing client…</option>
                    {agreementClientOptions.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
                </div>
                {agreementFieldErrors.attachedClientId ? (
                  <p className={fieldErrorCls}>{agreementFieldErrors.attachedClientId}</p>
                ) : null}
              </div>
            ) : (
              <p className="text-xs font-semibold text-[#0A1547]/55">
                Attached client: <span className="font-black text-[#0A1547]">{selectedClient.name}</span>
              </p>
            )
          ) : (
            <p className="text-xs font-semibold text-[#0A1547]/55">
              A new client will be created from this form before the agreement is sent.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className={fieldLabelCls}>
                Client Legal Name<span className="text-red-500">{REQUIRED_MARK}</span>
              </p>
              <input
                className={inputCls}
                placeholder="Client Legal Name"
                value={agreementForm.clientLegalName}
                onChange={(e) => updateAgreementField("clientLegalName", e.target.value)}
              />
              {agreementFieldErrors.clientLegalName ? (
                <p className={fieldErrorCls}>{agreementFieldErrors.clientLegalName}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>DBA / Trade Name</p>
              <input
                className={inputCls}
                placeholder="DBA / Trade Name"
                value={agreementForm.dbaTradeName}
                onChange={(e) => updateAgreementField("dbaTradeName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>
                Primary Admin<span className="text-red-500">{REQUIRED_MARK}</span>
              </p>
              <input
                className={inputCls}
                placeholder="Primary Admin"
                value={agreementForm.primaryAdmin}
                onChange={(e) => updateAgreementField("primaryAdmin", e.target.value)}
              />
              {agreementFieldErrors.primaryAdmin ? (
                <p className={fieldErrorCls}>{agreementFieldErrors.primaryAdmin}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>
                Admin Email<span className="text-red-500">{REQUIRED_MARK}</span>
              </p>
              <input
                className={inputCls}
                type="email"
                placeholder="Admin Email"
                value={agreementForm.adminEmail}
                onChange={(e) => updateAgreementField("adminEmail", e.target.value)}
              />
              {agreementFieldErrors.adminEmail ? (
                <p className={fieldErrorCls}>{agreementFieldErrors.adminEmail}</p>
              ) : null}
            </div>
            {agreementClientMode === "add_new_client" ? (
              <div className="space-y-1">
                <p className={fieldLabelCls}>
                  Candidate Assistance Contact<span className="text-red-500">{REQUIRED_MARK}</span>
                </p>
                <input
                  className={inputCls}
                  placeholder="Candidate Assistance Contact"
                  value={agreementForm.candidateAssistanceContact}
                  onChange={(e) => updateAgreementField("candidateAssistanceContact", e.target.value)}
                />
                {agreementFieldErrors.candidateAssistanceContact ? (
                  <p className={fieldErrorCls}>{agreementFieldErrors.candidateAssistanceContact}</p>
                ) : null}
              </div>
            ) : null}
            <div className="space-y-1">
              <p className={fieldLabelCls}>Membership Tier</p>
              <div className="relative">
                <select
                  className={selectCls}
                  value={agreementForm.membershipTier}
                  onChange={(e) => updateAgreementField("membershipTier", e.target.value as AgreementFormValues["membershipTier"])}
                >
                  <option value="basic">basic</option>
                  <option value="pro">pro</option>
                  <option value="enterprise">enterprise</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>Billing Option</p>
              <div className="relative">
                <select
                  className={selectCls}
                  value={agreementForm.billingOption}
                  onChange={(e) => updateAgreementField("billingOption", e.target.value as AgreementFormValues["billingOption"])}
                >
                  <option value="monthly">monthly</option>
                  <option value="annual">annual</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>
                Initial Term Start<span className="text-red-500">{REQUIRED_MARK}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  ref={initialTermStartMonthRef}
                  className={datePartCls + " w-[72px]"}
                  inputMode="numeric"
                  placeholder="MM"
                  value={initialTermStartParts.month}
                  onChange={(e) => updateAgreementDatePart("initialTermStart", "month", e.target.value)}
                />
                <span className="text-[#0A1547]/35 font-bold">/</span>
                <input
                  ref={initialTermStartDayRef}
                  className={datePartCls + " w-[72px]"}
                  inputMode="numeric"
                  placeholder="DD"
                  value={initialTermStartParts.day}
                  onChange={(e) => updateAgreementDatePart("initialTermStart", "day", e.target.value)}
                  onKeyDown={(e) => handleAgreementDateBackspace("initialTermStart", "day", e)}
                />
                <span className="text-[#0A1547]/35 font-bold">/</span>
                <input
                  ref={initialTermStartYearRef}
                  className={datePartCls + " w-[94px]"}
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={initialTermStartParts.year}
                  onChange={(e) => updateAgreementDatePart("initialTermStart", "year", e.target.value)}
                  onKeyDown={(e) => handleAgreementDateBackspace("initialTermStart", "year", e)}
                />
              </div>
              <p className="text-[10px] text-[#0A1547]/35 px-1">MM / DD / YYYY</p>
              {agreementFieldErrors.initialTermStart ? (
                <p className={fieldErrorCls}>{agreementFieldErrors.initialTermStart}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>
                Initial Renewal Date<span className="text-red-500">{REQUIRED_MARK}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  ref={initialRenewalDateMonthRef}
                  className={datePartCls + " w-[72px]"}
                  inputMode="numeric"
                  placeholder="MM"
                  value={initialRenewalDateParts.month}
                  onChange={(e) => updateAgreementDatePart("initialRenewalDate", "month", e.target.value)}
                />
                <span className="text-[#0A1547]/35 font-bold">/</span>
                <input
                  ref={initialRenewalDateDayRef}
                  className={datePartCls + " w-[72px]"}
                  inputMode="numeric"
                  placeholder="DD"
                  value={initialRenewalDateParts.day}
                  onChange={(e) => updateAgreementDatePart("initialRenewalDate", "day", e.target.value)}
                  onKeyDown={(e) => handleAgreementDateBackspace("initialRenewalDate", "day", e)}
                />
                <span className="text-[#0A1547]/35 font-bold">/</span>
                <input
                  ref={initialRenewalDateYearRef}
                  className={datePartCls + " w-[94px]"}
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={initialRenewalDateParts.year}
                  onChange={(e) => updateAgreementDatePart("initialRenewalDate", "year", e.target.value)}
                  onKeyDown={(e) => handleAgreementDateBackspace("initialRenewalDate", "year", e)}
                />
              </div>
              <p className="text-[10px] text-[#0A1547]/35 px-1">MM / DD / YYYY</p>
              {agreementFieldErrors.initialRenewalDate ? (
                <p className={fieldErrorCls}>{agreementFieldErrors.initialRenewalDate}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>Auto-Renew</p>
              <div className="relative">
                <select
                  className={selectCls}
                  value={agreementForm.autoRenew}
                  onChange={(e) => updateAgreementField("autoRenew", e.target.value as AgreementFormValues["autoRenew"])}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={fieldLabelCls}>Notice Deadline (Days)</p>
              <input
                className={inputCls}
                type="number"
                min="1"
                placeholder="Notice Deadline (days)"
                value={agreementForm.noticeDeadlineDays}
                onChange={(e) => updateAgreementField("noticeDeadlineDays", e.target.value)}
              />
            </div>
          </div>
          {agreementForm.membershipTier === "enterprise" ? (
            <div className="space-y-3 pt-1">
              <p className="px-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/45">
                Enterprise Pricing Configuration
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className={fieldLabelCls}>
                    Membership Fee ({enterpriseFeePeriod})<span className="text-red-500">{REQUIRED_MARK}</span>
                  </p>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={agreementForm.platformFee}
                    onChange={(e) => updateAgreementField("platformFee", e.target.value)}
                  />
                  {agreementFieldErrors.platformFee ? (
                    <p className={fieldErrorCls}>{agreementFieldErrors.platformFee}</p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <p className={fieldLabelCls}>
                    Per-Role Fee ({enterpriseFeePeriod})<span className="text-red-500">{REQUIRED_MARK}</span>
                  </p>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={agreementForm.perRoleFee}
                    onChange={(e) => updateAgreementField("perRoleFee", e.target.value)}
                  />
                  {agreementFieldErrors.perRoleFee ? (
                    <p className={fieldErrorCls}>{agreementFieldErrors.perRoleFee}</p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <p className={fieldLabelCls}>
                    Included Interviews (Per Role)<span className="text-red-500">{REQUIRED_MARK}</span>
                  </p>
                  <input
                    className={inputCls}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    value={agreementForm.includedInterviewsPerRole}
                    onChange={(e) => updateAgreementField("includedInterviewsPerRole", e.target.value)}
                  />
                  {agreementFieldErrors.includedInterviewsPerRole ? (
                    <p className={fieldErrorCls}>{agreementFieldErrors.includedInterviewsPerRole}</p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <p className={fieldLabelCls}>
                    Additional Interview Fee ($)<span className="text-red-500">{REQUIRED_MARK}</span>
                  </p>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={agreementForm.additionalInterviewFee}
                    onChange={(e) => updateAgreementField("additionalInterviewFee", e.target.value)}
                  />
                  {agreementFieldErrors.additionalInterviewFee ? (
                    <p className={fieldErrorCls}>{agreementFieldErrors.additionalInterviewFee}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { void handleGenerateAgreementPreview(); }}
              disabled={agreementPreviewBusy}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all"
              style={{
                backgroundColor: agreementPreviewBusy ? "rgba(10,21,71,0.2)" : "#A380F6",
                cursor: agreementPreviewBusy ? "not-allowed" : "pointer",
              }}
            >
              {agreementPreviewBusy ? "Generating..." : "Generate Agreement"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Create Billing Customer ─────────────────────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-black text-[#0A1547]">Create Billing Customer</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input className={inputCls} placeholder="Company name"          value={cbcCompany}  onChange={(e) => setCbcCompany(e.target.value)}  />
            <input className={inputCls} placeholder="Primary contact name"  value={cbcContact}  onChange={(e) => setCbcContact(e.target.value)}  />
            <input className={inputCls} placeholder="Primary contact email" type="email" value={cbcEmail} onChange={(e) => setCbcEmail(e.target.value)} />
          </div>
          <div className="flex gap-3 items-start">
            <input className={inputCls + " flex-1"} placeholder="Notes (optional)" value={cbcNotes} onChange={(e) => setCbcNotes(e.target.value)} />
            <button
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#A380F6" }}
            >
              Create billing customer
            </button>
          </div>
        </div>
      </div>

      {/* ── Send Invoice ────────────────────────────────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-black text-[#0A1547]">Send Invoice</p>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                className={selectCls}
                value={invCustomer}
                onChange={(e) => setInvCustomer(e.target.value)}
              >
                <option value="">Select billing customer…</option>
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
            </div>
            <input
              className={inputCls}
              placeholder="Invoice title"
              value={invTitle}
              onChange={(e) => setInvTitle(e.target.value)}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3 items-start">
            <input
              className={inputCls}
              placeholder="Invoice description (optional)"
              value={invDesc}
              onChange={(e) => setInvDesc(e.target.value)}
            />
            <div>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={invDays}
                onChange={(e) => setInvDays(e.target.value)}
              />
              <p className="text-[10px] text-[#0A1547]/35 mt-1 px-1">
                Number of days the customer has to pay after the invoice is sent.
              </p>
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="grid grid-cols-[1fr_80px_120px_44px] gap-2 mb-2">
              {["Description", "Qty", "Unit ($)", "Remove"].map((h) => (
                <p key={h} className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 px-1">{h}</p>
              ))}
            </div>
            <div className="space-y-2">
              {lineItems.map((li) => (
                <div key={li.id} className="grid grid-cols-[1fr_80px_120px_44px] gap-2 items-center">
                  <input
                    className={inputCls}
                    placeholder="Line item description"
                    value={li.description}
                    onChange={(e) => updateLineItem(li.id, "description", e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    className={inputCls + " text-center"}
                    value={li.qty}
                    onChange={(e) => updateLineItem(li.id, "qty", parseInt(e.target.value) || 1)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputCls}
                    placeholder="0.00"
                    value={li.unit}
                    onChange={(e) => updateLineItem(li.id, "unit", e.target.value)}
                  />
                  <button
                    className="flex items-center justify-center p-2 rounded-xl text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                    onClick={() => removeLineItem(li.id)}
                    disabled={lineItems.length === 1}
                    style={{ opacity: lineItems.length === 1 ? 0.3 : 1 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#A380F6" }}
              onClick={addLineItem}
            >
              <Plus className="w-3.5 h-3.5" />
              Add line item
            </button>

            <button
              disabled={!canSendInvoice}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all"
              style={{
                backgroundColor: canSendInvoice ? "#A380F6" : "rgba(10,21,71,0.08)",
                color:           canSendInvoice ? "white"   : "rgba(10,21,71,0.25)",
                cursor:          canSendInvoice ? "pointer" : "not-allowed",
              }}
            >
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── Invoice History ─────────────────────────────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-[#0A1547]">Invoice History</p>
          <button
            onClick={() => setRefreshNonce((value) => value + 1)}
            disabled={billingLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A380F6" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${billingLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  ["Created",  "pl-5"],
                  ["Customer", ""],
                  ["Title",    ""],
                  ["Amount",   ""],
                  ["Status",   ""],
                  ["Link",     "pr-5 text-center"],
                ].map(([label, cls]) => (
                  <th key={label} className={`px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 ${cls}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {billingLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-sm text-[#0A1547]/30 font-semibold">
                    Loading billing data...
                  </td>
                </tr>
              ) : billingError ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-sm text-red-500 font-semibold">
                    {billingError}
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-sm text-[#0A1547]/30 font-semibold">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv, idx) => {
                  const sc = statusColors[inv.status];
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      style={idx === filteredInvoices.length - 1 ? { borderBottom: "none" } : {}}
                    >
                      <td className="px-4 py-4 pl-5">
                        <p className="text-xs font-semibold text-[#0A1547]/60">{inv.created}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-[#0A1547]">{inv.customer}</p>
                        <p className="text-[11px] text-[#0A1547]/40">{inv.email || "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#0A1547]/70 font-medium">{inv.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-[#0A1547]">{inv.amount}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 pr-5 text-center">
                        {inv.hostedInvoiceUrl ? (
                          <button
                            onClick={() => window.open(inv.hostedInvoiceUrl, "_blank", "noopener,noreferrer")}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 mx-auto"
                            style={{ backgroundColor: "#A380F6" }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </button>
                        ) : (
                          <span className="text-xs text-[#0A1547]/30 font-semibold">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {agreementPreviewOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            onClick={closeAgreementPreview}
            className="absolute inset-0 bg-[#0A1547]/45"
            aria-label="Close agreement preview"
          />
          <div
            className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(10,21,71,0.10)", boxShadow: "0 20px 44px rgba(10,21,71,0.24)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Agreement Preview</p>
                <h3 className="text-sm font-black text-[#0A1547] leading-snug">alphaScreen Membership Agreement (Draft)</h3>
              </div>
              <button
                type="button"
                onClick={closeAgreementPreview}
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[#0A1547]/40 hover:text-[#0A1547] hover:bg-gray-100 transition-colors"
                aria-label="Close agreement preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-[calc(92vh-72px)] space-y-4">
              {!agreementPreviewPdfUrl ? (
                <p className="text-xs font-semibold text-[#0A1547]/45">Preparing agreement preview…</p>
              ) : (
                <iframe
                  title="Agreement Preview PDF"
                  src={agreementPreviewPdfUrl}
                  className="w-full min-h-[72vh] rounded-xl border border-gray-200"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAgreementPreview}
                  className="px-4 py-2 text-xs font-bold rounded-full border border-gray-200 text-[#0A1547]/70 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => { void handleSendAgreement(); }}
                  disabled={agreementSendBusy}
                  className="px-4 py-2 text-xs font-bold text-white rounded-full transition-colors"
                  style={{
                    backgroundColor: agreementSendBusy ? "#8F73D1" : "#A380F6",
                    cursor: agreementSendBusy ? "wait" : "pointer",
                  }}
                >
                  {agreementSendBusy ? "Sending..." : "Send Agreement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
