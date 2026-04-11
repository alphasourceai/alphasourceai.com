import { Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function CandidatesPage() {
  return (
    <DashboardLayout title="Candidates">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(163,128,246,0.10)", border: "1px solid rgba(163,128,246,0.18)" }}
        >
          <Users className="w-7 h-7" style={{ color: "#A380F6" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Candidates</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">
          Candidate management is coming soon. You'll be able to review and track all screened candidates from a single view.
        </p>
      </div>
    </DashboardLayout>
  );
}
