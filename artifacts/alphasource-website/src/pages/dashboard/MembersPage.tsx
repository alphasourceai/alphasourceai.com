import { useState } from "react";
import { Trash2, UserPlus, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useClient } from "@/context/ClientContext";

type MemberRole = "Manager" | "Member";
type SortKey = "name" | "email" | "role";
type SortDir = "asc" | "desc";

interface Member {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
}

let _nextId = 4;

const SEED_MEMBERS: Member[] = [
  { id: 1, name: "Sarah Nguyen",  email: "sarah.nguyen@acmedental.com",  role: "Manager" },
  { id: 2, name: "Derek Hall",    email: "derek.hall@acmedental.com",    role: "Member"  },
  { id: 3, name: "Priya Patel",   email: "priya.patel@acmedental.com",   role: "Member"  },
];

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

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-[#0A1547]/20 flex-shrink-0" />;
  return dir === "asc"
    ? <ChevronUp   className="w-3 h-3 text-[#A380F6] flex-shrink-0" />
    : <ChevronDown className="w-3 h-3 text-[#A380F6] flex-shrink-0" />;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function MembersPage() {
  const { selectedClient } = useClient();
  const clientName = selectedClient.id === "all" ? "All Clients" : selectedClient.name;

  const [members, setMembers]   = useState<Member[]>(SEED_MEMBERS);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState<MemberRole>("Member");
  const [submitted, setSubmitted] = useState(false);
  const [sortKey, setSortKey]   = useState<SortKey | null>(null);
  const [sortDir, setSortDir]   = useState<SortDir>("asc");

  const nameErr  = submitted && name.trim() === "";
  const emailErr = submitted && !isValidEmail(email);

  const handleAdd = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email)) return;
    setMembers((prev) => [
      ...prev,
      { id: _nextId++, name: name.trim(), email: email.trim(), role },
    ]);
    setName("");
    setEmail("");
    setRole("Member");
    setSubmitted(false);
  };

  const handleRemove = (id: number) => setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = sortKey
    ? [...members].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = av.localeCompare(bv);
        return sortDir === "asc" ? cmp : -cmp;
      })
    : members;

  const ThSort = ({ col, label, className = "" }: { col: SortKey; label: string; className?: string }) => (
    <th className={`px-4 py-3.5 whitespace-nowrap text-left ${className}`}>
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
      >
        {label}
        <SortIcon active={sortKey === col} dir={sortDir} />
      </button>
    </th>
  );

  return (
    <DashboardLayout title="Members">
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        {/* Panel header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-base font-black text-[#0A1547] mb-4">
            Client Members
            {selectedClient.id !== "all" && (
              <span className="ml-2 text-base font-semibold text-[#0A1547]/40">
                for {clientName}
              </span>
            )}
          </h2>

          {/* Add Member form */}
          <div className="flex flex-wrap gap-3 items-start">
            {/* Name */}
            <div className="flex-1 min-w-[160px]">
              <input
                type="text"
                placeholder="Member name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 border placeholder-gray-400 text-[#0A1547] focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all ${
                  nameErr ? "border-red-300 bg-red-50/40" : "border-gray-200"
                }`}
              />
              {nameErr && (
                <p className="mt-1 text-[10px] text-red-500 font-semibold px-1">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="email"
                placeholder="Member email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 border placeholder-gray-400 text-[#0A1547] focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all ${
                  emailErr ? "border-red-300 bg-red-50/40" : "border-gray-200"
                }`}
              />
              {emailErr && (
                <p className="mt-1 text-[10px] text-red-500 font-semibold px-1">Valid email required</p>
              )}
            </div>

            {/* Role */}
            <div className="w-40 relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all cursor-pointer pr-9"
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/40 pointer-events-none" />
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full transition-all hover:opacity-90 active:scale-[0.97] flex-shrink-0"
              style={{ backgroundColor: "#A380F6" }}
            >
              <UserPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Members table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <ThSort col="name"  label="Name"   className="pl-6" />
                <ThSort col="email" label="Email"  />
                <ThSort col="role"  label="Role"   />
                <th className="px-4 py-3.5 pr-6 text-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
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
                    {/* Name + email sub-line */}
                    <td className="px-4 py-4 pl-6">
                      <p className="font-bold text-[#0A1547] text-sm leading-snug">{m.name}</p>
                      <p className="text-[11px] text-[#0A1547]/35 mt-0.5 md:hidden">{m.email}</p>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-[#0A1547]/55 font-medium">{m.email}</span>
                    </td>

                    {/* Role badge */}
                    <td className="px-4 py-4">
                      <RoleBadge role={m.role} />
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-4 pr-6 text-center">
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-2 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${m.name}`}
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
        <div className="px-6 py-3 border-t border-gray-100">
          <p className="text-[11px] text-[#0A1547]/35 font-semibold">
            {sorted.length} member{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
