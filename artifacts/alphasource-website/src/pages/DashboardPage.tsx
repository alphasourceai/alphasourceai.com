import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0A1547]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(163,128,246,0.4) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 60% 40%, rgba(163,128,246,0.12) 0%, transparent 60%)"
      }} />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/">
            <img src="/logo-dark-text.png" alt="alphaSource AI" className="h-8 w-auto invert mx-auto" />
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(163,128,246,0.15)", border: "1px solid rgba(163,128,246,0.25)" }}
          >
            <LayoutDashboard className="w-6 h-6" style={{ color: "#A380F6" }} />
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Client Dashboard</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Sign in to access your alphaSource dashboard, review candidate evaluations, and manage your roles.
          </p>

          {/* Placeholder form */}
          <div className="space-y-3 mb-5">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "rgba(163,128,246,0.5)" } as React.CSSProperties}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "rgba(163,128,246,0.5)" } as React.CSSProperties}
            />
          </div>

          <button
            className="w-full py-3 text-sm font-semibold text-white rounded-full transition-all hover:opacity-90 active:scale-[0.99] mb-4"
            style={{ backgroundColor: "#A380F6" }}
            onClick={() => {}}
          >
            Sign In
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "rgba(2,217,157,0.12)", color: "#02D99D" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#02D99D]" />
            Dashboard coming soon
          </div>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
