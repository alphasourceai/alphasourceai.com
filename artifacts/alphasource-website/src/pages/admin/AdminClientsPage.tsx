import { useState } from "react";
import {
  ChevronRight, Trash2, RefreshCw, ChevronUp, ChevronDown,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ── Types ───────────────────────────────────────────────────── */
type PlanTier    = "basic" | "pro" | "enterprise" | null;
type BillingCycle = "Monthly" | "Annual" | null;
type BillingStatus = "active" | "inactive";
type AccessOverride = "Inherit" | "Force Active" | "Force Inactive";

interface Client {
  id:           string;
  name:         string;
  letter:       string;
  color:        string;
  createdDate:  string;
  planTier:     PlanTier;
  billingStatus: BillingStatus;
  billingCycle: BillingCycle;
  autoRenew:    boolean;
  stripeMembership: string | null;
  contract:     string | null;
  periodEnds:   string | null;
}

/* ── Dummy data (will be replaced by Supabase) ───────────────── */
const CLIENTS: Client[] = [
  {
    id: "acme",
    name: "Acme Dental Group",
    letter: "A", color: "#A380F6",
    createdDate: "1/15/2026, 9:00:00 AM",
    planTier: "basic",     billingStatus: "active",
    billingCycle: "Monthly", autoRenew: true,
    stripeMembership: "active",
    contract: "1/15/2026 – 1/15/2027",
    periodEnds: "5/15/2026",
  },
  {
    id: "ridge",
    name: "Ridge Medical Partners",
    letter: "R", color: "#02ABE0",
    createdDate: "2/1/2026, 10:30:00 AM",
    planTier: "pro",       billingStatus: "active",
    billingCycle: "Monthly", autoRenew: true,
    stripeMembership: "active",
    contract: "2/1/2026 – 2/1/2027",
    periodEnds: "5/1/2026",
  },
  {
    id: "summit",
    name: "Summit Health Network",
    letter: "S", color: "#02D99D",
    createdDate: "3/1/2026, 8:15:00 AM",
    planTier: "basic",     billingStatus: "active",
    billingCycle: "Annual",  autoRenew: true,
    stripeMembership: "active",
    contract: "3/1/2026 – 3/1/2027",
    periodEnds: "3/1/2027",
  },
  {
    id: "crestwood",
    name: "Crestwood Orthopedics",
    letter: "C", color: "#F0A500",
    createdDate: "3/15/2026, 2:45:00 PM",
    planTier: "pro",       billingStatus: "active",
    billingCycle: "Monthly", autoRenew: true,
    stripeMembership: "active",
    contract: "3/15/2026 – 3/15/2027",
    periodEnds: "5/15/2026",
  },
  {
    id: "lakeside",
    name: "Lakeside Dermatology",
    letter: "L", color: "#FF6B6B",
    createdDate: "10/12/2025, 11:20:00 AM",
    planTier: null,        billingStatus: "inactive",
    billingCycle: null,    autoRenew: false,
    stripeMembership: null, contract: null, periodEnds: null,
  },
  {
    id: "pinnacle",
    name: "Pinnacle Surgical Group",
    letter: "P", color: "#5B6FBB",
    createdDate: "2/20/2026, 3:00:00 PM",
    planTier: "basic",     billingStatus: "active",
    billingCycle: "Monthly", autoRenew: true,
    stripeMembership: "active",
    contract: "2/20/2026 – 2/20/2027",
    periodEnds: "5/20/2026",
  },
  {
    id: "harbor",
    name: "Harbor Cove Family Health",
    letter: "H", color: "#0285B0",
    createdDate: "11/5/2025, 4:10:00 PM",
    planTier: null,        billingStatus: "inactive",
    billingCycle: null,    autoRenew: false,
    stripeMembership: null, contract: null, periodEnds: null,
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const planColors: Record<string, { bg: string; text: string }> = {
  basic:      { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  pro:        { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
  enterprise: { bg: "rgba(2,217,157,0.12)",   text: "#009E73" },
};

function PlanBadge({ tier }: { tier: PlanTier }) {
  if (!tier) return <span className="text-sm text-[#0A1547]/25">—</span>;
  const c = planColors[tier];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: BillingStatus }) {
  const active = status === "active";
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
        style={{ color: active ? "#02D99D" : "#FF6B6B" }}
      >
        {status}
      </p>
      <p className="text-xs font-semibold text-[#0A1547]/40">Inherited</p>
    </div>
  );
}

type SortKey = "name" | "planTier" | "billingStatus" | "billingCycle";
type SortDir = "asc" | "desc";

/* ── Input / Select helpers ──────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium " +
  "border border-[rgba(10,21,71,0.10)] bg-white " +
  "placeholder:text-[#0A1547]/30 focus:outline-none focus:border-[#A380F6] transition-colors";

const selectCls =
  "w-full px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium " +
  "border border-[rgba(10,21,71,0.10)] bg-white appearance-none " +
  "focus:outline-none focus:border-[#A380F6] transition-colors cursor-pointer";

/* ── Main component ──────────────────────────────────────────── */
export default function AdminClientsPage() {
  const [expandedId, setExpandedId]           = useState<string | null>(null);
  const [sortKey,    setSortKey]              = useState<SortKey>("name");
  const [sortDir,    setSortDir]              = useState<SortDir>("asc");
  const [overrides,  setOverrides]            = useState<Record<string, AccessOverride>>({});
  const [checkoutPlan, setCheckoutPlan]       = useState<Record<string, string>>({});
  const [checkoutCycle, setCheckoutCycle]     = useState<Record<string, string>>({});

  /* form state */
  const [form, setForm] = useState({
    clientName: "", adminName: "", adminEmail: "",
    candidateContact: "", managerRole: "standard",
  });

  /* sort */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...CLIENTS].sort((a, b) => {
    let av = a[sortKey] ?? "";
    let bv = b[sortKey] ?? "";
    av = String(av).toLowerCase();
    bv = String(bv).toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1  : -1;
    return 0;
  });

  const toggleExpand = (id: string) =>
    setExpandedId((cur) => (cur === id ? null : id));

  /* sort indicator */
  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronDown className="w-3 h-3 text-[#0A1547]/20 ml-0.5 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />;
  }

  return (
    <AdminLayout title="Clients">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Clients</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#A380F6" }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Process Renewals
        </button>
      </div>

      {/* ── Create client form ────────────────────────────── */}
      <div
        className="bg-white rounded-2xl p-5 mb-5"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            className={inputCls}
            placeholder="Client name"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Client admin name"
            value={form.adminName}
            onChange={(e) => setForm({ ...form, adminName: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Admin email"
            type="email"
            value={form.adminEmail}
            onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <input
            className={inputCls}
            placeholder="Candidate assistance contact (email)"
            type="email"
            value={form.candidateContact}
            onChange={(e) => setForm({ ...form, candidateContact: e.target.value })}
          />
          <div className="relative flex-shrink-0 w-48">
            <select
              className={selectCls}
              value={form.managerRole}
              onChange={(e) => setForm({ ...form, managerRole: e.target.value })}
            >
              <option value="standard">Manager (standard)</option>
              <option value="tester">Manager (tester)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
          </div>
          <button
            className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A380F6" }}
            onClick={() => {/* placeholder */}}
          >
            Create
          </button>
        </div>
      </div>

      {/* ── Clients table ─────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_110px_130px_120px_90px_56px] items-center px-5 py-3 border-b border-gray-100">
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors text-left"
            onClick={() => handleSort("name")}
          >
            Name <SortIcon col="name" />
          </button>
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("planTier")}
          >
            Plan tier <SortIcon col="planTier" />
          </button>
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("billingStatus")}
          >
            Billing status <SortIcon col="billingStatus" />
          </button>
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("billingCycle")}
          >
            Billing cycle <SortIcon col="billingCycle" />
          </button>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
            Auto-Renew
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
            Remove
          </p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {sorted.map((client) => {
            const expanded = expandedId === client.id;
            const override = overrides[client.id] ?? "Inherit";
            const cpPlan   = checkoutPlan[client.id]  ?? "basic";
            const cpCycle  = checkoutCycle[client.id] ?? "Monthly";
            const isActive = client.billingStatus === "active";

            return (
              <div key={client.id}>
                {/* Main row */}
                <div
                  className={`grid grid-cols-[1fr_110px_130px_120px_90px_56px] items-center px-5 py-3.5
                    cursor-pointer transition-colors hover:bg-gray-50/70
                    ${expanded ? "bg-[rgba(163,128,246,0.04)]" : ""}`}
                  onClick={() => toggleExpand(client.id)}
                >
                  {/* Name + created date */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ChevronRight
                      className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: expanded ? "#A380F6" : "rgba(10,21,71,0.25)",
                        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0A1547] leading-snug truncate">
                        {client.name}
                      </p>
                      <p className="text-[10px] text-[#0A1547]/35 mt-0.5">
                        Created {client.createdDate}
                      </p>
                    </div>
                  </div>

                  <div>
                    <PlanBadge tier={client.planTier} />
                  </div>

                  <div>
                    <StatusBadge status={client.billingStatus} />
                  </div>

                  <p className="text-sm text-[#0A1547]/50 font-semibold">
                    {client.billingCycle ?? "—"}
                  </p>

                  {/* Auto-renew checkbox */}
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        client.autoRenew
                          ? "border-[#A380F6] bg-[#A380F6]"
                          : "border-[rgba(10,21,71,0.15)] bg-transparent"
                      }`}
                    >
                      {client.autoRenew && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="flex items-center justify-center">
                    <button
                      className="p-1.5 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                      title={`Remove ${client.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail panel */}
                {expanded && (
                  <div
                    className="px-8 py-5 border-t border-[rgba(163,128,246,0.12)]"
                    style={{ backgroundColor: "rgba(248,249,253,0.8)", borderLeft: "3px solid #A380F6" }}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">

                      {/* Left: Membership details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-[#0A1547] mb-2">Membership details</p>
                        <div className="space-y-1.5">
                          {[
                            ["Billing status", <span className="font-bold" style={{ color: isActive ? "#02D99D" : "#FF6B6B" }}>{client.billingStatus}</span>],
                            ["Stripe membership", client.stripeMembership ?? "—"],
                            ["Billing cycle",      client.billingCycle ?? "—"],
                            ["Contract",           client.contract ?? "—"],
                            ["Current billing period ends", client.periodEnds ?? "—"],
                            ["Renewal",            client.autoRenew ? "Auto-renew on" : "Auto-renew off"],
                          ].map(([label, value]) => (
                            <div key={String(label)} className="flex items-baseline gap-1.5 text-xs">
                              <span className="text-[#0A1547]/40 font-semibold flex-shrink-0">{String(label)}:</span>
                              <span className="text-[#0A1547]/70 font-semibold">{value as React.ReactNode}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex flex-col gap-4 lg:w-80">

                        {/* Active client actions */}
                        {isActive && (
                          <div className="flex items-center gap-3">
                            <button
                              className="px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0"
                              style={{ backgroundColor: "#A380F6" }}
                            >
                              Cancel Contract
                            </button>
                          </div>
                        )}

                        {/* Access override */}
                        <div>
                          <p className="text-xs font-black text-[#0A1547] mb-2">Access override</p>
                          <div className="relative">
                            <select
                              className={selectCls}
                              value={override}
                              onChange={(e) =>
                                setOverrides((prev) => ({
                                  ...prev,
                                  [client.id]: e.target.value as AccessOverride,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option>Inherit</option>
                              <option>Force Active</option>
                              <option>Force Inactive</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
                          </div>
                        </div>

                        {/* Inactive-only: Membership Checkout Link */}
                        {!isActive && (
                          <div>
                            <p className="text-xs font-black text-[#0A1547] mb-2">Membership Checkout Link</p>
                            <div className="flex gap-2 mb-2">
                              <div className="relative flex-1">
                                <select
                                  className={selectCls}
                                  value={cpPlan}
                                  onChange={(e) =>
                                    setCheckoutPlan((prev) => ({ ...prev, [client.id]: e.target.value }))
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="basic">Basic</option>
                                  <option value="pro">Pro</option>
                                  <option value="enterprise">Enterprise</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
                              </div>
                              <div className="relative flex-1">
                                <select
                                  className={selectCls}
                                  value={cpCycle}
                                  onChange={(e) =>
                                    setCheckoutCycle((prev) => ({ ...prev, [client.id]: e.target.value }))
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option>Monthly</option>
                                  <option>Annual</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
                              </div>
                            </div>

                            {/* Enterprise extra fields */}
                            {cpPlan === "enterprise" && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {["Membership ($)", "Per-role fee ($)", "Included interviews", "Additional interview fee ($)"].map((ph) => (
                                  <input key={ph} className={inputCls} placeholder={ph} />
                                ))}
                              </div>
                            )}

                            <button
                              className="w-full px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
                              style={{ backgroundColor: "#A380F6" }}
                              onClick={(e) => { e.stopPropagation(); /* placeholder */ }}
                            >
                              Send Checkout Link
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
