import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const timeframes = ["7d", "30d", "MTD", "6m", "YTD", "1y"] as const;
type Timeframe = (typeof timeframes)[number];

const statsByTimeframe: Record<Timeframe, { roles: string; candidates: string; avgPerRole: string; avgTime: string }> = {
  "7d":  { roles: "2",  candidates: "38",  avgPerRole: "19.0", avgTime: "1.1 days" },
  "30d": { roles: "5",  candidates: "96",  avgPerRole: "19.2", avgTime: "1.4 days" },
  "MTD": { roles: "3",  candidates: "61",  avgPerRole: "20.3", avgTime: "1.2 days" },
  "6m":  { roles: "12", candidates: "247", avgPerRole: "20.6", avgTime: "1.4 days" },
  "YTD": { roles: "9",  candidates: "183", avgPerRole: "20.3", avgTime: "1.3 days" },
  "1y":  { roles: "14", candidates: "302", avgPerRole: "21.6", avgTime: "1.5 days" },
};

interface StatCardProps {
  label: string;
  value: string;
  subLabel: string;
  barPct: number;
  barColor: string;
}

function StatCard({ label, value, subLabel, barPct, barColor }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col"
      style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 2px 12px rgba(10,21,71,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 mb-4">{label}</p>
      <p className="text-4xl font-black text-[#0A1547] mb-5 leading-none">{value}</p>
      <div className="mt-auto">
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${barPct}%`, backgroundColor: barColor }}
          />
        </div>
        <p className="text-xs text-[#0A1547]/35">{subLabel}</p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");
  const stats = statsByTimeframe[timeframe];

  const cards: StatCardProps[] = [
    { label: "Roles Created", value: stats.roles, subLabel: "active roles", barPct: Math.min(100, parseInt(stats.roles) * 7), barColor: "#A380F6" },
    { label: "Candidates Screened", value: stats.candidates, subLabel: "total screenings", barPct: Math.min(100, parseInt(stats.candidates) / 3.2), barColor: "#02ABE0" },
    { label: "Avg Candidates / Role", value: stats.avgPerRole, subLabel: "per role on average", barPct: Math.min(100, parseFloat(stats.avgPerRole) * 4.5), barColor: "#02D99D" },
    { label: "Avg Time to First Screening", value: stats.avgTime, subLabel: "from role creation", barPct: Math.min(100, 100 - parseFloat(stats.avgTime) * 20), barColor: "#A380F6" },
  ];

  return (
    <DashboardLayout title="Overview">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/35 mb-1.5">Client</p>
          <h2 className="text-2xl font-black text-[#0A1547]">Acme Dental Group</h2>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-white rounded-full p-1" style={{ border: "1px solid rgba(10,21,71,0.08)", boxShadow: "0 1px 6px rgba(10,21,71,0.05)" }}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                timeframe === tf
                  ? "text-white shadow-sm"
                  : "text-[#0A1547]/45 hover:text-[#0A1547]"
              }`}
              style={timeframe === tf ? { backgroundColor: "#0A1547" } : {}}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </DashboardLayout>
  );
}
