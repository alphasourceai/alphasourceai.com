import { CreditCard } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
export default function AdminBillingPage() {
  return (
    <AdminLayout title="Billing">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(163,128,246,0.10)", border: "1px solid rgba(163,128,246,0.18)" }}>
          <CreditCard className="w-7 h-7" style={{ color: "#A380F6" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Billing</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">Platform-wide billing, subscription management, and invoice history across all clients. Content to be defined.</p>
      </div>
    </AdminLayout>
  );
}
