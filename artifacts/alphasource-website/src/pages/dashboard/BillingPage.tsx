import { useState } from "react";
import { ChevronDown, ShoppingCart, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useClient } from "@/context/ClientContext";
import InfoTooltip from "@/components/InfoTooltip";

/* ── Placeholder billing data (same for all clients until Supabase) ── */
const BILLING = {
  planTier:           "Enterprise",
  billingStatus:      "Active",
  billingCycle:       "Annual",
  autoRenew:          "Yes",
  currentTermEnd:     "Mar 16, 2027",
  contractEndDate:    "Mar 16, 2027",
  membershipStatus:   "Active",
  accessStatus:       "Inherited",
};

const PURCHASED_INTERVIEWS = [
  { role: "Dental Hygienist",       purchased: 50 },
  { role: "Front Desk Coordinator", purchased: 50 },
  { role: "Dental Assistant",       purchased: 25 },
  { role: "Office Manager",         purchased: 25 },
];

/* ── Status badge colors ── */
function statusStyle(value: string): { bg: string; text: string } {
  const v = value.toLowerCase();
  if (v === "active")   return { bg: "rgba(2,217,157,0.12)",   text: "#009E73" };
  if (v === "inactive") return { bg: "rgba(255,107,107,0.12)", text: "#CC3B3B" };
  if (v === "annual")   return { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" };
  if (v === "monthly")  return { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" };
  if (v === "yes")      return { bg: "rgba(2,217,157,0.12)",   text: "#009E73" };
  if (v === "no")       return { bg: "rgba(255,107,107,0.12)", text: "#CC3B3B" };
  return { bg: "rgba(10,21,71,0.06)", text: "#0A1547" };
}

function ValueBadge({ value }: { value: string }) {
  const s = statusStyle(value);
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {value}
    </span>
  );
}

/* ── Info card matching Overview top-bar style ── */
function InfoCard({
  label,
  value,
  accent,
  badge,
  tooltip,
}: {
  label: string;
  value: string;
  accent: string;
  badge?: boolean;
  tooltip?: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[90px]"
      style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-2 mt-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 flex items-center gap-1">
          {label}
          {tooltip && <InfoTooltip content={tooltip} side="bottom" />}
        </p>
      </div>
      <div className="mt-2">
        {badge ? (
          <ValueBadge value={value} />
        ) : (
          <p className="text-[15px] font-black text-[#0A1547] leading-snug">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { selectedClient } = useClient();
  const clientName = selectedClient.id === "all" ? "All Clients" : selectedClient.name;

  const [selectedRole, setSelectedRole] = useState("");
  const [quantity, setQuantity]         = useState(1);

  const canPurchase = selectedRole !== "" && quantity >= 1;

  return (
    <DashboardLayout title="Billing">

      {/* ── Section 1: Billing Info ───────────────────── */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <h2 className="text-base font-black text-[#0A1547] mb-5">
          Billing Info
          {selectedClient.id !== "all" && (
            <span className="ml-2 text-base font-semibold text-[#0A1547]/40">for {clientName}</span>
          )}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <InfoCard
            label="Plan Tier"
            value={BILLING.planTier}
            accent="#A380F6"
            tooltip="Your current subscription plan level"
          />
          <InfoCard
            label="Billing Status"
            value={BILLING.billingStatus}
            accent="#02D99D"
            badge
            tooltip="Whether your account is in good standing"
          />
          <InfoCard
            label="Billing Cycle"
            value={BILLING.billingCycle}
            accent="#02ABE0"
            badge
            tooltip="How frequently your subscription renews"
          />
          <InfoCard
            label="Auto-Renew"
            value={BILLING.autoRenew}
            accent="#A380F6"
            badge
            tooltip="Whether your subscription renews automatically at term end"
          />
          <InfoCard
            label="Current Term End"
            value={BILLING.currentTermEnd}
            accent="#02ABE0"
            tooltip="The date your current billing term expires"
          />
          <InfoCard
            label="Contract End Date"
            value={BILLING.contractEndDate}
            accent="#02D99D"
            tooltip="The final date of your signed contract period"
          />
          <InfoCard
            label="Membership Status"
            value={BILLING.membershipStatus}
            accent="#A380F6"
            badge
            tooltip="Overall membership standing for this account"
          />
          <InfoCard
            label="Access Status"
            value={BILLING.accessStatus}
            accent="#02ABE0"
            tooltip="How dashboard access is granted — Inherited means access flows from the parent account"
          />
        </div>
      </div>

      {/* ── Section 2: Purchase Additional Interviews ── */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <div className="flex items-center gap-1.5 mb-5">
          <h2 className="text-base font-black text-[#0A1547]">Purchase Additional Interviews</h2>
          <InfoTooltip content="Select a role and quantity, then click Purchase to add interview credits. Processed via Stripe." side="bottom" />
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          {/* Role select */}
          <div className="flex-1 min-w-[220px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
              Role
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all cursor-pointer pr-9"
              >
                <option value="">Select a role…</option>
                <option value="dental-hygienist">Dental Hygienist</option>
                <option value="front-desk">Front Desk Coordinator</option>
                <option value="dental-assistant">Dental Assistant</option>
                <option value="office-manager">Office Manager</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/40 pointer-events-none" />
            </div>
          </div>

          {/* Quantity */}
          <div className="w-32">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all text-center"
            />
          </div>

          {/* Purchase button */}
          <button
            disabled={!canPurchase}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-full transition-all flex-shrink-0"
            style={{
              backgroundColor: canPurchase ? "#A380F6" : "rgba(163,128,246,0.35)",
              cursor: canPurchase ? "pointer" : "not-allowed",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Purchase Additional Interviews
          </button>
        </div>
      </div>

      {/* ── Section 3: Purchased Interviews Table ────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-6"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center gap-1.5">
          <h2 className="text-base font-black text-[#0A1547]">Additional Interviews Purchased</h2>
          <InfoTooltip content="Interview credits purchased beyond your base plan quota, broken down by role" side="bottom" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Role
                </th>
                <th className="text-right px-6 py-3.5 pr-8 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Interviews Purchased
                </th>
              </tr>
            </thead>
            <tbody>
              {PURCHASED_INTERVIEWS.map((row, idx) => (
                <tr
                  key={row.role}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  style={idx === PURCHASED_INTERVIEWS.length - 1 ? { borderBottom: "none" } : {}}
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#0A1547]">{row.role}</span>
                  </td>
                  <td className="px-6 py-4 pr-8 text-right">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black"
                      style={{ backgroundColor: "rgba(163,128,246,0.10)", color: "#7C5FCC" }}
                    >
                      {row.purchased}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100">
          <p className="text-[11px] text-[#0A1547]/35 font-semibold">
            {PURCHASED_INTERVIEWS.reduce((s, r) => s + r.purchased, 0)} additional interviews total
          </p>
        </div>
      </div>

      {/* ── Section 4: Manage Billing ─────────────────── */}
      <div
        className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <div>
          <h2 className="text-base font-black text-[#0A1547] mb-1">Manage Billing</h2>
          <p className="text-xs text-[#0A1547]/45 leading-relaxed max-w-sm">
            Access your full billing dashboard to update payment methods, view invoices, and manage your subscription.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-full transition-all hover:opacity-90 active:scale-[0.97] flex-shrink-0"
          style={{ backgroundColor: "#A380F6" }}
        >
          <CreditCard className="w-4 h-4" />
          Manage Billing
        </button>
      </div>

    </DashboardLayout>
  );
}
