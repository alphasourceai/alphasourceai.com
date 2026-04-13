import { ScrollText } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminAuditLogsPage() {
  return (
    <AdminLayout title="Audit Logs">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(10,21,71,0.07)", border: "1px solid rgba(10,21,71,0.12)" }}>
          <ScrollText className="w-7 h-7" style={{ color: "#0A1547" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Audit Logs</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">A full timestamped log of all admin actions, access events, and system changes. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
