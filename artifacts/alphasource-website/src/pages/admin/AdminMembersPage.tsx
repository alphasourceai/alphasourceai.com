import { UserCheck } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminMembersPage() {
  return (
    <AdminLayout title="Members">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(2,171,224,0.10)", border: "1px solid rgba(2,171,224,0.18)" }}>
          <UserCheck className="w-7 h-7" style={{ color: "#02ABE0" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Members</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">Manage users and access roles across all client accounts. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
