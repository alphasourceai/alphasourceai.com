import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  RefreshCw,
  FileText,
  Download,
  FileDown,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import InfoTooltip from "@/components/InfoTooltip";

/* ── Types ──────────────────────────────────────────── */
interface SubScore {
  label: string;
  score: number;
  color: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  resume: number | null;
  interview: number | null;
  overall: number | null;
  created: string;
  resumeSubs: SubScore[];
  resumeSummary: string;
  interviewSubs: SubScore[];
  interviewSummary: string;
  unanswered: string;
  reliability: number;
  risk: "Low" | "Medium" | "High";
  riskText: string;
}

type SortKey = "name" | "email" | "role" | "resume" | "interview" | "overall" | "created";
type SortDir = "asc" | "desc";

/* ── Placeholder data ───────────────────────────────── */
const CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Jordan Kim",
    email: "jordan.kim@email.com",
    role: "Dental Hygienist",
    resume: 80,
    interview: 75,
    overall: 78,
    created: "Apr 1, 2026 · 9:12 AM CST",
    resumeSubs: [
      { label: "Experience", score: 82, color: "#A380F6" },
      { label: "Skills",     score: 78, color: "#02ABE0" },
      { label: "Education",  score: 88, color: "#02D99D" },
    ],
    resumeSummary:
      "Jordan brings 6 years of clinical hygiene experience with expertise in patient care and Eaglesoft charting. Educational credentials meet requirements and the skills profile is well-rounded.",
    interviewSubs: [
      { label: "Clarity",     score: 85, color: "#02ABE0" },
      { label: "Confidence",  score: 72, color: "#A380F6" },
      { label: "Engagement",  score: 80, color: "#02D99D" },
    ],
    interviewSummary:
      "Jordan communicated clearly with strong preparation. Showed genuine enthusiasm for the role. Confidence could be stronger on technical questions but overall a solid performance.",
    unanswered: "None captured.",
    reliability: 78,
    risk: "Low",
    riskText: "Responses were consistent, specific, and authentic throughout the interview. No patterns of scripted or rehearsed answers detected.",
  },
  {
    id: 2,
    name: "Marcy O'Brien",
    email: "marcy.obrien@email.com",
    role: "Front Desk Coordinator",
    resume: 85,
    interview: null,
    overall: null,
    created: "Mar 28, 2026 · 2:15 PM CST",
    resumeSubs: [
      { label: "Experience", score: 88, color: "#A380F6" },
      { label: "Skills",     score: 82, color: "#02ABE0" },
      { label: "Education",  score: 79, color: "#02D99D" },
    ],
    resumeSummary:
      "Marcy has 4 years of front-desk experience in dental and urgent care settings, with strong command of scheduling systems and patient communication.",
    interviewSubs: [
      { label: "Clarity",    score: 0, color: "#02ABE0" },
      { label: "Confidence", score: 0, color: "#A380F6" },
      { label: "Engagement", score: 0, color: "#02D99D" },
    ],
    interviewSummary: "Interview not yet completed.",
    unanswered: "Interview not yet completed.",
    reliability: 0,
    risk: "Low",
    riskText: "Interview not yet completed. Risk analysis will populate after the interview is finished.",
  },
  {
    id: 3,
    name: "Devon Watts",
    email: "devon.watts@email.com",
    role: "Dental Assistant",
    resume: 60,
    interview: 55,
    overall: 58,
    created: "Mar 15, 2026 · 11:30 AM CST",
    resumeSubs: [
      { label: "Experience", score: 62, color: "#A380F6" },
      { label: "Skills",     score: 58, color: "#02ABE0" },
      { label: "Education",  score: 65, color: "#02D99D" },
    ],
    resumeSummary:
      "Devon shows entry-level experience with a dental assisting certificate. Limited hands-on clinical exposure so far but demonstrates basic knowledge of chairside procedures.",
    interviewSubs: [
      { label: "Clarity",    score: 60, color: "#02ABE0" },
      { label: "Confidence", score: 48, color: "#A380F6" },
      { label: "Engagement", score: 58, color: "#02D99D" },
    ],
    interviewSummary:
      "Devon gave somewhat vague responses on technical questions. Enthusiasm was present but answers lacked depth. Some responses lacked specificity suggesting limited preparation.",
    unanswered: "Q: Describe your sterilization process. — Response was incomplete.",
    reliability: 55,
    risk: "Medium",
    riskText: "Several responses lacked specificity and occasionally repeated phrasing across multiple questions. Recommend a follow-up conversation to clarify key answers.",
  },
  {
    id: 4,
    name: "Ashley Norris",
    email: "ashley.norris@email.com",
    role: "Office Manager",
    resume: 92,
    interview: 88,
    overall: 90,
    created: "Feb 20, 2026 · 4:00 PM CST",
    resumeSubs: [
      { label: "Experience", score: 95, color: "#A380F6" },
      { label: "Skills",     score: 90, color: "#02ABE0" },
      { label: "Education",  score: 88, color: "#02D99D" },
    ],
    resumeSummary:
      "Ashley has 9 years of dental practice management with demonstrated success reducing overhead and improving patient flow. Strong leadership and operations credentials.",
    interviewSubs: [
      { label: "Clarity",    score: 90, color: "#02ABE0" },
      { label: "Confidence", score: 92, color: "#A380F6" },
      { label: "Engagement", score: 85, color: "#02D99D" },
    ],
    interviewSummary:
      "Ashley delivered well-structured, specific responses with compelling examples of practice improvement initiatives. Demonstrated strong strategic thinking and team leadership instincts.",
    unanswered: "None captured.",
    reliability: 91,
    risk: "Low",
    riskText: "High response quality with detailed, role-specific examples throughout. Answers were natural and varied in structure, strongly indicating authentic, unprompted responses.",
  },
  {
    id: 5,
    name: "Marcus Bell",
    email: "marcus.bell@email.com",
    role: "Dental Hygienist",
    resume: 35,
    interview: 40,
    overall: 38,
    created: "Mar 10, 2026 · 8:45 AM CST",
    resumeSubs: [
      { label: "Experience", score: 30, color: "#A380F6" },
      { label: "Skills",     score: 40, color: "#02ABE0" },
      { label: "Education",  score: 45, color: "#02D99D" },
    ],
    resumeSummary:
      "Marcus's resume shows limited clinical experience and no dental-specific credentials. Background is primarily in general healthcare support roles.",
    interviewSubs: [
      { label: "Clarity",    score: 42, color: "#02ABE0" },
      { label: "Confidence", score: 38, color: "#A380F6" },
      { label: "Engagement", score: 44, color: "#02D99D" },
    ],
    interviewSummary:
      "Responses were frequently off-topic or generic. Marcus struggled to demonstrate relevant knowledge of dental hygiene procedures. Several responses lacked depth.",
    unanswered:
      "Q: Describe your patient charting workflow. — No substantive response given.\nQ: How do you handle nervous patients? — Response was incomplete.",
    reliability: 42,
    risk: "High",
    riskText: "Multiple responses exhibited repeated generic phrasing and lacked role-specific detail. Patterns are consistent with scripted or AI-assisted answers. A live screening call is strongly recommended before proceeding.",
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    role: "Front Desk Coordinator",
    resume: 73,
    interview: 68,
    overall: 71,
    created: "Mar 5, 2026 · 1:00 PM CST",
    resumeSubs: [
      { label: "Experience", score: 70, color: "#A380F6" },
      { label: "Skills",     score: 75, color: "#02ABE0" },
      { label: "Education",  score: 72, color: "#02D99D" },
    ],
    resumeSummary:
      "Priya has 3 years of front-desk experience in a multi-provider dental office. Demonstrates proficiency with scheduling software and bilingual communication (English/Hindi).",
    interviewSubs: [
      { label: "Clarity",    score: 72, color: "#02ABE0" },
      { label: "Confidence", score: 62, color: "#A380F6" },
      { label: "Engagement", score: 75, color: "#02D99D" },
    ],
    interviewSummary:
      "Priya gave solid responses with reasonable depth. Some hesitation around conflict-resolution scenarios. Bilingual skills noted as a genuine differentiator for patient communication.",
    unanswered: "None captured.",
    reliability: 70,
    risk: "Low",
    riskText: "Responses were generally authentic and well-grounded. Minor hesitations were contextually appropriate and not indicative of scripted patterns.",
  },
];

/* ── Utilities ──────────────────────────────────────── */
function scoreColor(score: number | null): string {
  if (score === null) return "#0A1547";
  if (score >= 75) return "#02D99D";
  if (score >= 60) return "#F0A500";
  return "#FF6B6B";
}

function scoreBg(score: number | null): string {
  if (score === null) return "rgba(10,21,71,0.05)";
  if (score >= 75) return "rgba(2,217,157,0.10)";
  if (score >= 60) return "rgba(240,165,0,0.10)";
  return "rgba(255,107,107,0.10)";
}

function riskColor(risk: "Low" | "Medium" | "High"): string {
  return risk === "Low" ? "#02D99D" : risk === "Medium" ? "#F0A500" : "#FF6B6B";
}

/* ── Score number color: dynamic by value ───────────── */
function subScoreNumColor(score: number): string {
  if (score === 0) return "rgba(10,21,71,0.25)";
  if (score >= 80) return "#02D99D";
  if (score >= 70) return "#F0A500";
  return "#FF6B6B";
}

const LABEL_TOOLTIPS: Record<string, string> = {
  Experience:  "Depth and relevance of prior work history to this role",
  Skills:      "Technical and role-specific competency alignment",
  Education:   "Credential match against stated educational requirements",
  Clarity:     "How clearly the candidate expressed their thoughts",
  Confidence:  "Composure and assurance demonstrated throughout the interview",
  Engagement:  "Level of enthusiasm and active participation shown",
};

/* ── Sub-components ─────────────────────────────────── */
function ScoreBar({ label, score, barColor }: SubScore & { barColor: string }) {
  const numColor = subScoreNumColor(score);
  const tip = LABEL_TOOLTIPS[label];
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1 text-xs font-semibold text-[#0A1547]/60">
          {label}
          {tip && <InfoTooltip content={tip} side="top" iconClassName="w-2.5 h-2.5 text-[#0A1547]/20" />}
        </span>
        <span className="text-xs font-black" style={{ color: numColor }}>{score > 0 ? `${score}%` : "—"}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: score > 0 ? barColor : "transparent" }}
        />
      </div>
    </div>
  );
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#0A1547]/25 text-sm font-semibold">—</span>;
  const color = scoreColor(score);
  return (
    <div className="min-w-[52px]">
      <p className="text-sm font-black leading-none mb-1.5" style={{ color }}>{score}%</p>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div className="h-1 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/* ── Sort icon ──────────────────────────────────────── */
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-[#0A1547]/20 flex-shrink-0" />;
  return dir === "asc"
    ? <ChevronUp className="w-3 h-3 text-[#A380F6] flex-shrink-0" />
    : <ChevronDown className="w-3 h-3 text-[#A380F6] flex-shrink-0" />;
}

/* ── Expanded row panel ─────────────────────────────── */
function ExpandedPanel({ c }: { c: Candidate }) {
  const hasInterview = c.interview !== null;
  return (
    <div className="border-t border-gray-100 bg-[#F8F9FD] px-6 py-5">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: "Refresh",      icon: RefreshCw },
          { label: "Transcript",   icon: FileText },
          { label: "Resume",       icon: Download },
          { label: "Download PDF", icon: FileDown },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border transition-all hover:shadow-sm active:scale-[0.98]"
            style={{ backgroundColor: "white", borderColor: "rgba(10,21,71,0.12)", color: "#0A1547" }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* 2×2 analysis grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Analysis */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/75">Resume Analysis</p>
            <InfoTooltip content="AI analysis of the candidate's submitted resume across key evaluation dimensions" side="bottom" />
          </div>
          <div className="mb-4">
            {c.resumeSubs.map((s) => <ScoreBar key={s.label} {...s} barColor="#02ABE0" />)}
          </div>
          <p className="text-xs leading-relaxed text-[#0A1547]/60">
            <span className="font-black text-[#0A1547]/80">Summary: </span>
            {c.resumeSummary}
          </p>
        </div>

        {/* Interview Analysis */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/75">Interview Analysis</p>
            <InfoTooltip content="AI-scored evaluation of the candidate's interview performance across verbal and communication dimensions" side="bottom" />
          </div>
          {hasInterview ? (
            <>
              <div className="mb-4">
                {c.interviewSubs.map((s) => <ScoreBar key={s.label} {...s} barColor="#A380F6" />)}
              </div>
              <p className="text-xs leading-relaxed text-[#0A1547]/60">
                <span className="font-black text-[#0A1547]/80">Summary: </span>
                {c.interviewSummary}
              </p>
            </>
          ) : (
            <p className="text-xs text-[#0A1547]/40 italic">Interview not yet completed.</p>
          )}
        </div>

        {/* Unanswered Questions */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/75">Unanswered Questions</p>
            <InfoTooltip content="Interview questions the candidate did not answer or skipped during the AI session" side="bottom" />
          </div>
          <p className="text-xs leading-relaxed text-[#0A1547]/60 whitespace-pre-line">{c.unanswered}</p>
        </div>

        {/* Signals */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/75">Signals</p>
            <InfoTooltip content="Behavioral signals detected during the interview, including response reliability and AI-assisted answer risk" side="bottom" />
          </div>
          {hasInterview ? (
            <div className="space-y-3">
              {/* Evaluation Reliability */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#0A1547]/60">
                    Evaluation Reliability
                    <InfoTooltip content="Confidence score for the overall AI evaluation based on response completeness and consistency" side="top" />
                  </span>
                  <span className="text-xs font-black text-[#0A1547]">{c.reliability}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${c.reliability}%`,
                      backgroundColor: c.reliability >= 70 ? "#02D99D" : c.reliability >= 55 ? "#F0A500" : "#FF6B6B",
                    }}
                  />
                </div>
              </div>

              {/* AI-aided interview risk */}
              <div className="flex items-center gap-2 pt-1">
                <span className="flex items-center gap-1 text-xs font-semibold text-[#0A1547]/60">
                  AI-aided interview risk
                  <InfoTooltip content="Likelihood that the candidate used AI tools or scripted assistance during the interview" side="top" />
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: riskColor(c.risk) }}
                />
                <span className="text-xs font-bold" style={{ color: riskColor(c.risk) }}>{c.risk}</span>
              </div>

              {/* Risk narrative text */}
              <p className="text-[11px] text-[#0A1547]/50 leading-relaxed border-t border-gray-100 pt-3">
                {c.riskText}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#0A1547]/40 italic">Signals will appear after the interview is completed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────── */
export default function CandidatesPage() {
  const [expandedId, setExpandedId]     = useState<number | null>(null);
  const [minScore, setMinScore]         = useState("");
  const [sortKey, setSortKey]           = useState<SortKey | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>("asc");
  const minScoreInputRef                = useRef<HTMLInputElement>(null);

  const minScoreNum = minScore === "" ? null : parseInt(minScore, 10);

  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* Filter */
  const filtered = CANDIDATES.filter((c) => {
    if (minScoreNum !== null && !isNaN(minScoreNum)) {
      if (c.overall === null || c.overall < minScoreNum) return false;
    }
    return true;
  });

  /* Sort */
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        let av: string | number | null;
        let bv: string | number | null;
        switch (sortKey) {
          case "name":      av = a.name; bv = b.name; break;
          case "email":     av = a.email; bv = b.email; break;
          case "role":      av = a.role; bv = b.role; break;
          case "resume":    av = a.resume ?? -1; bv = b.resume ?? -1; break;
          case "interview": av = a.interview ?? -1; bv = b.interview ?? -1; break;
          case "overall":   av = a.overall ?? -1; bv = b.overall ?? -1; break;
          case "created":   av = a.id; bv = b.id; break;
          default:          av = 0; bv = 0;
        }
        if (av === null) av = "";
        if (bv === null) bv = "";
        const cmp = typeof av === "string"
          ? av.localeCompare(bv as string)
          : (av as number) - (bv as number);
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  /* Column header button helper */
  const Th = ({
    col,
    label,
    align = "left",
    className = "",
    tooltip,
  }: {
    col: SortKey;
    label: string;
    align?: "left" | "center";
    className?: string;
    tooltip?: string;
  }) => (
    <th className={`px-4 py-3.5 whitespace-nowrap ${className}`}>
      <button
        onClick={() => handleSort(col)}
        className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 hover:text-[#0A1547]/70 transition-colors ${align === "center" ? "mx-auto" : ""}`}
      >
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
        <SortIcon active={sortKey === col} dir={sortDir} />
      </button>
    </th>
  );

  return (
    <DashboardLayout title="Candidates">
      {/* ── Filter bar ────────────────────────────── */}
      <div
        className="bg-white rounded-2xl px-5 py-4 mb-5 flex flex-wrap items-center gap-3"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <span className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40">Filters</span>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#0A1547]/50">Role</label>
          <select
            className="w-24 h-[30px] text-xs font-semibold text-[#0A1547] bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] cursor-pointer"
            value="all"
            onChange={() => {}}
          >
            <option value="all">All roles</option>
          </select>
        </div>

        {/* Min Overall Score */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#0A1547]/50 whitespace-nowrap">Min Overall Score</label>
          <div className="relative flex items-center">
            <input
              ref={minScoreInputRef}
              type="number"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="e.g. 70"
              className="text-xs font-semibold text-[#0A1547] bg-gray-50 border border-gray-200 rounded-full pl-3 pr-7 py-1.5 w-24 h-[30px] focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] placeholder-gray-400"
            />
            {minScore !== "" && (
              <button
                onClick={() => { setMinScore(""); minScoreInputRef.current?.focus(); }}
                className="absolute right-2 text-[#0A1547]/30 hover:text-[#0A1547]/60 transition-colors"
                aria-label="Clear score filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Export */}
        <div className="ml-auto">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#A380F6", color: "white" }}
          >
            <FileDown className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {/* Expand toggle — not sortable */}
                <th className="w-10 px-4 py-3.5" />

                <Th col="name"      label="Name" />
                <Th col="email"     label="Email"     className="hidden md:table-cell" />
                <Th col="role"      label="Role"      className="hidden lg:table-cell" />
                <Th col="resume"    label="Resume"    tooltip="AI-analyzed resume score out of 100" />
                <Th col="interview" label="Interview" tooltip="AI-scored interview performance out of 100" />
                <Th col="overall"   label="Overall"   tooltip="Combined weighted score from resume and interview" />
                <Th col="created"   label="Created"   className="hidden sm:table-cell pr-6" />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-[#0A1547]/35 font-semibold">
                    No candidates match your filters.
                  </td>
                </tr>
              ) : (
                sorted.map((c, idx) => {
                  const isExpanded = expandedId === c.id;
                  const isLast = idx === sorted.length - 1;
                  return (
                    <React.Fragment key={c.id}>
                      <tr
                        className={`transition-colors cursor-pointer hover:bg-gray-50/70 ${
                          isExpanded ? "bg-[#F8F9FD]" : ""
                        } ${!isLast || isExpanded ? "border-b border-gray-100" : ""}`}
                        onClick={() => toggle(c.id)}
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-4 w-10">
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{
                              backgroundColor: isExpanded
                                ? "rgba(163,128,246,0.12)"
                                : "rgba(10,21,71,0.05)",
                              color: isExpanded ? "#A380F6" : "#0A1547",
                            }}
                            onClick={(e) => { e.stopPropagation(); toggle(c.id); }}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded
                              ? <ChevronUp className="w-3.5 h-3.5" />
                              : <ChevronDown className="w-3.5 h-3.5" />
                            }
                          </button>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-[#0A1547] text-sm leading-snug">{c.name}</p>
                          <p className="text-[11px] text-[#0A1547]/35 mt-0.5 md:hidden">{c.email}</p>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-sm text-[#0A1547]/55 font-medium">{c.email}</span>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-sm text-[#0A1547]/70 font-semibold">{c.role}</span>
                        </td>

                        {/* Resume score */}
                        <td className="px-4 py-4"><ScoreCell score={c.resume} /></td>

                        {/* Interview score */}
                        <td className="px-4 py-4"><ScoreCell score={c.interview} /></td>

                        {/* Overall score */}
                        <td className="px-4 py-4">
                          {c.overall !== null ? (
                            <div className="min-w-[52px]">
                              <span
                                className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-black"
                                style={{ backgroundColor: scoreBg(c.overall), color: scoreColor(c.overall) }}
                              >
                                {c.overall}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#0A1547]/25 text-sm font-semibold">—</span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="px-4 py-4 pr-6 hidden sm:table-cell">
                          <p className="text-xs font-semibold text-[#0A1547]/40 whitespace-nowrap leading-snug">
                            {c.created.split(" · ")[0]}
                          </p>
                          <p className="text-[11px] text-[#0A1547]/25 mt-0.5">
                            {c.created.split(" · ")[1]}
                          </p>
                        </td>
                      </tr>

                      {/* Expanded panel */}
                      {isExpanded && (
                        <tr className={!isLast ? "border-b border-gray-100" : ""}>
                          <td colSpan={8} className="p-0">
                            <ExpandedPanel c={c} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row count */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center">
          <p className="text-[11px] text-[#0A1547]/35 font-semibold">
            {sorted.length} of {CANDIDATES.length} candidate{CANDIDATES.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
