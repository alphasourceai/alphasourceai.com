import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [emailError, setEmailError]         = useState("");
  const dropdownRef                         = useRef<HTMLDivElement>(null);
  const { loginAdmin, adminLoginLoading, adminLoginError, clearAdminLoginError } = useAuth();
  const [, setLocation]                     = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAdminLoginOpen(false);
      }
    };
    if (adminLoginOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminLoginOpen]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setEmailError("Email and password are required.");
      clearAdminLoginError();
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setEmailError("Please enter a valid email address.");
      clearAdminLoginError();
      return;
    }
    setEmailError("");
    const { error } = await loginAdmin(normalizedEmail, password);
    if (error) return;
    setAdminLoginOpen(false);
    setLocation("/admin");
  };

  return (
    <footer className="bg-[#0A1547] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="/alpha-symbol.png" alt="AlphaSource AI" className="h-10 w-auto" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Agentic AI that enhances human judgment — helping teams reclaim time and spot potential in every talent interaction.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#A380F6]/30 transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#A380F6]/30 transition-colors"
                aria-label="Twitter/X"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Home",         href: "/" },
                { label: "About Us",     href: "/about" },
                { label: "alphaScreen",  href: "/alphascreen" },
                { label: "How It Works", href: "/#how-it-works" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-[#A380F6] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@alphasourceai.com" className="text-sm text-white/60 hover:text-[#A380F6] transition-colors">
                  info@alphasourceai.com
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-sm font-semibold transition-colors hover:text-white" style={{ color: "#A380F6" }}>
                  Request a Demo →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} AlphaSource AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              Terms &amp; Conditions
            </a>

            {/* Admin Login */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setAdminLoginOpen((o) => !o);
                  setEmailError("");
                  clearAdminLoginError();
                }}
                className="text-white/25 text-xs hover:text-white/50 transition-colors font-semibold"
              >
                Admin Login
              </button>

              {adminLoginOpen && (
                <div
                  className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {/* Small arrow pointing down */}
                  <div
                    className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"
                  />
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-[#0A1547]">Admin Sign In</h3>
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(163,128,246,0.12)", color: "#7C5FCC" }}
                      >
                        Admin
                      </span>
                    </div>
                    <p className="text-[10px] text-[#0A1547]/45">Access the AlphaSource admin dashboard</p>
                  </div>

                  <form onSubmit={handleAdminSignIn} className="space-y-2.5">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                        clearAdminLoginError();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearAdminLoginError();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/25 focus:border-[#A380F6] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={adminLoginLoading}
                      className="w-full py-2.5 text-sm font-bold text-white rounded-full transition-all hover:opacity-90 active:scale-[0.99]"
                      style={{ backgroundColor: "#A380F6" }}
                    >
                      {adminLoginLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                  {emailError && (
                    <p className="mt-2 text-xs text-red-500">{emailError}</p>
                  )}
                  {adminLoginError && (
                    <p className="mt-2 text-xs text-red-500">{adminLoginError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
