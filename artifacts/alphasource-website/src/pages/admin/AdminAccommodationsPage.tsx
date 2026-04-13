import { HeartHandshake } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminAccommodationsPage() {
  return (
    <AdminLayout title="Accommodation Requests">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(255,107,107,0.10)", border: "1px solid rgba(255,107,107,0.18)" }}>
          <HeartHandshake className="w-7 h-7" style={{ color: "#FF6B6B" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Accommodation Requests</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">Review and manage candidate accommodation requests submitted during the interview process. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
