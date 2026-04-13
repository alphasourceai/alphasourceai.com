import { Settings } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminRoleConfigPage() {
  return (
    <AdminLayout title="Role Config">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(240,165,0,0.10)", border: "1px solid rgba(240,165,0,0.18)" }}>
          <Settings className="w-7 h-7" style={{ color: "#F0A500" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Role Config</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">Configure interview types, rubrics, scoring rules, and role defaults. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
