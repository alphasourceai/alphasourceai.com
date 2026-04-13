import { useState } from "react";
import { Link } from "wouter";
import {
  Building2, Briefcase, Users, CheckCircle2,
  Star, TrendingUp, ArrowRight, Activity,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClient } from "@/context/AdminClientContext";

/* ── Timeframe ───────────────────────────────────────────────── */
const timeframes = ["7d", "30d", "MTD", "6m", "YTD", "1y"] as const;
type Timeframe = (typeof timeframes)[number];

/* ── Platform-wide stats per timeframe ──────────────────────── */
interface PlatformStats {
  clients:         number;
  roles:           number;
  candidates:      number;
  completed:       number;
  avgScore:        number;
  completionRate:  number;
  rolesDelta:      number;
  candidatesDelta: number;
  completedDelta:  number;
}

const statsByTimeframe: Record<Timeframe, PlatformStats> = {
  "7d":  { clients: 7, roles: 18, candidates: 142,  completed: 138,  avgScore: 74, completionRate: 97, rolesDelta: +3,  candidatesDelta: +28,  completedDelta: +26  },
  "30d": { clients: 7, roles: 31, candidates: 589,  completed: 571,  avgScore: 72, completionRate: 97, rolesDelta: +8,  candidatesDelta: +89,  completedDelta: +82  },
  "MTD": { clients: 7, roles: 24, candidates: 347,  completed: 338,  avgScore: 73, completionRate: 97, rolesDelta: +5,  candidatesDelta: +51,  completedDelta: +49  },
  "6m":  { clients: 7, roles: 68, candidates: 2140, completed: 2073, avgScore: 71, completionRate: 97, rolesDelta: +12, candidatesDelta: +310, completedDelta: +298 },
  "YTD": { clients: 7, roles: 52, candidates: 1680, completed: 1630, avgScore: 72, completionRate: 97, rolesDelta: +9,  candidatesDelta: +240, completedDelta: +232 },
  "1y":  { clients: 7, roles: 84, candidates: 3210, completed: 3110, avgScore: 70, completionRate: 97, rolesDelta: +15, candidatesDelta: +480, completedDelta: +465 },
};

/* ── Recent role activity rows ───────────────────────────────── */
interface ActivityRow {
  client:     string;
  role:       string;
  type:       "Basic" | "Detailed" | "Technical";
  candidates: number;
  date:       string;
}

const recentActivity: ActivityRow[] = [
  { client: "Acme Dental Group",         role: "Dental Hygienist",     type: "Basic",     candidates: 22, date: "Apr 12" },
  { client: "Summit Health Network",     role: "Nurse Practitioner",   type: "Technical", candidates: 18, date: "Apr 11" },
  { client: "Ridge Medical Partners",    role: "Medical Receptionist", type: "Detailed",  candidates: 31, date: "Apr 10" },
  { client: "Crestwood Orthopedics",     role: "Surgical Tech",        type: "Technical", candidates: 15, date: "Apr 9"  },
  { client: "Lakeside Dermatology",      role: "Patient Coordinator",  type: "Basic",     candidates: 27, date: "Apr 8"  },
  { client: "Harbor Cove Family Health", role: "Medical Assistant",    type: "Basic",     candidates: 19, date: "Apr 7"  },
];

/* ── Client breakdown ────────────────────────────────────────── */
interface ClientRow {
  name:       string;
  letter:     string;
  color:      string;
  roles:      number;
  candidates: number;
  avgScore:   number;
}

const clientBreakdown: ClientRow[] = [
  { name: "Acme Dental Group",         letter: "A", color: "#A380F6", roles: 5, candidates: 96,  avgScore: 74 },
  { name: "Ridge Medical Partners",    letter: "R", color: "#02ABE0", roles: 6, candidates: 118, avgScore: 71 },
  { name: "Summit Health Network",     letter: "S", color: "#02D99D", roles: 4, candidates: 82,  avgScore: 73 },
  { name: "Crestwood Orthopedics",     letter: "C", color: "#F0A500", roles: 5, candidates: 103, avgScore: 70 },
  { name: "Lakeside Dermatology",      letter: "L", color: "#FF6B6B", roles: 3, candidates: 67,  avgScore: 75 },
  { name: "Pinnacle Surgical Group",   letter: "P", color: "#5B6FBB", roles: 4, candidates: 71,  avgScore: 72 },
  { name: "Harbor Cove Family Health", letter: "H", color: "#0285B0", roles: 4, candidates: 52,  avgScore: 69 },
];

/* ── Type badge colors ───────────────────────────────────────── */
const typeColors: Record<string, { bg: string; text: string }> = {
  Basic:     { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  Detailed:  { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
  Technical: { bg: "rgba(2,217,157,0.12)",   text: "#009E73" },
};

/* ── Trend indicator ─────────────────────────────────────────── */
function Trend({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-[11px] text-[#0A1547]/30 font-semibold">No change</span>;
  const positive = delta > 0;
  return (
    <span className="text-[11px] font-bold" style={{ color: positive ? "#02D99D" : "#FF6B6B" }}>
      {positive ? "+" : ""}{delta} vs prior period
    </span>
  );
}

/* ── Score badge ─────────────────────────────────────────────── */
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? "#02D99D" : score >= 60 ? "#F0A500" : "#FF6B6B";
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {score}
    </span>
  );
}

/* ── Metric card config ──────────────────────────────────────── */
const metricCards = [
  {
    label:  "Active Clients",
    icon:   Building2,
    color:  "#A380F6",
    format: (s: PlatformStats) => String(s.clients),
    sub:    "client accounts",
    delta:  (_s: PlatformStats) => 0,
  },
  {
    label:  "Active Roles",
    icon:   Briefcase,
    color:  "#02ABE0",
    format: (s: PlatformStats) => String(s.roles),
    sub:    "across all clients",
    delta:  (s: PlatformStats) => s.rolesDelta,
  },
  {
    label:  "Candidates Screened",
    icon:   Users,
    color:  "#02D99D",
    format: (s: PlatformStats) => s.candidates.toLocaleString(),
    sub:    "total screenings",
    delta:  (s: PlatformStats) => s.candidatesDelta,
  },
  {
    label:  "Interviews Completed",
    icon:   CheckCircle2,
    color:  "#F0A500",
    format: (s: PlatformStats) => s.completed.toLocaleString(),
    sub:    "fully submitted",
    delta:  (s: PlatformStats) => s.completedDelta,
  },
  {
    label:  "Avg Overall Score",
    icon:   Star,
    color:  "#A380F6",
    format: (s: PlatformStats) => `${s.avgScore}`,
    sub:    "platform average",
    delta:  (_s: PlatformStats) => 0,
  },
  {
    label:  "Completion Rate",
    icon:   TrendingUp,
    color:  "#02D99D",
    format: (s: PlatformStats) => `${s.completionRate}%`,
    sub:    "started → submitted",
    delta:  (_s: PlatformStats) => 0,
  },
];

export default function AdminOverviewPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");
  const stats = statsByTimeframe[timeframe];
  const { selectedClient } = useAdminClient();

  return (
    <AdminLayout title="Overview">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/35 mb-1">
            {selectedClient.id === "all" ? "Platform" : "Client"}
          </p>
          <h2 className="text-2xl font-black text-[#0A1547] leading-tight">
            {selectedClient.id === "all" ? "All Clients" : selectedClient.name}
          </h2>
        </div>

        {/* Timeframe pill selector */}
        <div
          className="flex items-center gap-0.5 bg-white rounded-full p-1"
          style={{ border: "1px solid rgba(10,21,71,0.08)", boxShadow: "0 1px 6px rgba(10,21,71,0.05)" }}
        >
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                timeframe === tf ? "text-white" : "text-[#0A1547]/40 hover:text-[#0A1547]"
              }`}
              style={timeframe === tf ? { backgroundColor: "#0A1547" } : {}}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metric cards — 2×3 grid ──────────────────────── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
            >
              <div className="h-[3px]" style={{ backgroundColor: card.color }} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">
                    {card.label}
                  </p>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${card.color}18` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                  </div>
                </div>
                <p className="text-[2.25rem] font-black text-[#0A1547] leading-none mb-2">
                  {card.format(stats)}
                </p>
                <div className="mt-auto space-y-0.5">
                  <Trend delta={card.delta(stats)} />
                  <p className="text-[11px] text-[#0A1547]/30 font-medium">{card.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom row: Activity + Client Breakdown ────────── */}
      <div className="grid xl:grid-cols-5 gap-4">

        {/* Recent Role Activity */}
        <div
          className="xl:col-span-3 bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0A1547]/30" />
              <p className="text-sm font-black text-[#0A1547]">Recent Role Activity</p>
            </div>
            <Link
              href="/admin/roles"
              className="flex items-center gap-1 text-xs font-bold transition-colors"
              style={{ color: "#A380F6" }}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((row, i) => {
              const tc = typeColors[row.type];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A1547] truncate leading-snug">{row.role}</p>
                    <p className="text-[11px] text-[#0A1547]/40 mt-0.5">{row.client}</p>
                  </div>
                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                    style={{ backgroundColor: tc.bg, color: tc.text }}
                  >
                    {row.type}
                  </span>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-black text-[#0A1547]">{row.candidates}</p>
                    <p className="text-[10px] text-[#0A1547]/30">screened</p>
                  </div>
                  <p className="flex-shrink-0 text-[11px] text-[#0A1547]/30 w-10 text-right">{row.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clients by Volume */}
        <div
          className="xl:col-span-2 bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-black text-[#0A1547]">Clients by Volume</p>
            <Link
              href="/admin/clients"
              className="flex items-center gap-1 text-xs font-bold transition-colors"
              style={{ color: "#A380F6" }}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {clientBreakdown.map((client, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                  style={{ backgroundColor: client.color }}
                >
                  {client.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0A1547] truncate leading-snug">{client.name}</p>
                  <p className="text-[10px] text-[#0A1547]/35 mt-0.5">
                    {client.roles} roles · {client.candidates} candidates
                  </p>
                </div>
                <ScoreBadge score={client.avgScore} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
