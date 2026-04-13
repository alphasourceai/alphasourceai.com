import { Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminCandidatesPage() {
  return (
    <AdminLayout title="Candidates">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(2,217,157,0.10)", border: "1px solid rgba(2,217,157,0.18)" }}>
          <Users className="w-7 h-7" style={{ color: "#02D99D" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Candidates</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">All candidate records across all clients and roles. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
