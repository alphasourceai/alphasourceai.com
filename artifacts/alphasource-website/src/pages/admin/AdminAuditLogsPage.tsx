import { useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ── Types ───────────────────────────────────────────────────── */
interface AuditLog {
  id:      number;
  date:    string;
  type:    string;
  status:  "success" | "error" | "warning";
  errors:  number;
  logId:   string;
  eventId: string;
  note:    string;
}

interface CancellationRun {
  id:           number;
  client:       string;
  status:       "completed" | "failed" | "running";
  triggeredBy:  string;
  started:      string;
  completed:    string;
  finalInvoice: string;
  stripeInvoice:string;
  note:         string;
  error:        string;
}

/* ── Dummy data ──────────────────────────────────────────────── */
const AUDIT_LOGS: AuditLog[] = [
  { id:1,  date:"4/13/2026, 2:05:56 AM", type:"cron", status:"success", errors:0, logId:"...78e99d0e", eventId:"—", note:"—" },
  { id:2,  date:"4/12/2026, 2:05:50 AM", type:"cron", status:"success", errors:0, logId:"...a12b3c4d", eventId:"—", note:"—" },
  { id:3,  date:"4/11/2026, 2:05:48 AM", type:"cron", status:"success", errors:0, logId:"...b23c4d5e", eventId:"—", note:"—" },
  { id:4,  date:"4/10/2026, 2:05:52 AM", type:"cron", status:"success", errors:0, logId:"...c34d5e6f", eventId:"—", note:"—" },
  { id:5,  date:"4/9/2026, 2:05:54 AM",  type:"cron", status:"success", errors:0, logId:"...d45e6f7g", eventId:"—", note:"—" },
  { id:6,  date:"4/8/2026, 2:05:50 AM",  type:"cron", status:"success", errors:0, logId:"...e56f7g8h", eventId:"—", note:"—" },
  { id:7,  date:"4/7/2026, 2:05:55 AM",  type:"cron", status:"success", errors:0, logId:"...f67g8h9i", eventId:"—", note:"—" },
  { id:8,  date:"4/6/2026, 2:05:51 AM",  type:"cron", status:"success", errors:0, logId:"...g78h9i0j", eventId:"—", note:"—" },
  { id:9,  date:"4/5/2026, 2:05:54 AM",  type:"cron", status:"success", errors:0, logId:"...h89i0j1k", eventId:"—", note:"—" },
  { id:10, date:"4/4/2026, 2:05:56 AM",  type:"cron", status:"success", errors:0, logId:"...78e99d0e", eventId:"—", note:"—" },
  { id:11, date:"4/3/2026, 2:05:50 AM",  type:"cron", status:"success", errors:0, logId:"...086a0f04", eventId:"—", note:"—" },
  { id:12, date:"4/2/2026, 2:05:54 AM",  type:"cron", status:"success", errors:0, logId:"...63e01707", eventId:"—", note:"—" },
  { id:13, date:"4/1/2026, 2:05:52 AM",  type:"cron", status:"success", errors:0, logId:"...8ce56341", eventId:"—", note:"—" },
  { id:14, date:"3/31/2026, 2:08:24 AM", type:"cron", status:"success", errors:0, logId:"...76b4753e", eventId:"—", note:"—" },
  { id:15, date:"3/30/2026, 2:06:13 AM", type:"cron", status:"success", errors:0, logId:"...1ea6bf51", eventId:"—", note:"—" },
  { id:16, date:"3/29/2026, 2:06:29 AM", type:"cron", status:"success", errors:0, logId:"...5e015d16", eventId:"—", note:"—" },
  { id:17, date:"3/28/2026, 2:06:46 AM", type:"cron", status:"success", errors:0, logId:"...dc3da64f", eventId:"—", note:"—" },
  { id:18, date:"3/27/2026, 2:06:55 AM", type:"cron", status:"success", errors:0, logId:"...47966253", eventId:"—", note:"—" },
  { id:19, date:"3/26/2026, 2:06:37 AM", type:"cron", status:"success", errors:0, logId:"...351d7b77", eventId:"—", note:"—" },
  { id:20, date:"3/25/2026, 2:06:13 AM", type:"cron", status:"success", errors:0, logId:"...13cd8cde", eventId:"—", note:"—" },
  { id:21, date:"3/24/2026, 2:05:56 AM", type:"cron", status:"success", errors:0, logId:"...eea40fb5", eventId:"—", note:"—" },
  { id:22, date:"3/23/2026, 2:05:52 AM", type:"cron", status:"success", errors:0, logId:"...77e5357e", eventId:"—", note:"—" },
  { id:23, date:"3/22/2026, 2:05:51 AM", type:"cron", status:"success", errors:0, logId:"...12ed05e6", eventId:"—", note:"—" },
  { id:24, date:"3/21/2026, 2:05:52 AM", type:"cron", status:"success", errors:0, logId:"...caed28ab", eventId:"—", note:"—" },
  { id:25, date:"3/20/2026, 2:05:50 AM", type:"cron", status:"success", errors:0, logId:"...fda8d728", eventId:"—", note:"—" },
];

const CANCELLATION_RUNS: CancellationRun[] = [
  { id:1, client:"Acme Dental Group",       status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/26/2026, 9:21 AM",  completed:"3/26/2026, 9:21 AM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:2, client:"Ridge Medical Partners",  status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/24/2026, 9:05 AM",  completed:"3/24/2026, 9:05 AM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:3, client:"Summit Health Network",   status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/19/2026, 2:25 PM",  completed:"3/19/2026, 2:25 PM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:4, client:"Crestwood Orthopedics",   status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/19/2026, 1:50 PM",  completed:"3/19/2026, 1:50 PM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:5, client:"Lakeside Dermatology",    status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/18/2026, 10:57 AM", completed:"3/18/2026, 10:57 AM", finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:6, client:"Pinnacle Surgical Group", status:"completed", triggeredBy:"jason@alphasourceai.com", started:"3/18/2026, 8:47 AM",  completed:"3/18/2026, 8:47 AM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
  { id:7, client:"Harbor Cove Family Health",status:"completed",triggeredBy:"jason@alphasourceai.com", started:"3/18/2026, 8:18 AM",  completed:"3/18/2026, 8:18 AM",  finalInvoice:"—", stripeInvoice:"—", note:"—", error:"—" },
];

const statusColors = {
  success:   { bg: "rgba(2,217,157,0.10)",   text: "#00886A" },
  error:     { bg: "rgba(255,107,107,0.10)", text: "#C94040" },
  warning:   { bg: "rgba(240,165,0,0.10)",   text: "#C07800" },
  completed: { bg: "rgba(2,217,157,0.10)",   text: "#00886A" },
  failed:    { bg: "rgba(255,107,107,0.10)", text: "#C94040" },
  running:   { bg: "rgba(163,128,246,0.10)", text: "#7C5FCC" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusColors[status as keyof typeof statusColors] ?? { bg: "rgba(10,21,71,0.07)", text: "rgba(10,21,71,0.45)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

const card = "bg-white rounded-2xl mb-6 overflow-hidden";
const cardStyle = { border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" };

const thCls = "px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 text-left whitespace-nowrap";
const tdCls = "px-4 py-3 text-xs text-[#0A1547]/60 font-medium align-top";

export default function AdminAuditLogsPage() {
  const [dateFrom, setDateFrom] = useState("04/13/2026");
  const [dateTo,   setDateTo]   = useState("04/13/2026");

  const inputCls =
    "px-3 py-2 rounded-xl text-xs text-[#0A1547] font-medium border border-[rgba(10,21,71,0.10)] " +
    "bg-white focus:outline-none focus:border-[#A380F6] transition-colors w-32";

  const refreshBtn = (label = "Refresh") => (
    <button
      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0"
      style={{ backgroundColor: "#A380F6" }}
    >
      <RefreshCw className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  return (
    <AdminLayout title="Audit Logs">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Audit Logs</h2>
        <span className="text-xs text-[#0A1547]/35 font-medium italic">Global — not client specific</span>
      </div>

      {/* ── Section 1: Audit Logs ──────────────────────────── */}
      <div className={card} style={cardStyle}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <p className="text-sm font-black text-[#0A1547] mr-auto">Audit Logs</p>

          {/* Date range */}
          <input
            type="text"
            className={inputCls}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <input
            type="text"
            className={inputCls}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="MM/DD/YYYY"
          />

          {/* Export */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: "rgba(10,21,71,0.07)", color: "#0A1547" }}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {refreshBtn()}
        </div>

        {/* Table — scrollable */}
        <div className="overflow-auto max-h-80">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-100">
                <th className={thCls + " pl-5"}>Date / Time</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Errors</th>
                <th className={thCls}>Log ID</th>
                <th className={thCls}>Event ID</th>
                <th className={thCls + " pr-5"}>Note</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, idx) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors"
                  style={idx === AUDIT_LOGS.length - 1 ? { borderBottom: "none" } : {}}
                >
                  <td className={tdCls + " pl-5 font-semibold text-[#0A1547]/70 whitespace-nowrap"}>{log.date}</td>
                  <td className={tdCls}>{log.type}</td>
                  <td className={tdCls}><StatusBadge status={log.status} /></td>
                  <td className={tdCls}>errors {log.errors}</td>
                  <td className={tdCls + " font-mono text-[#0A1547]/40 text-[11px]"}>{log.logId}</td>
                  <td className={tdCls + " text-[#0A1547]/30"}>{log.eventId}</td>
                  <td className={tdCls + " pr-5 text-[#0A1547]/30"}>{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-2.5 border-t border-gray-100">
          <p className="text-[11px] text-[#0A1547]/35 font-semibold">{AUDIT_LOGS.length} entries</p>
        </div>
      </div>

      {/* ── Section 2: Billing Reconciliation ─────────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-[#0A1547]">Billing Reconciliation</p>
          {refreshBtn()}
        </div>

        {/* Columns shown even when empty for structure */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={thCls + " pl-5"}>Client</th>
                <th className={thCls}>Expected Amount</th>
                <th className={thCls}>Actual Billed</th>
                <th className={thCls}>Difference</th>
                <th className={thCls}>Stripe Status</th>
                <th className={thCls + " pr-5"}>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-10 text-sm text-[#0A1547]/30 font-semibold">
                  No billing mismatches found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Contract Cancellation Runs ─────────── */}
      <div className={card} style={cardStyle}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-[#0A1547]">Contract Cancellation Runs</p>
          {refreshBtn()}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={thCls + " pl-5"}>Client</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Triggered By</th>
                <th className={thCls}>Started</th>
                <th className={thCls}>Completed</th>
                <th className={thCls}>Final Invoice</th>
                <th className={thCls}>Stripe Invoice</th>
                <th className={thCls}>Note</th>
                <th className={thCls + " pr-5"}>Error</th>
              </tr>
            </thead>
            <tbody>
              {CANCELLATION_RUNS.map((run, idx) => (
                <tr
                  key={run.id}
                  className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors"
                  style={idx === CANCELLATION_RUNS.length - 1 ? { borderBottom: "none" } : {}}
                >
                  <td className={tdCls + " pl-5 font-bold text-[#0A1547]/80"}>{run.client}</td>
                  <td className={tdCls}><StatusBadge status={run.status} /></td>
                  <td className={tdCls + " text-[#0A1547]/45"}>{run.triggeredBy}</td>
                  <td className={tdCls + " whitespace-nowrap"}>{run.started}</td>
                  <td className={tdCls + " whitespace-nowrap"}>{run.completed}</td>
                  <td className={tdCls + " text-[#0A1547]/30"}>{run.finalInvoice}</td>
                  <td className={tdCls + " text-[#0A1547]/30"}>{run.stripeInvoice}</td>
                  <td className={tdCls + " text-[#0A1547]/30"}>{run.note}</td>
                  <td className={tdCls + " pr-5 text-[#0A1547]/30"}>{run.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
