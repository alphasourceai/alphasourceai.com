import { useState, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";
import { supabase } from "@/lib/supabaseClient";

/* ── Types ───────────────────────────────────────────────────── */
type MemberRole = "Manager" | "Member";
type SortKey    = "name" | "role";
type SortDir    = "asc"  | "desc";

interface Member {
  id:    string;
  name:  string;
  email: string;
  role:  MemberRole;
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

function extractErrorMessage(text: string): string {
  if (!text) return "Failed to load members.";
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

function normalizeMemberRole(value: unknown): MemberRole {
  const role = String(value || "").trim().toLowerCase();
  if (role === "manager" || role === "admin" || role === "tester") return "Manager";
  return "Member";
}

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

export default function AdminMembersPage() {
  const {
    selectedClientId,
    clients: adminClients,
    loading: adminClientsLoading,
    error: adminClientsError,
  } = useAdminClient();

  const [members, setMembers]     = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState<boolean>(false);
  const [membersError, setMembersError] = useState<string>("");
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [role, setRole]           = useState<MemberRole>("Member");
  const [submitted, setSubmitted] = useState(false);
  const [sortKey, setSortKey]     = useState<SortKey | null>(null);
  const [sortDir, setSortDir]     = useState<SortDir>("asc");
  const [actionNotice, setActionNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [removingMembers, setRemovingMembers] = useState<Record<string, boolean>>({});
  const [resettingMembers, setResettingMembers] = useState<Record<string, boolean>>({});

  /* Reset local form/sort state whenever selected client changes */
  useEffect(() => {
    setMembers([]);
    setName("");
    setEmail("");
    setRole("Member");
    setSubmitted(false);
    setSortKey(null);
    setSortDir("asc");
    setActionNotice(null);
    setAddingMember(false);
    setRemovingMembers({});
    setResettingMembers({});
  }, [selectedClientId]);

  useEffect(() => {
    if (!actionNotice) return;
    const timer = setTimeout(() => setActionNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [actionNotice]);

  const getSessionToken = async (): Promise<string> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = String(session?.access_token || "").trim();
    if (!token) throw new Error("Missing session token.");
    return token;
  };

  useEffect(() => {
    let alive = true;

    const fetchMembersForClient = async (clientId: string, token: string): Promise<Member[]> => {
      const response = await fetch(
        `${backendBase}/admin/client-members?client_id=${encodeURIComponent(clientId)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        },
      );
      const text = await response.text();
      if (!response.ok) throw new Error(extractErrorMessage(text));
      const payload = parseJsonSafe(text);
      const items =
        payload && typeof payload === "object" && Array.isArray((payload as { items?: unknown }).items)
          ? ((payload as { items: unknown[] }).items || [])
          : [];
      return items
        .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
        .map((item, index) => ({
          id: String(item.id || item.user_id || item.email || `${clientId}:${index}`),
          name: String(item.name || "").trim() || "—",
          email: String(item.email || "").trim() || "—",
          role: normalizeMemberRole(item.role),
        }));
    };

    const loadMembers = async () => {
      if (adminClientsLoading) return;
      if (adminClientsError) {
        if (!alive) return;
        setMembers([]);
        setMembersError(adminClientsError);
        setMembersLoading(false);
        return;
      }
      if (!backendBase) {
        if (!alive) return;
        setMembers([]);
        setMembersError("Missing backend base URL configuration.");
        setMembersLoading(false);
        return;
      }

      if (!alive) return;
      setMembersLoading(true);
      setMembersError("");

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = String(session?.access_token || "").trim();
        if (!token) throw new Error("Missing session token.");

        let nextMembers: Member[] = [];
        if (selectedClientId === "all") {
          const scopedClientIds = adminClients
            .map((client) => String(client.id || "").trim())
            .filter((clientId) => clientId && clientId !== "all");

          const bundles = await Promise.all(
            scopedClientIds.map(async (clientId) => {
              try {
                return await fetchMembersForClient(clientId, token);
              } catch {
                return [];
              }
            }),
          );
          nextMembers = bundles.flat();
        } else if (selectedClientId) {
          nextMembers = await fetchMembersForClient(selectedClientId, token);
        }

        if (!alive) return;
        setMembers(nextMembers);
      } catch (error) {
        if (!alive) return;
        setMembers([]);
        setMembersError(error instanceof Error ? error.message : "Failed to load members.");
      } finally {
        if (alive) setMembersLoading(false);
      }
    };

    void loadMembers();
    return () => {
      alive = false;
    };
  }, [selectedClientId, adminClients, adminClientsLoading, adminClientsError]);

  const nameErr  = submitted && name.trim() === "";
  const emailErr = submitted && !isValidEmail(email);

  const handleAdd = async () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email)) return;
    if (!backendBase) {
      setActionNotice({ tone: "error", text: "Missing backend base URL configuration." });
      return;
    }
    if (!selectedClientId || selectedClientId === "all") {
      setActionNotice({ tone: "error", text: "Select a client to perform this action." });
      return;
    }

    setActionNotice(null);
    setAddingMember(true);
    try {
      const token = await getSessionToken();
      const response = await fetch(`${backendBase}/admin/client-members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
        body: JSON.stringify({
          client_id: selectedClientId,
          email: email.trim(),
          name: name.trim(),
          role: role === "Manager" ? "manager" : "member",
        }),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(extractErrorMessage(text));
      const payload = parseJsonSafe(text);
      const item =
        payload && typeof payload === "object"
          ? (payload as { item?: unknown }).item
          : null;

      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const nextMember: Member = {
          id: String(row.id || row.user_id || row.email || `member:${_nextId++}`),
          name: String(row.name || "").trim() || "—",
          email: String(row.email || "").trim() || "—",
          role: normalizeMemberRole(row.role),
        };
        setMembers((prev) => [nextMember, ...prev]);
      }

      setName("");
      setEmail("");
      setRole("Member");
      setSubmitted(false);
      setActionNotice({ tone: "success", text: "Invite sent and member added." });
    } catch (error) {
      setActionNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not add member.",
      });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!id) return;
    if (!backendBase) {
      setActionNotice({ tone: "error", text: "Missing backend base URL configuration." });
      return;
    }
    if (!selectedClientId || selectedClientId === "all") {
      setActionNotice({ tone: "error", text: "Select a client to perform this action." });
      return;
    }
    if (removingMembers[id]) return;

    setActionNotice(null);
    setRemovingMembers((prev) => ({ ...prev, [id]: true }));
    try {
      const token = await getSessionToken();
      const response = await fetch(
        `${backendBase}/admin/client-members/${encodeURIComponent(id)}?client_id=${encodeURIComponent(selectedClientId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        },
      );
      const text = await response.text();
      if (!response.ok) throw new Error(extractErrorMessage(text));
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setActionNotice({ tone: "success", text: "Member removed." });
    } catch (error) {
      setActionNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not remove member.",
      });
    } finally {
      setRemovingMembers((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSendPasswordReset = async (member: Member) => {
    const key = member.id || member.email;
    if (!key || !member.email) return;
    if (!backendBase) {
      setActionNotice({ tone: "error", text: "Missing backend base URL configuration." });
      return;
    }
    if (resettingMembers[key]) return;

    setActionNotice(null);
    setResettingMembers((prev) => ({ ...prev, [key]: true }));
    try {
      const token = await getSessionToken();
      const response = await fetch(`${backendBase}/admin/send-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
        body: JSON.stringify({ email: member.email }),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(extractErrorMessage(text));
      setActionNotice({ tone: "success", text: "Password reset email sent." });
    } catch (error) {
      setActionNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Failed to send password reset email.",
      });
    } finally {
      setResettingMembers((prev) => ({ ...prev, [key]: false }));
    }
  };

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
      {actionNotice && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            border: actionNotice.tone === "error" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(2,217,157,0.25)",
            backgroundColor: actionNotice.tone === "error" ? "rgba(239,68,68,0.08)" : "rgba(2,217,157,0.10)",
            color: actionNotice.tone === "error" ? "#DC2626" : "#047857",
          }}
        >
          {actionNotice.text}
        </div>
      )}

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
              onClick={() => {
                void handleAdd();
              }}
              disabled={addingMember}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "#A380F6" }}
            >
              {addingMember ? "Adding..." : "Add"}
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
              {membersLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-sm text-[#0A1547]/30 font-semibold">
                    Loading members...
                  </td>
                </tr>
              ) : membersError ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-sm text-red-500 font-semibold">
                    {membersError}
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
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
                        onClick={() => {
                          void handleSendPasswordReset(m);
                        }}
                        disabled={resettingMembers[m.id || m.email] === true}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-[#0A1547]/25 hover:text-[#A380F6] hover:bg-[rgba(163,128,246,0.08)] transition-all"
                        title={`Reset password for ${m.name}`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-4 pr-5 text-center">
                      <button
                        onClick={() => {
                          void handleRemove(m.id);
                        }}
                        disabled={removingMembers[m.id] === true}
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
