import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
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
}

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

/* ── Sub-component: score bar ───────────────────────── */
function ScoreBar({ label, score, color }: SubScore) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-[#0A1547]/60">{label}</span>
        <span className="text-xs font-black" style={{ color }}>{score}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Sub-component: mini score cell ────────────────────*/
function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#0A1547]/25 text-sm font-semibold">—</span>;
  const color = scoreColor(score);
  const pct = score;
  return (
    <div className="min-w-[52px]">
      <p className="text-sm font-black leading-none mb-1.5" style={{ color }}>{score}%</p>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/* ── Sub-component: expanded row ───────────────────── */
function ExpandedPanel({ c }: { c: Candidate }) {
  const hasInterview = c.interview !== null;
  return (
    <div className="border-t border-gray-100 bg-[#F8F9FD] px-6 py-5">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: "Refresh",       icon: RefreshCw },
          { label: "Transcript",    icon: FileText },
          { label: "Resume",        icon: Download },
          { label: "Download PDF",  icon: FileDown },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border transition-all hover:shadow-sm active:scale-[0.98]"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(10,21,71,0.12)",
              color: "#0A1547",
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* 2×2 grid of analysis cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Analysis */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40 mb-4">Resume Analysis</p>
          <div className="mb-4">
            {c.resumeSubs.map((s) => <ScoreBar key={s.label} {...s} />)}
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
          <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40 mb-4">Interview Analysis</p>
          {hasInterview ? (
            <>
              <div className="mb-4">
                {c.interviewSubs.map((s) => <ScoreBar key={s.label} {...s} />)}
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
          <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40 mb-3">Unanswered Questions</p>
          <p className="text-xs leading-relaxed text-[#0A1547]/60 whitespace-pre-line">{c.unanswered}</p>
        </div>

        {/* Signals */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 10px rgba(10,21,71,0.04)" }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#0A1547]/40 mb-4">Signals</p>
          {hasInterview ? (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#0A1547]/60">Evaluation Reliability</span>
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
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#0A1547]/60">AI-aided interview risk:</span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: riskColor(c.risk) }}
                />
                <span className="text-xs font-bold" style={{ color: riskColor(c.risk) }}>{c.risk}</span>
              </div>
              {c.risk !== "Low" && (
                <p className="text-[11px] text-[#0A1547]/40 leading-relaxed">
                  Some responses lacked specificity and depth, suggesting potential scripted patterns.
                </p>
              )}
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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [minScore, setMinScore] = useState("");
  const minScoreInputRef = useRef<HTMLInputElement>(null);

  const minScoreNum = minScore === "" ? null : parseInt(minScore, 10);

  const filtered = CANDIDATES.filter((c) => {
    if (minScoreNum !== null && !isNaN(minScoreNum)) {
      if (c.overall === null || c.overall < minScoreNum) return false;
    }
    return true;
  });

  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

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
            className="text-xs font-semibold text-[#0A1547] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] cursor-pointer"
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
              className="text-xs font-semibold text-[#0A1547] bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] placeholder-gray-400"
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

        {/* Spacer + Export */}
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
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-4 py-3.5" />
                <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap">
                  Name
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap hidden lg:table-cell">
                  Role
                </th>
                <th className="text-left px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Resume <InfoTooltip content="AI-analyzed resume score out of 100" />
                  </span>
                </th>
                <th className="text-left px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Interview <InfoTooltip content="AI-scored interview performance out of 100" />
                  </span>
                </th>
                <th className="text-left px-4 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    Overall <InfoTooltip content="Combined weighted score from resume and interview" />
                  </span>
                </th>
                <th className="text-left px-4 py-3.5 pr-6 text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 whitespace-nowrap hidden sm:table-cell">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-[#0A1547]/35 font-semibold">
                    No candidates match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => {
                  const isExpanded = expandedId === c.id;
                  const isLast = idx === filtered.length - 1;
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
                        <td className="px-4 py-4">
                          <ScoreCell score={c.resume} />
                        </td>

                        {/* Interview score */}
                        <td className="px-4 py-4">
                          <ScoreCell score={c.interview} />
                        </td>

                        {/* Overall score */}
                        <td className="px-4 py-4">
                          {c.overall !== null ? (
                            <div className="min-w-[52px]">
                              <span
                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black"
                                style={{
                                  backgroundColor: scoreBg(c.overall),
                                  color: scoreColor(c.overall),
                                }}
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

                      {/* Expanded panel — rendered as a full-width row */}
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
            {filtered.length} of {CANDIDATES.length} candidate{CANDIDATES.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
