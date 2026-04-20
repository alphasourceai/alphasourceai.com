import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

interface SignerPageProps {
  params?: {
    token?: string;
  };
}

interface SignerSession {
  agreement_id: string;
  client_legal_name: string;
  dba_trade_name: string;
  primary_admin_name: string;
  admin_email: string;
  membership_tier: string;
  billing_option: string;
  auto_renew: boolean;
  notice_deadline_days: number;
  initial_term_start: string;
  initial_renewal_date: string;
  expires_at: string;
  sent_at: string;
  opened_at: string;
  draft_pdf_url: string | null;
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

function extractErrorMessage(text: string, fallback: string): string {
  if (!text) return fallback;
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

function formatDate(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDisplayText(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function MembershipAgreementSignerPage({ params }: SignerPageProps) {
  const token = useMemo(() => {
    const raw = String(params?.token || "").trim();
    if (!raw) return "";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params?.token]);

  const [session, setSession] = useState<SignerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const [typedName, setTypedName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const hasStrokeRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#0A1547";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    prepareCanvas();
    const onResize = () => {
      prepareCanvas();
      hasStrokeRef.current = false;
      setHasSignature(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [prepareCanvas]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getPoint(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getPoint(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    if (!hasStrokeRef.current) {
      hasStrokeRef.current = true;
      setHasSignature(true);
    }
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    drawingRef.current = false;
  };

  const clearSignature = () => {
    prepareCanvas();
    hasStrokeRef.current = false;
    setHasSignature(false);
  };

  const loadSession = useCallback(async () => {
    if (!token) {
      setSession(null);
      setSessionError("This signing link is invalid.");
      setLoading(false);
      return;
    }

    if (!backendBase) {
      setSession(null);
      setSessionError("Missing backend base URL configuration.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setSessionError("");

    try {
      const response = await fetch(`${backendBase}/membership-agreements/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ token }),
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractErrorMessage(text, "Could not load agreement session."));
      }

      const payload = parseJsonSafe(text);
      const sessionPayload =
        payload &&
        typeof payload === "object" &&
        (payload as { session?: unknown }).session &&
        typeof (payload as { session?: unknown }).session === "object"
          ? ((payload as { session: Record<string, unknown> }).session || null)
          : null;

      if (!sessionPayload) throw new Error("Could not load agreement session.");

      setSession({
        agreement_id: String(sessionPayload.agreement_id || "").trim(),
        client_legal_name: String(sessionPayload.client_legal_name || "").trim(),
        dba_trade_name: String(sessionPayload.dba_trade_name || "").trim(),
        primary_admin_name: String(sessionPayload.primary_admin_name || "").trim(),
        admin_email: String(sessionPayload.admin_email || "").trim(),
        membership_tier: String(sessionPayload.membership_tier || "").trim(),
        billing_option: String(sessionPayload.billing_option || "").trim(),
        auto_renew: Boolean(sessionPayload.auto_renew),
        notice_deadline_days: Number(sessionPayload.notice_deadline_days || 0) || 0,
        initial_term_start: String(sessionPayload.initial_term_start || "").trim(),
        initial_renewal_date: String(sessionPayload.initial_renewal_date || "").trim(),
        expires_at: String(sessionPayload.expires_at || "").trim(),
        sent_at: String(sessionPayload.sent_at || "").trim(),
        opened_at: String(sessionPayload.opened_at || "").trim(),
        draft_pdf_url: String(sessionPayload.draft_pdf_url || "").trim() || null,
      });
      setTypedName(String(sessionPayload.primary_admin_name || "").trim());
      setAccepted(false);
      setSubmitError("");
      setSubmitSuccess(false);
      clearSignature();
    } catch (error) {
      setSession(null);
      setSessionError(error instanceof Error ? error.message : "Could not load agreement session.");
    } finally {
      setLoading(false);
    }
  }, [token, prepareCanvas]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const handleSubmit = async () => {
    if (submitBusy || submitSuccess) return;
    setSubmitError("");

    if (!backendBase) {
      setSubmitError("Missing backend base URL configuration.");
      return;
    }
    if (!token) {
      setSubmitError("Invalid signing token.");
      return;
    }
    if (!typedName.trim()) {
      setSubmitError("Typed name is required.");
      return;
    }
    if (!accepted) {
      setSubmitError("You must accept the agreement before signing.");
      return;
    }
    if (!hasSignature) {
      setSubmitError("A drawn signature is required.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setSubmitError("Signature pad is not available.");
      return;
    }

    const signatureDataUrl = canvas.toDataURL("image/png");

    setSubmitBusy(true);
    try {
      const response = await fetch(`${backendBase}/membership-agreements/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          token,
          typed_name: typedName.trim(),
          accepted,
          signature_image_data_url: signatureDataUrl,
        }),
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractErrorMessage(text, "Could not complete signature."));
      }

      setSubmitSuccess(true);
      setSubmitError("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not complete signature.");
    } finally {
      setSubmitBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F6F8FF] px-4 py-8 sm:px-6 sm:py-10"
      style={{ fontFamily: "'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div
          className="rounded-2xl bg-white px-5 py-4 sm:px-6"
          style={{ border: "1px solid rgba(10,21,71,0.08)", boxShadow: "0 8px 26px rgba(10,21,71,0.08)" }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">alphaScreen</p>
          <h1 className="mt-1 text-lg sm:text-xl font-black text-[#0A1547]">Membership Agreement Signature</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#0A1547]/60">
            Review the agreement draft, then type your name, confirm acceptance, and draw your signature.
          </p>
        </div>

        <div
          className="rounded-2xl bg-white px-5 py-5 sm:px-6"
          style={{ border: "1px solid rgba(10,21,71,0.08)", boxShadow: "0 8px 26px rgba(10,21,71,0.08)" }}
        >
          {loading ? (
            <p className="text-sm font-semibold text-[#0A1547]/55">Loading agreement session...</p>
          ) : sessionError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="flex items-start gap-2 text-sm font-semibold text-red-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {sessionError}
              </p>
              <button
                type="button"
                onClick={() => {
                  void loadSession();
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#A380F6] px-4 py-2 text-xs font-bold text-white hover:opacity-90"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          ) : !session ? (
            <p className="text-sm font-semibold text-[#0A1547]/55">No agreement session available.</p>
          ) : submitSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
              <p className="flex items-start gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                Agreement signed successfully. A signed copy has been sent by email.
              </p>
              <p className="mt-2 text-xs text-emerald-700/90">
                Our team will handle checkout manually next.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 px-3.5 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Client</p>
                  <p className="mt-1 text-sm font-bold text-[#0A1547]">{session.client_legal_name || "—"}</p>
                  <p className="text-[11px] text-[#0A1547]/55">{session.dba_trade_name || "No DBA"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 px-3.5 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Membership</p>
                  <p className="mt-1 text-sm font-bold text-[#0A1547]">{toDisplayText(session.membership_tier)}</p>
                  <p className="text-[11px] text-[#0A1547]/55">Billing: {toDisplayText(session.billing_option)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 px-3.5 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Primary Admin</p>
                  <p className="mt-1 text-sm font-bold text-[#0A1547]">{session.primary_admin_name || "—"}</p>
                  <p className="text-[11px] text-[#0A1547]/55">{session.admin_email || "—"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 px-3.5 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Link Expires</p>
                  <p className="mt-1 text-sm font-bold text-[#0A1547]">{formatDate(session.expires_at)}</p>
                  <p className="text-[11px] text-[#0A1547]/55">Notice deadline: {session.notice_deadline_days || 30} days</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#0A1547]/40">Agreement Preview</p>
                {session.draft_pdf_url ? (
                  <iframe
                    title="Membership Agreement Draft Preview"
                    src={session.draft_pdf_url}
                    className="min-h-[420px] w-full rounded-xl border border-gray-200"
                  />
                ) : (
                  <p className="rounded-xl border border-gray-200 px-3.5 py-3 text-xs font-semibold text-[#0A1547]/55">
                    Preview is unavailable, but you can still complete the signature flow.
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-gray-200 px-3.5 py-3.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                  Typed Name
                  <input
                    type="text"
                    value={typedName}
                    onChange={(event) => setTypedName(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[rgba(10,21,71,0.12)] bg-white px-3 py-2.5 text-sm font-semibold text-[#0A1547] outline-none transition-colors focus:border-[#A380F6]"
                    placeholder="Type your legal name"
                  />
                </label>

                <label className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-[#0A1547]/75">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#A380F6]"
                  />
                  I have read and agree to the alphaScreen Membership Agreement.
                </label>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Draw Signature</p>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-bold text-[#0A1547]/65 hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    onPointerCancel={stopDrawing}
                    className="h-[190px] w-full rounded-xl border border-dashed border-[#A380F6]/45 bg-white"
                    style={{ touchAction: "none" }}
                  />
                </div>

                {submitError ? <p className="text-xs font-semibold text-red-500">{submitError}</p> : null}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      void handleSubmit();
                    }}
                    disabled={submitBusy}
                    className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all"
                    style={{
                      backgroundColor: submitBusy ? "rgba(10,21,71,0.25)" : "#A380F6",
                      cursor: submitBusy ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitBusy ? "Submitting..." : "Sign Agreement"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
