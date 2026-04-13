import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
interface Candidate {
  id:        number;
  name:      string;
  email:     string;
  clientId:  string;
  clientName:string;
  role:      string;
  created:   string;
  createdTs: number;
  resume:    number | null;
  interview: number | null;
  overall:   number | null;
  status:    string;
  reportDate:string;
}

type SortKey = "name" | "client" | "role" | "created" | "resume" | "interview" | "overall";
type SortDir = "asc" | "desc";

/* ── Dummy data ──────────────────────────────────────────────── */
const CANDIDATES: Candidate[] = [
  { id: 1,  name: "Jordan Kim",      email: "jordan.kim@email.com",         clientId: "acme",      clientName: "Acme Dental Group",         role: "Dental Hygienist",      created: "4/1/2026, 9:12 AM CST",   createdTs: 12, resume: 80,  interview: 75,  overall: 78,  status: "Interview Complete",  reportDate: "4/1/2026, 9:12 AM CST"   },
  { id: 2,  name: "Marcy O'Brien",   email: "marcy.obrien@email.com",        clientId: "acme",      clientName: "Acme Dental Group",         role: "Front Desk Coordinator",created: "3/28/2026, 2:15 PM CST",  createdTs: 11, resume: 85,  interview: null,overall: null,status: "Resume Uploaded",     reportDate: "3/28/2026, 2:15 PM CST"  },
  { id: 3,  name: "Devon Watts",     email: "devon.watts@email.com",         clientId: "ridge",     clientName: "Ridge Medical Partners",    role: "Medical Receptionist",  created: "3/15/2026, 11:30 AM CST", createdTs: 10, resume: 60,  interview: 55,  overall: 58,  status: "Interview Complete",  reportDate: "3/15/2026, 11:30 AM CST" },
  { id: 4,  name: "Ashley Norris",   email: "ashley.norris@email.com",       clientId: "summit",    clientName: "Summit Health Network",     role: "Nurse Practitioner",    created: "2/20/2026, 4:00 PM CST",  createdTs: 9,  resume: 92,  interview: 88,  overall: 90,  status: "Interview Complete",  reportDate: "2/20/2026, 4:00 PM CST"  },
  { id: 5,  name: "Marcus Bell",     email: "marcus.bell@email.com",         clientId: "ridge",     clientName: "Ridge Medical Partners",    role: "Medical Receptionist",  created: "3/10/2026, 8:45 AM CST",  createdTs: 8,  resume: 35,  interview: 40,  overall: 38,  status: "Interview Complete",  reportDate: "3/10/2026, 8:45 AM CST"  },
  { id: 6,  name: "Priya Sharma",    email: "priya.sharma@email.com",        clientId: "crestwood", clientName: "Crestwood Orthopedics",     role: "Surgical Tech",         created: "3/5/2026, 1:00 PM CST",   createdTs: 7,  resume: 73,  interview: 68,  overall: 71,  status: "Interview Complete",  reportDate: "3/5/2026, 1:00 PM CST"   },
  { id: 7,  name: "Tyler Osei",      email: "tyler.osei@email.com",          clientId: "pinnacle",  clientName: "Pinnacle Surgical Group",   role: "Patient Coordinator",   created: "4/5/2026, 3:30 PM CST",   createdTs: 6,  resume: 78,  interview: 82,  overall: 80,  status: "Interview Complete",  reportDate: "4/5/2026, 3:30 PM CST"   },
  { id: 8,  name: "Sara Nguyen",     email: "sara.nguyen@email.com",         clientId: "lakeside",  clientName: "Lakeside Dermatology",      role: "Patient Coordinator",   created: "4/8/2026, 10:00 AM CST",  createdTs: 5,  resume: 65,  interview: null,overall: null,status: "Resume Uploaded",     reportDate: "4/8/2026, 10:00 AM CST"  },
  { id: 9,  name: "Chris Evans",     email: "chris.evans@email.com",         clientId: "harbor",    clientName: "Harbor Cove Family Health", role: "Medical Assistant",     created: "4/10/2026, 2:45 PM CST",  createdTs: 4,  resume: 88,  interview: 79,  overall: 84,  status: "Interview Complete",  reportDate: "4/10/2026, 2:45 PM CST"  },
  { id: 10, name: "Brianna Cole",    email: "brianna.cole@email.com",        clientId: "acme",      clientName: "Acme Dental Group",         role: "Dental Hygienist",      created: "4/2/2026, 11:00 AM CST",  createdTs: 3,  resume: 71,  interview: 66,  overall: 69,  status: "Interview Complete",  reportDate: "4/2/2026, 11:00 AM CST"  },
  { id: 11, name: "Nathan Rhodes",   email: "nathan.rhodes@email.com",       clientId: "summit",    clientName: "Summit Health Network",     role: "Office Manager",        created: "3/20/2026, 9:30 AM CST",  createdTs: 2,  resume: 82,  interview: null,overall: null,status: "Resume Uploaded",     reportDate: "3/20/2026, 9:30 AM CST"  },
  { id: 12, name: "Lena Vasquez",    email: "lena.vasquez@email.com",        clientId: "crestwood", clientName: "Crestwood Orthopedics",     role: "Surgical Tech",         created: "3/25/2026, 3:15 PM CST",  createdTs: 1,  resume: 90,  interview: 87,  overall: 89,  status: "Interview Complete",  reportDate: "3/25/2026, 3:15 PM CST"  },
];

/* ── Score helpers ───────────────────────────────────────────── */
function scoreColor(s: number | null) {
  if (s === null) return "rgba(10,21,71,0.25)";
  if (s >= 75) return "#02D99D";
  if (s >= 60) return "#F0A500";
  return "#FF6B6B";
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-[#0A1547]/25 font-semibold">—</span>;
  return <span className="text-sm font-black" style={{ color: scoreColor(score) }}>{score}%</span>;
}

const selectCls =
  "px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium " +
  "border border-[rgba(10,21,71,0.10)] bg-white appearance-none " +
  "focus:outline-none focus:border-[#A380F6] transition-colors cursor-pointer";

export default function AdminCandidatesPage() {
  const { selectedClient } = useAdminClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sortKey, setSortKey]       = useState<SortKey>("created");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [roleFilter, setRoleFilter] = useState("all");

  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* Filter by selected client */
  const byClient = selectedClient.id === "all"
    ? CANDIDATES
    : CANDIDATES.filter((c) => c.clientId === selectedClient.id);

  /* Unique roles for the dropdown */
  const uniqueRoles = Array.from(new Set(byClient.map((c) => c.role))).sort();

  /* Filter by role */
  const byRole = roleFilter === "all"
    ? byClient
    : byClient.filter((c) => c.role === roleFilter);

  /* Sort */
  const sorted = [...byRole].sort((a, b) => {
    let av: string | number = 0;
    let bv: string | number = 0;
    switch (sortKey) {
      case "name":      av = a.name.toLowerCase();     bv = b.name.toLowerCase();     break;
      case "client":    av = a.clientName.toLowerCase();bv = b.clientName.toLowerCase();break;
      case "role":      av = a.role.toLowerCase();     bv = b.role.toLowerCase();     break;
      case "created":   av = a.createdTs;              bv = b.createdTs;              break;
      case "resume":    av = a.resume    ?? -1;        bv = b.resume    ?? -1;        break;
      case "interview": av = a.interview ?? -1;        bv = b.interview ?? -1;        break;
      case "overall":   av = a.overall   ?? -1;        bv = b.overall   ?? -1;        break;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1  : -1;
    return 0;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-[#0A1547]/20 ml-0.5 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />;
  }

  /* Show client column only when "All Clients" selected */
  const showClient = selectedClient.id === "all";

  return (
    <AdminLayout title="Candidates">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Candidates</h2>
      </div>

      {/* ── Filter bar ────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl px-5 py-3.5 mb-5 flex flex-wrap items-center gap-3"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <div className="relative flex-1 min-w-48 max-w-72">
          <select
            className={selectCls + " w-full pr-8"}
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setExpandedId(null); }}
          >
            <option value="all">All roles</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
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

        <p className="text-xs text-[#0A1547]/35 font-semibold ml-auto">
          {sorted.length} candidate{sorted.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Candidates table ──────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Header */}
        <div
          className={`grid items-center px-5 py-3 border-b border-gray-100 ${
            showClient
              ? "grid-cols-[1fr_110px_130px_140px_68px_78px_68px_100px_44px]"
              : "grid-cols-[1fr_130px_140px_68px_78px_68px_100px_44px]"
          }`}
        >
          {(["name","client","role","created","resume","interview","overall"] as SortKey[])
            .filter((k) => k !== "client" || showClient)
            .map((col) => (
              <button
                key={col}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors text-left"
                onClick={() => handleSort(col)}
              >
                {col === "interview" ? "Interview" : col.charAt(0).toUpperCase() + col.slice(1)}
                <SortIcon col={col} />
              </button>
            ))}
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Actions</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Delete</p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {sorted.map((c) => {
            const expanded = expandedId === c.id;
            return (
              <div key={c.id}>
                {/* Main row */}
                <div
                  className={`grid items-center px-5 py-3 cursor-pointer hover:bg-gray-50/70 transition-colors ${
                    expanded ? "bg-[rgba(163,128,246,0.04)]" : ""
                  } ${
                    showClient
                      ? "grid-cols-[1fr_110px_130px_140px_68px_78px_68px_100px_44px]"
                      : "grid-cols-[1fr_130px_140px_68px_78px_68px_100px_44px]"
                  }`}
                  onClick={() => toggle(c.id)}
                >
                  {/* Name + email */}
                  <div className="flex items-start gap-2 min-w-0 pr-2">
                    <ChevronRight
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: expanded ? "#A380F6" : "rgba(10,21,71,0.25)",
                        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0A1547] leading-snug truncate">{c.name}</p>
                      <p className="text-[11px] text-[#0A1547]/35 truncate">{c.email}</p>
                    </div>
                  </div>

                  {showClient && (
                    <p className="text-xs font-semibold text-[#0A1547]/50 truncate pr-2">{c.clientName}</p>
                  )}

                  <p className="text-xs font-semibold text-[#0A1547]/60 truncate pr-2">{c.role}</p>

                  <p className="text-[11px] font-semibold text-[#0A1547]/40">{c.created}</p>

                  <ScoreCell score={c.resume} />
                  <ScoreCell score={c.interview} />
                  <ScoreCell score={c.overall} />

                  {/* Actions */}
                  <div
                    className="flex flex-col gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="px-3 py-1 rounded-full text-[11px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#A380F6" }}
                    >
                      Resume
                    </button>
                    <button
                      className="px-3 py-1 rounded-full text-[11px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#A380F6" }}
                    >
                      Report
                    </button>
                  </div>

                  {/* Delete */}
                  <div
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="p-1.5 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                      title={`Delete ${c.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div
                    className="px-8 py-4 border-t border-[rgba(163,128,246,0.12)]"
                    style={{ backgroundColor: "rgba(248,249,253,0.8)", borderLeft: "3px solid #A380F6" }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-black text-[#0A1547]/60">Status:</span>
                        <span
                          className="font-bold"
                          style={{ color: c.status === "Interview Complete" ? "#02D99D" : "#F0A500" }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-black text-[#0A1547]/60">Report generated:</span>
                        <span className="font-semibold text-[#0A1547]/50">{c.reportDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#0A1547]/35 font-semibold">No candidates found.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
