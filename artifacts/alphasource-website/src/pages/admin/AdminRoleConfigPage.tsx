import { useState } from "react";
import { X, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Types ───────────────────────────────────────────────────── */
type RoleType = "Basic" | "Detailed" | "Technical";

interface RubricQuestion {
  id: number;
  text: string;
}

interface RoleConfig {
  id: string;
  clientId: string;
  name: string;
  token: string;
  type: RoleType;
  tavusPrompt: string;
  questions: RubricQuestion[];
}

/* ── Dummy data ──────────────────────────────────────────────── */
let _qId = 100;
function q(text: string): RubricQuestion { return { id: _qId++, text }; }

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: "r1", clientId: "acme", name: "Dental Hygienist", token: "a3f2-19b7-c08d", type: "Basic",
    tavusPrompt: "",
    questions: [
      q("Tell me about your experience with periodontal charting and probing."),
      q("Describe your patient education approach for oral hygiene maintenance."),
      q("How do you handle a patient who is anxious about their appointment?"),
      q("Walk me through your sterilization and infection control procedures."),
      q("Describe a time you identified a clinical finding and escalated appropriately."),
    ],
  },
  {
    id: "r2", clientId: "acme", name: "Front Desk Coordinator", token: "bb41-72e0-d9c3", type: "Detailed",
    tavusPrompt: "",
    questions: [
      q("How do you manage a busy multi-line phone environment?"),
      q("Describe your experience verifying dental insurance eligibility."),
      q("Tell me about a time you de-escalated a frustrated patient at check-in."),
      q("How do you prioritize appointment scheduling when the schedule is overbooked?"),
    ],
  },
  {
    id: "r3", clientId: "acme", name: "Dental Assistant", token: "c510-84fa-0e7b", type: "Technical",
    tavusPrompt: "",
    questions: [
      q("Describe your chairside assisting experience and which procedures you've supported."),
      q("How do you prepare and maintain instrument trays for various procedures?"),
      q("Tell me about your experience with digital X-ray systems."),
      q("Describe a situation where you had to adapt quickly during a procedure."),
    ],
  },
  {
    id: "r4", clientId: "ridge", name: "Medical Receptionist", token: "d6a1-30bc-f25e", type: "Basic",
    tavusPrompt: "",
    questions: [
      q("What EMR or practice management systems have you used?"),
      q("How do you handle co-pay collection and billing inquiries at check-in?"),
      q("Tell me about a time you managed a high patient volume day effectively."),
    ],
  },
  {
    id: "r5", clientId: "summit", name: "Nurse Practitioner", token: "e7b2-41cd-g36f", type: "Technical",
    tavusPrompt: "",
    questions: [
      q("Describe your clinical decision-making process for a complex patient presentation."),
      q("How do you approach medication management and patient education?"),
      q("Tell me about your experience with collaborative physician oversight."),
      q("Describe a time you identified a deteriorating patient and responded promptly."),
      q("How do you stay current with evidence-based practice guidelines?"),
    ],
  },
  {
    id: "r6", clientId: "summit", name: "Office Manager", token: "f8c3-52de-h47g", type: "Detailed",
    tavusPrompt: "",
    questions: [
      q("Describe your experience managing staff schedules and resolving HR issues."),
      q("How have you reduced overhead or improved operational efficiency in a previous role?"),
      q("Tell me about your approach to onboarding new clinical or administrative staff."),
    ],
  },
  {
    id: "r7", clientId: "crestwood", name: "Surgical Tech", token: "g9d4-63ef-i58h", type: "Technical",
    tavusPrompt: "",
    questions: [
      q("Describe your experience scrubbing on orthopedic or surgical cases."),
      q("How do you ensure sterile field integrity throughout a procedure?"),
      q("Tell me about a time you anticipated a surgeon's need during a case."),
      q("Describe your instrument counting process and how you handle count discrepancies."),
    ],
  },
  {
    id: "r8", clientId: "pinnacle", name: "Patient Coordinator", token: "h0e5-74fg-j69i", type: "Basic",
    tavusPrompt: "",
    questions: [
      q("How do you build rapport with patients during the intake and scheduling process?"),
      q("Describe how you explain treatment plans and financial responsibilities to patients."),
      q("Tell me about a time you helped retain a patient who was considering leaving the practice."),
    ],
  },
  {
    id: "r9", clientId: "lakeside", name: "Patient Coordinator", token: "i1f6-85gh-k70j", type: "Basic",
    tavusPrompt: "",
    questions: [
      q("How do you prioritize follow-up calls for patients with pending treatment plans?"),
      q("Describe your experience coordinating referrals to specialists."),
      q("Tell me about a time you navigated a difficult conversation about patient financial responsibility."),
    ],
  },
  {
    id: "r10", clientId: "harbor", name: "Medical Assistant", token: "j2g7-96hi-l81k", type: "Basic",
    tavusPrompt: "",
    questions: [
      q("Describe your clinical skills including vitals, injections, and phlebotomy."),
      q("How do you ensure accuracy when transcribing physician notes into the EHR?"),
      q("Tell me about your experience supporting a busy outpatient clinic."),
    ],
  },
];

const typeColors: Record<RoleType, { bg: string; text: string }> = {
  Basic:     { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  Detailed:  { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
  Technical: { bg: "rgba(2,217,157,0.12)",   text: "#009E73" },
};

/* ── Edit Modal ──────────────────────────────────────────────── */
interface EditModalProps {
  config: RoleConfig;
  onClose: () => void;
}

function EditModal({ config, onClose }: EditModalProps) {
  const [tavus, setTavus]         = useState(config.tavusPrompt);
  const [questions, setQuestions] = useState<RubricQuestion[]>(config.questions);

  const updateQ = (id: number, text: string) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, text } : q)));

  const deleteQ = (id: number) =>
    setQuestions((qs) => qs.filter((q) => q.id !== id));

  const addQ = () =>
    setQuestions((qs) => [...qs, { id: Date.now(), text: "" }]);

  const textareaCls =
    "w-full px-3 py-2.5 rounded-xl text-sm text-[#0A1547] font-medium resize-none " +
    "border border-[rgba(10,21,71,0.10)] bg-white placeholder:text-[#0A1547]/25 " +
    "focus:outline-none focus:border-[#A380F6] transition-colors leading-relaxed";

  const tc = typeColors[config.type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,21,71,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white"
        style={{ border: "1px solid rgba(10,21,71,0.09)", boxShadow: "0 24px 64px rgba(10,21,71,0.18)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/35 mb-1">Role Config</p>
            <h3 className="text-base font-black text-[#0A1547] leading-snug">{config.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-mono text-[#0A1547]/30">Token: {config.token}</span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold"
                style={{ backgroundColor: tc.bg, color: tc.text }}
              >
                {config.type}
              </span>
            </div>
          </div>
          <button
            className="p-2 rounded-xl text-[#0A1547]/30 hover:text-[#0A1547]/70 hover:bg-gray-100 transition-all flex-shrink-0 -mt-1 -mr-1"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Tavus Prompt */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 mb-2">
              Tavus Prompt
            </label>
            <textarea
              rows={3}
              className={textareaCls}
              placeholder="Enter Tavus persona prompt…"
              value={tavus}
              onChange={(e) => setTavus(e.target.value)}
            />
          </div>

          {/* Rubric Questions */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 mb-3">
              Rubric Questions
            </label>
            <div className="space-y-2.5">
              {questions.map((qItem, i) => (
                <div key={qItem.id} className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    className={textareaCls + " flex-1"}
                    placeholder={`Question ${i + 1}`}
                    value={qItem.text}
                    onChange={(e) => updateQ(qItem.id, e.target.value)}
                  />
                  <button
                    className="mt-1 p-2 rounded-xl text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                    onClick={() => deleteQ(qItem.id)}
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#A380F6" }}
              onClick={addQ}
            >
              <Plus className="w-3.5 h-3.5" />
              Add question
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button
            className="px-4 py-2 rounded-full text-xs font-bold text-[#0A1547]/40 hover:text-[#0A1547]/70 hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A380F6" }}
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function AdminRoleConfigPage() {
  const { selectedClient } = useAdminClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortKey, setSortKey]     = useState<"name" | "type">("name");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("asc");

  const handleSort = (key: "name" | "type") => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = selectedClient.id === "all"
    ? ROLE_CONFIGS
    : ROLE_CONFIGS.filter((r) => r.clientId === selectedClient.id);

  const sorted = [...filtered].sort((a, b) => {
    const av = sortKey === "name" ? a.name.toLowerCase() : a.type.toLowerCase();
    const bv = sortKey === "name" ? b.name.toLowerCase() : b.type.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const editingConfig = editingId ? ROLE_CONFIGS.find((r) => r.id === editingId) ?? null : null;

  function SortIcon({ col }: { col: "name" | "type" }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-[#0A1547]/20 ml-0.5 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 text-[#A380F6] ml-0.5 flex-shrink-0" />;
  }

  return (
    <AdminLayout title="Role Config">
      {editingConfig && (
        <EditModal config={editingConfig} onClose={() => setEditingId(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#0A1547]">Role Config</h2>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_160px_96px] items-center px-5 py-3 border-b border-gray-100">
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors text-left"
            onClick={() => handleSort("name")}
          >
            Role <SortIcon col="name" />
          </button>
          <button
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors"
            onClick={() => handleSort("type")}
          >
            Type <SortIcon col="type" />
          </button>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">Config</p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {sorted.map((role) => {
            const tc = typeColors[role.type];
            return (
              <div
                key={role.id}
                className="grid grid-cols-[1fr_160px_96px] items-center px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-bold text-[#0A1547] leading-snug truncate">{role.name}</p>
                  <p className="text-[10px] font-mono text-[#0A1547]/30 mt-0.5 truncate">{role.token}</p>
                </div>

                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold w-fit"
                  style={{ backgroundColor: tc.bg, color: tc.text }}
                >
                  {role.type}
                </span>

                <button
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95 w-fit"
                  style={{ backgroundColor: "#A380F6" }}
                  onClick={() => setEditingId(role.id)}
                >
                  Edit
                </button>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#0A1547]/35 font-semibold">No roles configured for this client.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
