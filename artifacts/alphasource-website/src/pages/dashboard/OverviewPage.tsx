import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Briefcase, Clock, Users, Zap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useClient } from "@/context/ClientContext";

const timeframes = ["7d", "30d", "MTD", "6m", "YTD", "1y"] as const;
type Timeframe = (typeof timeframes)[number];

interface PeriodStats {
  roles: number;
  candidates: number;
  avgPerRole: number;
  avgDays: number;
  rolesDelta: number;
  candidatesDelta: number;
}

const statsByTimeframe: Record<Timeframe, PeriodStats> = {
  "7d":  { roles: 2,  candidates: 38,  avgPerRole: 19.0, avgDays: 1.1, rolesDelta: 0,  candidatesDelta: +12 },
  "30d": { roles: 5,  candidates: 96,  avgPerRole: 19.2, avgDays: 1.4, rolesDelta: +2, candidatesDelta: +23 },
  "MTD": { roles: 3,  candidates: 61,  avgPerRole: 20.3, avgDays: 1.2, rolesDelta: +1, candidatesDelta: +17 },
  "6m":  { roles: 12, candidates: 247, avgPerRole: 20.6, avgDays: 1.4, rolesDelta: +4, candidatesDelta: +61 },
  "YTD": { roles: 9,  candidates: 183, avgPerRole: 20.3, avgDays: 1.3, rolesDelta: +3, candidatesDelta: +47 },
  "1y":  { roles: 14, candidates: 302, avgPerRole: 21.6, avgDays: 1.5, rolesDelta: +5, candidatesDelta: +88 },
};

interface RecentRole {
  name: string;
  type: "Basic" | "Detailed" | "Technical";
  date: string;
  left: number;
  used: number;
}

const recentRoles: RecentRole[] = [
  { name: "Dental Hygienist",      type: "Basic",     date: "Apr 1",  left: 48, used: 2 },
  { name: "Front Desk Coordinator", type: "Detailed",  date: "Mar 28", left: 45, used: 5 },
  { name: "Dental Assistant",       type: "Technical", date: "Mar 15", left: 49, used: 1 },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  Basic:     { bg: "rgba(163,128,246,0.12)", text: "#7C5FCC" },
  Detailed:  { bg: "rgba(2,171,224,0.12)",   text: "#0285B0" },
  Technical: { bg: "rgba(2,217,157,0.12)",   text: "#009E73" },
};

function Trend({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-[11px] text-[#0A1547]/30 font-semibold">No change</span>;
  const positive = delta > 0;
  return (
    <span
      className="text-[11px] font-bold"
      style={{ color: positive ? "#02D99D" : "#FF6B6B" }}
    >
      {positive ? "+" : ""}{delta} vs prior period
    </span>
  );
}

const metricCards = [
  {
    key: "roles" as const,
    label: "Roles Created",
    icon: Briefcase,
    color: "#A380F6",
    format: (s: PeriodStats) => String(s.roles),
    sub: "active roles",
    delta: (s: PeriodStats) => s.rolesDelta,
  },
  {
    key: "candidates" as const,
    label: "Candidates Screened",
    icon: Users,
    color: "#02ABE0",
    format: (s: PeriodStats) => String(s.candidates),
    sub: "total screenings",
    delta: (s: PeriodStats) => s.candidatesDelta,
  },
  {
    key: "avgPerRole" as const,
    label: "Avg Candidates / Role",
    icon: Zap,
    color: "#02D99D",
    format: (s: PeriodStats) => s.avgPerRole.toFixed(1),
    sub: "per role",
    delta: (_s: PeriodStats) => 0,
  },
  {
    key: "avgDays" as const,
    label: "Time to First Screening",
    icon: Clock,
    color: "#A380F6",
    format: (s: PeriodStats) => `${s.avgDays}d`,
    sub: "from role creation",
    delta: (_s: PeriodStats) => 0,
  },
];

export default function OverviewPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");
  const stats = statsByTimeframe[timeframe];
  const { selectedClient } = useClient();

  return (
    <DashboardLayout title="Overview">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/35 mb-1">
            {selectedClient.id === "all" ? "All Clients" : "Client"}
          </p>
          <h2 className="text-2xl font-black text-[#0A1547] leading-tight">{selectedClient.name}</h2>
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

      {/* ── Metric cards ─────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
            >
              {/* Color accent bar */}
              <div className="h-[3px]" style={{ backgroundColor: card.color }} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40">{card.label}</p>
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

      {/* ── Recent Roles ─────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.04)" }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-black text-[#0A1547]">Recent Roles</p>
          <Link
            href="/dashboard/roles"
            className="flex items-center gap-1 text-xs font-bold transition-colors"
            style={{ color: "#A380F6" }}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Role rows */}
        <div className="divide-y divide-gray-50">
          {recentRoles.map((role, i) => {
            const tc = typeColors[role.type];
            const total = role.left + role.used;
            const pct = total > 0 ? (role.used / total) * 100 : 0;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0A1547] leading-snug">{role.name}</p>
                  <p className="text-[11px] text-[#0A1547]/35 mt-0.5">{role.date}</p>
                </div>
                <span
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                  style={{ backgroundColor: tc.bg, color: tc.text }}
                >
                  {role.type}
                </span>
                <div className="flex-shrink-0 w-28 hidden sm:block">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-sm font-black text-[#0A1547]">{role.left}</span>
                    <span className="text-[10px] text-[#0A1547]/35 font-semibold">left</span>
                    <span className="text-[10px] text-[#0A1547]/20 mx-0.5">/</span>
                    <span className="text-sm font-black text-[#0A1547]/50">{role.used}</span>
                    <span className="text-[10px] text-[#0A1547]/35 font-semibold">used</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: "#A380F6" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </DashboardLayout>
  );
}
