import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Copy, Trash2, Upload } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
type RoleType = "Basic" | "Detailed" | "Technical";
type SortKey  = "name" | "created" | "type";
type SortDir  = "asc" | "desc";

interface Role {
  id:        string;
  clientId:  string;
  name:      string;
  token:     string;
  created:   string;
  createdTs: number;
  type:      RoleType;
  hasJD:     boolean;
}

/* ── Dummy data ──────────────────────────────────────────────── */
const ROLES: Role[] = [
  { id: "r1",  clientId: "acme",     name: "Dental Hygienist",         token: "a3f2-19b7-c08d", created: "4/1/2026, 9:00 AM",   createdTs: 9,  type: "Basic",     hasJD: true  },
  { id: "r2",  clientId: "acme",     name: "Front Desk Coordinator",    token: "bb41-72e0-d9c3", created: "3/28/2026, 2:15 PM",  createdTs: 8,  type: "Detailed",  hasJD: true  },
  { id: "r3",  clientId: "acme",     name: "Dental Assistant",          token: "c510-84fa-0e7b", created: "3/10/2026, 8:45 AM",  createdTs: 7,  type: "Technical", hasJD: false },
  { id: "r4",  clientId: "ridge",    name: "Medical Receptionist",      token: "d6a1-30bc-f25e", created: "3/15/2026, 11:30 AM", createdTs: 6,  type: "Basic",     hasJD: true  },
  { id: "r5",  clientId: "summit",   name: "Nurse Practitioner",        token: "e7b2-41cd-g36f", created: "2/20/2026, 4:00 PM",  createdTs: 5,  type: "Technical", hasJD: true  },
  { id: "r6",  clientId: "summit",   name: "Office Manager",            token: "f8c3-52de-h47g", created: "2/15/2026, 10:00 AM", createdTs: 4,  type: "Detailed",  hasJD: false },
  { id: "r7",  clientId: "crestwood",name: "Surgical Tech",             token: "g9d4-63ef-i58h", created: "3/5/2026, 1:00 PM",   createdTs: 3,  type: "Technical", hasJD: true  },
  { id: "r8",  clientId: "pinnacle", name: "Patient Coordinator",       token: "h0e5-74fg-j69i", created: "4/5/2026, 3:30 PM",   createdTs: 2,  type: "Basic",     hasJD: false },
  { id: "r9",  clientId: "lakeside", name: "Patient Coordinator",       token: "i1f6-85gh-k70j", created: "4/8/2026, 10:00 AM",  createdTs: 2,  type: "Basic",     hasJD: true  },
  { id: "r10", clientId: "harbor",   name: "Medical Assistant",         token: "j2g7-96hi-l81k", created: "4/10/2026, 2:45 PM",  createdTs: 1,  type: "Basic",     hasJD: true  },
];

const typeColors: Record<RoleType, { bg: string; text: string }> = {
  Basic:     { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  Detailed:  { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
  Technical: { bg: "rgba(2,217,157,0.12)",   text: "#009E73" },
};

const inputCls =
  "w-full px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium " +
  "border border-[rgba(10,21,71,0.10)] bg-white " +
  "placeholder:text-[#0A1547]/30 focus:outline-none focus:border-[#A380F6] transition-colors";

const selectCls =
  "w-full px-3 py-2 rounded-xl text-sm text-[#0A1547] font-medium " +
  "border border-[rgba(10,21,71,0.10)] bg-white appearance-none " +
  "focus:outline-none focus:border-[#A380F6] transition-colors cursor-pointer";

export default function AdminRolesPage() {
  const { selectedClient } = useAdminClient();
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [copied,  setCopied]  = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", type: "Basic", jdFileName: "" });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* Filter by selected client */
  const filtered = selectedClient.id === "all"
    ? ROLES
    : ROLES.filter((r) => r.clientId === selectedClient.id);

  /* Sort */
  const sorted = [...filtered].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";
    if (sortKey === "name")    { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    if (sortKey === "created") { av = a.createdTs; bv = b.createdTs; }
    if (sortKey === "type")    { av = a.type.toLowerCase(); bv = b.type.toLowerCase(); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  /* Copy link placeholder */
  const handleCopy = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-[#0A1547]/20 ml-0.5 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />;
  }

  /* Determine if we're showing a client column */
  const showClient = selectedClient.id === "all";

  return (
    <AdminLayout title="Roles">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Roles</h2>
      </div>

      {/* ── Create role form ──────────────────────────────── */}
      <div
        className="bg-white rounded-2xl p-5 mb-5"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <div className="flex gap-3 flex-wrap">
          <input
            className={inputCls + " flex-1 min-w-36"}
            placeholder="Role title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="relative w-40 flex-shrink-0">
            <select
              className={selectCls}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Basic</option>
              <option>Detailed</option>
              <option>Technical</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
          </div>

          {/* JD file upload */}
          <label
            className="flex-1 min-w-48 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#0A1547]/40 font-medium border border-dashed border-[rgba(10,21,71,0.18)] bg-white cursor-pointer hover:border-[#A380F6]/50 hover:text-[#A380F6]/60 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {form.jdFileName || "Drag JD file here or click to browse"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setForm({ ...form, jdFileName: e.target.files?.[0]?.name ?? "" })}
            />
          </label>

          <button
            className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A380F6" }}
          >
            Create
          </button>
        </div>
      </div>

      {/* ── Roles table ───────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Header */}
        <div
          className={`grid items-center px-5 py-3 border-b border-gray-100 ${
            showClient
              ? "grid-cols-[1fr_120px_130px_110px_56px_56px_120px_48px]"
              : "grid-cols-[1fr_130px_110px_56px_56px_120px_48px]"
          }`}
        >
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors text-left"
            onClick={() => handleSort("name")}
          >
            Role <SortIcon col="name" />
          </button>
          {showClient && (
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Client</p>
          )}
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("created")}
          >
            Created <SortIcon col="created" />
          </button>
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("type")}
          >
            Type <SortIcon col="type" />
          </button>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Rubric</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">JD</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Link</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Delete</p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {sorted.map((role) => {
            const tc = typeColors[role.type];
            const isCopied = copied === role.id;
            return (
              <div
                key={role.id}
                className={`grid items-center px-5 py-3.5 hover:bg-gray-50/60 transition-colors ${
                  showClient
                    ? "grid-cols-[1fr_120px_130px_110px_56px_56px_120px_48px]"
                    : "grid-cols-[1fr_130px_110px_56px_56px_120px_48px]"
                }`}
              >
                {/* Name + token */}
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-[#0A1547] leading-snug truncate">{role.name}</p>
                  <p className="text-[10px] text-[#0A1547]/30 mt-0.5 font-mono truncate">
                    Token: {role.token}
                  </p>
                </div>

                {/* Client (all-clients view only) */}
                {showClient && (
                  <p className="text-xs font-semibold text-[#0A1547]/50 truncate pr-2">
                    {ROLES.find((r) => r.id === role.id)
                      ? ["Acme Dental","Ridge Medical","Summit Health","Crestwood Ortho","Lakeside Derm","Pinnacle Surgical","Harbor Cove"][
                          ["acme","ridge","summit","crestwood","lakeside","pinnacle","harbor"].indexOf(role.clientId)
                        ]
                      : "—"}
                  </p>
                )}

                {/* Created */}
                <p className="text-xs text-[#0A1547]/50 font-semibold pr-2">{role.created}</p>

                {/* Type badge */}
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold w-fit"
                  style={{ backgroundColor: tc.bg, color: tc.text }}
                >
                  {role.type}
                </span>

                {/* Rubric icon */}
                <div className="flex justify-center">
                  <button
                    className="p-1.5 rounded-lg text-[#0A1547]/30 hover:text-[#A380F6] hover:bg-[rgba(163,128,246,0.08)] transition-all"
                    title="View rubric"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* JD icon */}
                <div className="flex justify-center">
                  {role.hasJD ? (
                    <button
                      className="p-1.5 rounded-lg text-[#0A1547]/30 hover:text-[#A380F6] hover:bg-[rgba(163,128,246,0.08)] transition-all"
                      title="View job description"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-sm text-[#0A1547]/20 font-semibold">—</span>
                  )}
                </div>

                {/* Copy link */}
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 w-fit"
                  style={{ backgroundColor: isCopied ? "#02D99D" : "#A380F6" }}
                  onClick={() => handleCopy(role.id)}
                >
                  <Copy className="w-3 h-3" />
                  {isCopied ? "Copied!" : "Copy link"}
                </button>

                {/* Delete */}
                <div className="flex justify-center">
                  <button
                    className="p-1.5 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                    title={`Delete ${role.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#0A1547]/35 font-semibold">No roles found for this client.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
