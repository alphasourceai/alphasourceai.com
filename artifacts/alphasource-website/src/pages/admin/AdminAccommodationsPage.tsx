import { useState, useEffect, useRef } from "react";
import { RefreshCw, ChevronDown, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
type AccomStatus = "Pending" | "Approved" | "Sent" | "Denied";

interface StatusEntry {
  label: string;
  date:  string;
}

interface AccomRequest {
  id:        number;
  clientId:  string;
  name:      string;
  email:     string;
  phone:     string;
  createdAt: string;
  role:      string;
  hasResume: boolean;
  request:   string;
  status:    AccomStatus;
  history:   StatusEntry[];
  notes:     string;
}

/* ── Dummy data ──────────────────────────────────────────────── */
const REQUESTS: AccomRequest[] = [
  {
    id: 1, clientId: "acme",
    name: "Jordan Kim",       email: "jordan.kim@email.com",         phone: "555-201-4422",
    createdAt: "4/1/2026, 9:12 AM CST",
    role: "Dental Hygienist", hasResume: true,
    request: "Requesting extended time for written response portions due to a documented processing disorder.",
    status: "Sent",
    history: [{ label: "Approved", date: "4/1/2026, 9:20 AM CST" }, { label: "Sent", date: "4/1/2026, 9:25 AM CST" }],
    notes: "",
  },
  {
    id: 2, clientId: "acme",
    name: "Marcy O'Brien",    email: "marcy.obrien@email.com",        phone: "555-312-0093",
    createdAt: "3/28/2026, 2:15 PM CST",
    role: "Front Desk Coordinator", hasResume: true,
    request: "Require screen reader compatibility for the interview interface.",
    status: "Pending",
    history: [],
    notes: "",
  },
  {
    id: 3, clientId: "ridge",
    name: "Devon Watts",      email: "devon.watts@email.com",         phone: "555-448-7701",
    createdAt: "3/15/2026, 11:30 AM CST",
    role: "Medical Receptionist", hasResume: true,
    request: "Requesting a quiet room accommodation to minimize auditory distractions.",
    status: "Approved",
    history: [{ label: "Approved", date: "3/15/2026, 12:00 PM CST" }],
    notes: "",
  },
  {
    id: 4, clientId: "summit",
    name: "Ashley Norris",    email: "ashley.norris@email.com",       phone: "555-567-8812",
    createdAt: "2/20/2026, 4:00 PM CST",
    role: "Nurse Practitioner", hasResume: true,
    request: "Need real-time caption support for any audio or video interview segments.",
    status: "Denied",
    history: [{ label: "Denied", date: "2/21/2026, 9:00 AM CST" }],
    notes: "Accommodation not available for current interview format.",
  },
  {
    id: 5, clientId: "pinnacle",
    name: "Tyler Osei",       email: "tyler.osei@email.com",          phone: "555-678-2234",
    createdAt: "4/5/2026, 3:30 PM CST",
    role: "Patient Coordinator", hasResume: false,
    request: "Requesting scheduled breaks every 20 minutes due to a medical condition.",
    status: "Sent",
    history: [{ label: "Approved", date: "4/5/2026, 4:00 PM CST" }, { label: "Sent", date: "4/5/2026, 4:10 PM CST" }],
    notes: "",
  },
  {
    id: 6, clientId: "lakeside",
    name: "Sara Nguyen",      email: "sara.nguyen@email.com",         phone: "555-789-3345",
    createdAt: "4/8/2026, 10:00 AM CST",
    role: "Patient Coordinator", hasResume: false,
    request: "Large text display accommodation and high-contrast mode for visual impairment.",
    status: "Pending",
    history: [],
    notes: "",
  },
  {
    id: 7, clientId: "crestwood",
    name: "Priya Sharma",     email: "priya.sharma@email.com",        phone: "555-890-4456",
    createdAt: "3/5/2026, 1:00 PM CST",
    role: "Surgical Tech", hasResume: true,
    request: "Requesting an ASL interpreter be available for any live interview portions.",
    status: "Approved",
    history: [{ label: "Approved", date: "3/6/2026, 10:00 AM CST" }],
    notes: "Interpreter has been arranged.",
  },
];

/* ── Status config ───────────────────────────────────────────── */
const STATUS_OPTIONS: AccomStatus[] = ["Pending", "Approved", "Sent", "Denied"];

const statusStyle: Record<AccomStatus, { bg: string; text: string; border: string }> = {
  Pending:  { bg: "rgba(240,165,0,0.10)",   text: "#C07800", border: "rgba(240,165,0,0.22)"   },
  Approved: { bg: "rgba(2,217,157,0.10)",   text: "#00886A", border: "rgba(2,217,157,0.22)"   },
  Sent:     { bg: "rgba(163,128,246,0.10)", text: "#7C5FCC", border: "rgba(163,128,246,0.22)" },
  Denied:   { bg: "rgba(255,107,107,0.10)", text: "#C94040", border: "rgba(255,107,107,0.22)" },
};

/* ── Per-row status dropdown ─────────────────────────────────── */
function StatusDropdown({
  value,
  onChange,
  open,
  onToggle,
}: {
  value: AccomStatus;
  onChange: (s: AccomStatus) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onToggle]);

  const s = statusStyle[value];

  return (
    <div ref={ref} className="relative w-28">
      <button
        className="w-full flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
        onClick={onToggle}
      >
        {value}
        <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute z-30 top-full mt-1 left-0 w-32 bg-white rounded-xl overflow-hidden py-1"
          style={{ border: "1px solid rgba(10,21,71,0.10)", boxShadow: "0 8px 24px rgba(10,21,71,0.12)" }}
        >
          {STATUS_OPTIONS.map((opt) => {
            const os = statusStyle[opt];
            return (
              <button
                key={opt}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors text-left"
                onClick={() => { onChange(opt); onToggle(); }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: os.text }}
                />
                <span style={{ color: opt === value ? os.text : "#0A1547" }}>{opt}</span>
                {opt === value && <span className="ml-auto text-[10px]" style={{ color: os.text }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function AdminAccommodationsPage() {
  const { selectedClient } = useAdminClient();

  /* Per-row state maps */
  const [statuses, setStatuses] = useState<Record<number, AccomStatus>>(
    () => Object.fromEntries(REQUESTS.map((r) => [r.id, r.status]))
  );
  const [notes, setNotes] = useState<Record<number, string>>(
    () => Object.fromEntries(REQUESTS.map((r) => [r.id, r.notes]))
  );
  const [savedNotes, setSavedNotes] = useState<Record<number, string>>(
    () => Object.fromEntries(REQUESTS.map((r) => [r.id, r.notes]))
  );
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  /* Filter bar */
  const [filterStatus, setFilterStatus] = useState<AccomStatus | "All">("All");

  /* Filter by client + status */
  const filtered = REQUESTS
    .filter((r) => selectedClient.id === "all" || r.clientId === selectedClient.id)
    .filter((r) => filterStatus === "All" || statuses[r.id] === filterStatus);

  const selectCls =
    "px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium border border-[rgba(10,21,71,0.10)] " +
    "bg-white appearance-none focus:outline-none focus:border-[#A380F6] transition-colors cursor-pointer";

  return (
    <AdminLayout title="Accommodation Requests">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Accommodation Requests</h2>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl px-5 py-3.5 mb-5 flex flex-wrap items-center gap-3"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <span className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40">Status</span>
        <div className="relative w-48">
          <select
            className={selectCls + " w-full pr-8"}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AccomStatus | "All")}
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
        </div>

        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#A380F6" }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>

        <span className="ml-auto text-xs text-[#0A1547]/35 font-semibold">
          {filtered.length} request{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  ["Candidate", "pl-5 text-left w-[220px]"],
                  ["Role",      "text-left w-[130px]"],
                  ["Request",   "text-left w-[180px]"],
                  ["Status",    "text-left w-[150px]"],
                  ["Notes",     "text-left w-[160px]"],
                  ["Actions",   "text-left pr-5 w-[110px]"],
                ].map(([label, cls]) => (
                  <th
                    key={label}
                    className={`px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-sm text-[#0A1547]/30 font-semibold">
                    No accommodation requests match this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const rowStatus   = statuses[r.id];
                  const rowNotes    = notes[r.id] ?? "";
                  const isSendable  = rowStatus === "Approved";
                  const isLast      = idx === filtered.length - 1;

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors align-top"
                      style={isLast ? { borderBottom: "none" } : {}}
                    >
                      {/* ── Candidate ─────────────────────── */}
                      <td className="px-4 py-4 pl-5">
                        <p className="font-bold text-[#0A1547] leading-snug">{r.name}</p>
                        <p className="text-[11px] text-[#0A1547]/45 mt-0.5">{r.email}</p>
                        <p className="text-[11px] text-[#0A1547]/45">{r.phone}</p>
                        <p className="text-[11px] text-[#0A1547]/35 mt-0.5">
                          <span className="font-semibold text-[#0A1547]/40">Created</span> {r.createdAt}
                        </p>
                      </td>

                      {/* ── Role ──────────────────────────── */}
                      <td className="px-4 py-4">
                        <p className="font-bold text-[#0A1547] leading-snug text-sm">{r.role}</p>
                        {r.hasResume ? (
                          <button
                            className="flex items-center gap-1 mt-1 text-xs font-semibold transition-opacity hover:opacity-75"
                            style={{ color: "#A380F6" }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Resume
                          </button>
                        ) : (
                          <p className="text-xs text-[#0A1547]/30 font-medium mt-1">No resume</p>
                        )}
                      </td>

                      {/* ── Request ───────────────────────── */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-[#0A1547]/65 leading-relaxed">{r.request}</p>
                      </td>

                      {/* ── Status ────────────────────────── */}
                      <td className="px-4 py-4">
                        <StatusDropdown
                          value={rowStatus}
                          onChange={(s) => setStatuses((prev) => ({ ...prev, [r.id]: s }))}
                          open={openDropdown === r.id}
                          onToggle={() => setOpenDropdown((prev) => (prev === r.id ? null : r.id))}
                        />

                        {/* Status history */}
                        {r.history.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {r.history.map((h, i) => (
                              <p key={i} className="text-[10px] text-[#0A1547]/35 leading-relaxed">
                                <span className="font-semibold">{h.label}</span> {h.date}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* ── Notes ─────────────────────────── */}
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          placeholder="Admin notes"
                          value={rowNotes}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-full px-2.5 py-2 rounded-xl text-xs text-[#0A1547] font-medium border border-[rgba(10,21,71,0.10)] bg-white placeholder:text-[#0A1547]/25 focus:outline-none focus:border-[#A380F6] transition-colors"
                        />
                        <button
                          className="mt-2 w-full px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all hover:opacity-90"
                          style={{
                            backgroundColor:
                              rowNotes !== savedNotes[r.id] ? "#A380F6" : "rgba(10,21,71,0.06)",
                            color: rowNotes !== savedNotes[r.id] ? "white" : "rgba(10,21,71,0.35)",
                          }}
                          onClick={() =>
                            setSavedNotes((prev) => ({ ...prev, [r.id]: rowNotes }))
                          }
                        >
                          Save Notes
                        </button>
                      </td>

                      {/* ── Actions ───────────────────────── */}
                      <td className="px-4 py-4 pr-5">
                        <button
                          disabled={!isSendable}
                          className="w-full px-3 py-2 rounded-full text-xs font-bold text-white transition-all"
                          style={{
                            backgroundColor: isSendable ? "#A380F6" : "rgba(10,21,71,0.08)",
                            color:           isSendable ? "white"   : "rgba(10,21,71,0.25)",
                            cursor:          isSendable ? "pointer" : "not-allowed",
                          }}
                        >
                          Send Link
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
