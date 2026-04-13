import { useState } from "react";
import { Trash2, Plus, ChevronDown, ExternalLink, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient, ADMIN_CLIENTS } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
interface LineItem {
  id:          number;
  description: string;
  qty:         number;
  unit:        string;
}

interface Invoice {
  id:        number;
  created:   string;
  customer:  string;
  email:     string;
  title:     string;
  amount:    string;
  status:    "open" | "paid" | "void";
}

/* ── Dummy invoice history ───────────────────────────────────── */
const INVOICE_HISTORY: Invoice[] = [
  { id: 1, created: "4/8/2026, 11:20 AM",  customer: "Summit Health Network",    email: "billing@summithealth.com",     title: "Pro subscription (annual)",  amount: "$6,499.00", status: "paid"  },
  { id: 2, created: "4/5/2026, 9:15 AM",   customer: "Acme Dental Group",        email: "billing@acmedental.com",       title: "Pro subscription (monthly)", amount: "$599.00",   status: "open"  },
  { id: 3, created: "3/30/2026, 2:44 PM",  customer: "Ridge Medical Partners",   email: "billing@ridgemedical.com",     title: "Pro subscription (monthly)", amount: "$599.00",   status: "open"  },
  { id: 4, created: "3/20/2026, 10:05 AM", customer: "Crestwood Orthopedics",    email: "billing@crestwoodortho.com",   title: "Enterprise subscription",    amount: "$1,299.00", status: "paid"  },
  { id: 5, created: "3/13/2026, 11:14 AM", customer: "Pinnacle Surgical Group",  email: "billing@pinnaclesurgical.com", title: "Pro subscription (annual)",  amount: "$6,499.00", status: "open"  },
  { id: 6, created: "3/13/2026, 9:52 AM",  customer: "Lakeside Dermatology",     email: "billing@lakesidederm.com",     title: "Pro subscription (monthly)", amount: "$599.00",   status: "void"  },
  { id: 7, created: "2/28/2026, 8:30 AM",  customer: "Harbor Cove Family Health",email: "billing@harborcovefh.com",     title: "Basic subscription",         amount: "$299.00",   status: "paid"  },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-[#0A1547] font-medium bg-white " +
  "border border-[rgba(10,21,71,0.10)] placeholder:text-[#0A1547]/25 " +
  "focus:outline-none focus:border-[#A380F6] transition-colors";

const selectCls = inputCls + " appearance-none cursor-pointer pr-8";

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(240,165,0,0.10)",   text: "#C07800"  },
  paid: { bg: "rgba(2,217,157,0.10)",   text: "#00886A"  },
  void: { bg: "rgba(10,21,71,0.07)",    text: "rgba(10,21,71,0.35)" },
};

let _lineId = 10;

/* ── Component ───────────────────────────────────────────────── */
export default function AdminBillingPage() {
  const { selectedClient } = useAdminClient();

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

  const addLineItem = () =>
    setLineItems((prev) => [...prev, { id: _lineId++, description: "", qty: 1, unit: "" }]);

  const removeLineItem = (id: number) =>
    setLineItems((prev) => prev.filter((li) => li.id !== id));

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) =>
    setLineItems((prev) => prev.map((li) => (li.id === id ? { ...li, [field]: value } : li)));

  const filledItems   = lineItems.filter((li) => li.description.trim() && li.unit.trim());
  const canSendInvoice = invCustomer && invTitle.trim() && filledItems.length > 0;

  /* Invoice filter */
  const filteredInvoices = selectedClient.id === "all"
    ? INVOICE_HISTORY
    : INVOICE_HISTORY.filter((_) => true); /* real filter would use clientId */

  const clientOptions = ADMIN_CLIENTS.filter((c) => c.id !== "all");

  const card = "bg-white rounded-2xl mb-5 overflow-hidden";
  const cardStyle = { border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" };

  return (
    <AdminLayout title="Billing">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Billing</h2>
        <span className="text-xs text-[#0A1547]/35 font-medium italic">Global — not scoped to selected client</span>
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A380F6" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
              {filteredInvoices.map((inv, idx) => {
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
                      <p className="text-[11px] text-[#0A1547]/40">{inv.email}</p>
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
                      <button
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 mx-auto"
                        style={{ backgroundColor: "#A380F6" }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
