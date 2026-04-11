import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Copy,
  Info,
  X,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

type InterviewType = "Basic" | "Detailed" | "Technical";

interface Role {
  id: number;
  name: string;
  date: string;
  type: InterviewType;
  left: number;
  used: number;
  hasRubric: boolean;
  hasJD: boolean;
}

const PLACEHOLDER_ROLES: Role[] = [
  { id: 1, name: "Dental Hygienist", date: "Apr 1, 2026 · 9:00 AM CST", type: "Basic", left: 48, used: 2, hasRubric: true, hasJD: true },
  { id: 2, name: "Front Desk Coordinator", date: "Mar 28, 2026 · 2:15 PM CST", type: "Detailed", left: 45, used: 5, hasRubric: true, hasJD: true },
  { id: 3, name: "Dental Assistant", date: "Mar 15, 2026 · 11:30 AM CST", type: "Technical", left: 49, used: 1, hasRubric: false, hasJD: true },
  { id: 4, name: "Office Manager", date: "Feb 20, 2026 · 4:00 PM CST", type: "Basic", left: 50, used: 0, hasRubric: false, hasJD: false },
];

const typeColors: Record<InterviewType, { bg: string; text: string }> = {
  Basic:     { bg: "rgba(163,128,246,0.10)", text: "#7C5FCC" },
  Detailed:  { bg: "rgba(2,171,224,0.10)",   text: "#0285B0" },
  Technical: { bg: "rgba(2,217,157,0.10)",   text: "#009E73" },
};

function TypeBadge({ type }: { type: InterviewType }) {
  const c = typeColors[type];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {type}
    </span>
  );
}

function UsageBar({ left, used }: { left: number; used: number }) {
  const total = left + used;
  const pct = total > 0 ? (used / total) * 100 : 0;
  return (
    <div className="min-w-[90px]">
      <div className="flex items-baseline gap-1 mb-1.5">
        <span className="text-sm font-black text-[#0A1547]">{left}</span>
        <span className="text-[10px] text-[#0A1547]/40 font-semibold">left</span>
        <span className="text-[10px] text-[#0A1547]/25 mx-0.5">/</span>
        <span className="text-sm font-black text-[#0A1547]/60">{used}</span>
        <span className="text-[10px] text-[#0A1547]/40 font-semibold">used</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div
          className="h-1 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: "#A380F6" }}
        />
      </div>
    </div>
  );
}

function DocButton({ has, label }: { has: boolean; label: string }) {
  if (!has) return <span className="text-[#0A1547]/20 text-sm">—</span>;
  return (
    <button
      onClick={() => {}}
      title={`View ${label}`}
      className="p-2 rounded-lg text-[#0A1547]/40 hover:text-[#A380F6] hover:bg-[#A380F6]/08 transition-colors"
      aria-label={`View ${label}`}
    >
      <FileText className="w-4 h-4" />
    </button>
  );
}

export default function RolesPage() {
  const [roleTitle, setRoleTitle] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("Basic");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setJdFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <DashboardLayout title="Roles">
      {/* Create Role panel */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <h2 className="text-base font-black text-[#0A1547] mb-4">Create Role</h2>

        <form onSubmit={handleCreate}>
          <div className="flex flex-wrap gap-3 items-end">
            {/* Role Title */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                Role Title
              </label>
              <input
                type="text"
                placeholder="e.g. Dental Hygienist"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all"
              />
            </div>

            {/* Interview Type */}
            <div className="w-44">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                Interview Type
              </label>
              <div className="relative">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all cursor-pointer pr-9"
                >
                  <option value="Basic">Basic</option>
                  <option value="Detailed">Detailed</option>
                  <option value="Technical">Technical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1547]/40 pointer-events-none" />
              </div>
            </div>

            {/* JD File Drop zone */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                Job Description
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm ${
                    dragging
                      ? "border-[#A380F6] bg-[#A380F6]/05"
                      : "border-gray-200 hover:border-[#A380F6]/50 hover:bg-gray-50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                  {jdFile ? (
                    <>
                      <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "#A380F6" }} />
                      <span className="text-xs font-semibold text-[#0A1547] truncate">{jdFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-400">Drag JD here or click to browse</span>
                    </>
                  )}
                </div>
                {jdFile && (
                  <button
                    type="button"
                    onClick={() => setJdFile(null)}
                    className="p-2 rounded-lg text-[#0A1547]/30 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Create button */}
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white rounded-full transition-all hover:opacity-90 active:scale-[0.98] flex-shrink-0"
              style={{ backgroundColor: "#A380F6" }}
            >
              Create
            </button>
          </div>
        </form>
      </div>

      {/* Roles table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Role
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Type
                </th>
                <th className="text-left px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Usage
                    <Info className="w-3 h-3 text-[#0A1547]/25" />
                  </span>
                </th>
                <th className="text-center px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Rubric
                    <Info className="w-3 h-3 text-[#0A1547]/25" />
                  </span>
                </th>
                <th className="text-center px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    JD
                    <Info className="w-3 h-3 text-[#0A1547]/25" />
                  </span>
                </th>
                <th className="text-left px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Interview Link
                    <Info className="w-3 h-3 text-[#0A1547]/25" />
                  </span>
                </th>
                <th className="text-center px-4 py-3.5 pr-6 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_ROLES.map((role, idx) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  style={idx === PLACEHOLDER_ROLES.length - 1 ? { borderBottom: "none" } : {}}
                >
                  {/* Role name + date */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#0A1547] text-sm leading-snug">{role.name}</p>
                    <p className="text-[11px] text-[#0A1547]/35 mt-0.5">{role.date}</p>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <TypeBadge type={role.type} />
                  </td>

                  {/* Usage */}
                  <td className="px-4 py-4">
                    <UsageBar left={role.left} used={role.used} />
                  </td>

                  {/* Rubric */}
                  <td className="px-4 py-4 text-center">
                    <DocButton has={role.hasRubric} label="Rubric" />
                  </td>

                  {/* JD */}
                  <td className="px-4 py-4 text-center">
                    <DocButton has={role.hasJD} label="JD" />
                  </td>

                  {/* Interview Link */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-85 active:scale-[0.97]"
                      style={{ backgroundColor: "rgba(163,128,246,0.12)", color: "#7C5FCC" }}
                    >
                      <Copy className="w-3 h-3" />
                      Copy link
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-4 pr-6 text-center">
                    <button
                      onClick={() => {}}
                      className="p-2 rounded-lg text-[#0A1547]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
