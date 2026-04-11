import { CreditCard } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function BillingPage() {
  return (
    <DashboardLayout title="Billing">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(2,217,157,0.10)", border: "1px solid rgba(2,217,157,0.18)" }}
        >
          <CreditCard className="w-7 h-7" style={{ color: "#02D99D" }} />
        </div>
        <h3 className="text-xl font-black text-[#0A1547] mb-2">Billing</h3>
        <p className="text-sm text-[#0A1547]/45 max-w-xs leading-relaxed">
          Billing and subscription management is coming soon. You'll be able to view invoices and manage your plan here.
        </p>
      </div>
    </DashboardLayout>
  );
}
