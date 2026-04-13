import { useState, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
type MemberRole = "Manager" | "Member";
type SortKey    = "name" | "role";
type SortDir    = "asc"  | "desc";

interface Member {
  id:    number;
  name:  string;
  email: string;
  role:  MemberRole;
}

/* ── Seed data per client ────────────────────────────────────── */
const SEED: Record<string, Member[]> = {
  acme:      [{ id: 1, name: "Sarah Nguyen",   email: "sarah.nguyen@acmedental.com",       role: "Manager" }, { id: 2, name: "Derek Hall",     email: "derek.hall@acmedental.com",         role: "Member" }],
  ridge:     [{ id: 3, name: "Monica Reyes",   email: "monica.reyes@ridgemedical.com",      role: "Manager" }, { id: 4, name: "Tom Waller",     email: "tom.waller@ridgemedical.com",        role: "Member" }],
  summit:    [{ id: 5, name: "Grace Liu",      email: "grace.liu@summithealth.com",         role: "Manager" }],
  crestwood: [{ id: 6, name: "Evan Brooks",    email: "evan.brooks@crestwoodortho.com",     role: "Manager" }, { id: 7, name: "Nina Shah",      email: "nina.shah@crestwoodortho.com",       role: "Member" }],
  lakeside:  [{ id: 8, name: "Carla Mendez",   email: "carla.mendez@lakesidederm.com",      role: "Member"  }],
  pinnacle:  [{ id: 9, name: "Josh Tucker",    email: "josh.tucker@pinnaclesurgical.com",   role: "Manager" }],
  harbor:    [{ id: 10,name: "Amy Colton",     email: "amy.colton@harborcovefh.com",        role: "Member"  }],
};

const ALL_MEMBERS: Member[] = Object.values(SEED).flat();

let _nextId = 20;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

const roleStyle: Record<MemberRole, { bg: string; text: string }> = {
  Manager: { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  Member:  { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
};

function RoleBadge({ role }: { role: MemberRole }) {
  const s = roleStyle[role];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {role}
    </span>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 border text-[#0A1547] font-medium " +
  "placeholder:text-[#0A1547]/30 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/20 " +
  "focus:border-[#A380F6] transition-all";

function seedForClient(id: string): Member[] {
  return id === "all" ? ALL_MEMBERS : (SEED[id] ?? []);
}

export default function AdminMembersPage() {
  const { selectedClient } = useAdminClient();

  const [members, setMembers]     = useState<Member[]>(() => seedForClient(selectedClient.id));
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [role, setRole]           = useState<MemberRole>("Member");
  const [submitted, setSubmitted] = useState(false);
  const [sortKey, setSortKey]     = useState<SortKey | null>(null);
  const [sortDir, setSortDir]     = useState<SortDir>("asc");

  /* Reset the list whenever the selected client changes */
  useEffect(() => {
    setMembers(seedForClient(selectedClient.id));
    setName("");
    setEmail("");
    setRole("Member");
    setSubmitted(false);
    setSortKey(null);
    setSortDir("asc");
  }, [selectedClient.id]);

  const nameErr  = submitted && name.trim() === "";
  const emailErr = submitted && !isValidEmail(email);

  const handleAdd = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email)) return;
    setMembers((prev) => [
      ...prev,
      { id: _nextId++, name: name.trim(), email: email.trim(), role },
    ]);
    setName(""); setEmail(""); setRole("Member"); setSubmitted(false);
  };

  const handleRemove = (id: number) => setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = sortKey
    ? [...members].sort((a, b) => {
        const av = a[sortKey].toLowerCase();
        const bv = b[sortKey].toLowerCase();
        const cmp = av.localeCompare(bv);
        return sortDir === "asc" ? cmp : -cmp;
      })
    : members;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-[#0A1547]/20 ml-0.5 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />;
  }

  return (
    <AdminLayout title="Members">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Members</h2>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Panel header + add form */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <p className="text-base font-black text-[#0A1547] mb-4">Client Members</p>

          <div className="flex flex-wrap gap-3 items-start">
            {/* Name */}
            <div className="flex-1 min-w-36">
              <input
                type="text"
                placeholder="Member name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className={inputCls + (nameErr ? " border-red-300 bg-red-50/40" : " border-gray-200")}
              />
              {nameErr && <p className="mt-1 text-[10px] text-red-500 font-semibold px-1">Name required</p>}
            </div>

            {/* Email */}
            <div className="flex-1 min-w-48">
              <input
                type="email"
                placeholder="Member email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className={inputCls + (emailErr ? " border-red-300 bg-red-50/40" : " border-gray-200")}
              />
              {emailErr && <p className="mt-1 text-[10px] text-red-500 font-semibold px-1">Valid email required</p>}
            </div>

            {/* Role */}
            <div className="relative w-36 flex-shrink-0">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className={inputCls + " border-gray-200 appearance-none pr-8 cursor-pointer"}
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/30 pointer-events-none" />
            </div>

            {/* Add */}
            <button
              onClick={handleAdd}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "#A380F6" }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left">
                  <button
                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Name <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <button
                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
                    onClick={() => handleSort("role")}
                  >
                    Role <SortIcon col="role" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                  Reset
                </th>
                <th className="px-4 py-3.5 pr-5 text-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-sm text-[#0A1547]/30 font-semibold">
                    No members yet — add one above.
                  </td>
                </tr>
              ) : (
                sorted.map((m, idx) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    style={idx === sorted.length - 1 ? { borderBottom: "none" } : {}}
                  >
                    {/* Name + email */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#0A1547] text-sm leading-snug">{m.name}</p>
                      <p className="text-[11px] text-[#0A1547]/35 mt-0.5">{m.email}</p>
                    </td>

                    {/* Role badge */}
                    <td className="px-4 py-4">
                      <RoleBadge role={m.role} />
                    </td>

                    {/* Reset */}
                    <td className="px-4 py-4 text-center">
                      <button
                        className="inline-flex items-center justify-center p-2 rounded-lg text-[#0A1547]/25 hover:text-[#A380F6] hover:bg-[rgba(163,128,246,0.08)] transition-all"
                        title={`Reset password for ${m.name}`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-4 pr-5 text-center">
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={`Remove ${m.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-[11px] text-[#0A1547]/35 font-semibold">
            {sorted.length} member{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
