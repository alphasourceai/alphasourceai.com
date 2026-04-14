import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
  ChevronRight,
  ChevronLeft,
  Map,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useClient, CLIENTS } from "@/context/ClientContext";

interface NavItem {
  label: string;
  href:  string;
  icon:  React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Overview",   href: "/dashboard",            icon: LayoutDashboard },
  { label: "Roles",      href: "/dashboard/roles",       icon: Briefcase       },
  { label: "Candidates", href: "/dashboard/candidates",  icon: Users           },
  { label: "Members",    href: "/dashboard/members",     icon: UserCheck       },
  { label: "Billing",    href: "/dashboard/billing",     icon: CreditCard      },
];

/* ── Tour steps ──────────────────────────────────────────────── */
interface TourStep {
  navIndex: number;
  title:    string;
  emoji:    string;
  desc:     string;
  bullets:  string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    navIndex: 0,
    title: "Overview",
    emoji: "📊",
    desc: "Your command center. See your hiring pipeline at a glance — active roles, recent candidate activity, score distributions, and top performers across your account.",
    bullets: ["Hiring pipeline summary", "Recent candidate submissions", "Score distribution at a glance"],
  },
  {
    navIndex: 1,
    title: "Roles",
    emoji: "💼",
    desc: "Create and manage open positions. Each role links to its AlphaScreen interview session and tracks every candidate assigned to it.",
    bullets: ["Create & publish new roles", "Track role status (open / closed)", "View candidates per role"],
  },
  {
    navIndex: 2,
    title: "Candidates",
    emoji: "👥",
    desc: "Review everyone who has applied or been invited. Expand any row to see their full resume and interview analysis, AI scores, and behavioral risk signals.",
    bullets: ["Resume & interview AI analysis", "Dynamic scoring with risk signals", "Sort, filter, and export results"],
  },
  {
    navIndex: 3,
    title: "Members",
    emoji: "🛡️",
    desc: "Control who has access to your AlphaSource dashboard. Invite teammates, assign roles, and remove users who no longer need access.",
    bullets: ["Invite team members by email", "Assign Admin or Viewer roles", "Remove or reset member access"],
  },
  {
    navIndex: 4,
    title: "Billing",
    emoji: "💳",
    desc: "Manage your subscription, review past invoices, and update payment details — all in one place.",
    bullets: ["View your current plan", "Access full invoice history", "Update payment methods"],
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title:    string;
}

/* ── Tour overlay component ──────────────────────────────────── */
function TourOverlay({
  step,
  total,
  tourStep,
  onPrev,
  onNext,
  onFinish,
}: {
  step:      TourStep;
  total:     number;
  tourStep:  number;
  onPrev:    () => void;
  onNext:    () => void;
  onFinish:  () => void;
}) {
  const isLast = tourStep === total - 1;

  return createPortal(
    <>
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(10,21,71,0.45)", backdropFilter: "blur(2px)" }}
      />

      {/* Tour card */}
      <div
        className="fixed z-50 w-[360px]"
        style={{
          bottom: "40px",
          right:  "40px",
          borderRadius: "20px",
          backgroundColor: "white",
          boxShadow: "0 24px 64px rgba(10,21,71,0.22)",
          border: "1px solid rgba(163,128,246,0.18)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(10,21,71,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === tourStep ? "18px" : "6px",
                    height: "6px",
                    backgroundColor: i === tourStep
                      ? "#A380F6"
                      : i < tourStep
                      ? "#02D99D"
                      : "rgba(10,21,71,0.12)",
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#0A1547]/35">
              {tourStep + 1} / {total}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{step.emoji}</span>
            <div>
              <p className="text-base font-black text-[#0A1547]">{step.title}</p>
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "#A380F6" }}
              >
                Dashboard Page
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-[#0A1547]/65 leading-relaxed mb-4">{step.desc}</p>

          <ul className="space-y-2">
            {step.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: "#A380F6" }}
                />
                <span className="text-xs font-semibold text-[#0A1547]/60">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(10,21,71,0.06)" }}
        >
          <button
            onClick={onPrev}
            disabled={tourStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all"
            style={{
              backgroundColor: tourStep === 0 ? "rgba(10,21,71,0.04)" : "rgba(10,21,71,0.07)",
              color: tourStep === 0 ? "rgba(10,21,71,0.2)" : "#0A1547",
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={onFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#02D99D" }}
            >
              <Check className="w-3.5 h-3.5" />
              Done
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-5 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#A380F6" }}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

/* ── Main layout ─────────────────────────────────────────────── */
export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [collapsed, setCollapsed]             = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [tourActive, setTourActive]           = useState(false);
  const [tourStep, setTourStep]               = useState(0);
  const [location, setLocation]               = useLocation();
  const { logout }                            = useAuth();
  const { selectedClient, setSelectedClient } = useClient();
  const dropdownRef                           = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    logout();
    setLocation("/");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setClientDropdownOpen(false);
      }
    };
    if (clientDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clientDropdownOpen]);

  /* Tour controls */
  const startTour = () => {
    setTourStep(0);
    setTourActive(true);
    if (collapsed) setCollapsed(false);
  };
  const nextStep  = () => setTourStep((s) => Math.min(s + 1, TOUR_STEPS.length - 1));
  const prevStep  = () => setTourStep((s) => Math.max(s - 1, 0));
  const endTour   = () => setTourActive(false);

  /* Close tour on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") endTour(); };
    if (tourActive) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tourActive]);

  const sidebarW  = collapsed ? "w-16" : "w-60";
  const contentML = collapsed ? "lg:ml-16" : "lg:ml-60";
  const currentTourNavIndex = tourActive ? TOUR_STEPS[tourStep].navIndex : -1;

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex" style={{ fontFamily: "'Raleway', sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarW}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ overflow: "visible" }}
      >
        {/* Logo / Collapse toggle */}
        <div className={`flex items-center border-b border-gray-100 flex-shrink-0 h-14
          ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>
          {collapsed ? (
            <button
              className="hidden lg:flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl
                         text-[#0A1547]/30 hover:text-[#A380F6] transition-colors group"
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
            >
              <img src="/alpha-symbol.png" alt="αS" className="w-8 h-8 object-contain" />
              <ChevronsRight className="w-3.5 h-3.5 text-[#A380F6]/50 group-hover:text-[#A380F6] transition-colors" />
            </button>
          ) : (
            <>
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <img src="/logo-dark-text.png" alt="alphaSource AI" className="h-8 w-auto" />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  className="hidden lg:flex p-1.5 rounded-lg text-[#0A1547]/25 hover:text-[#0A1547]/60 transition-colors"
                  onClick={() => { setCollapsed(true); setClientDropdownOpen(false); }}
                  title="Collapse sidebar"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  className="lg:hidden p-1.5 rounded-lg text-[#0A1547]/40 hover:text-[#0A1547]"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Client selector */}
        <div
          className={`flex-shrink-0 border-b border-gray-100 relative ${collapsed ? "py-3 flex justify-center" : "px-3 py-3"}`}
          ref={dropdownRef}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              title={selectedClient.name}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: selectedClient.color }}
            >
              {selectedClient.letter}
            </button>
          ) : (
            <button
              onClick={() => setClientDropdownOpen((o) => !o)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group"
              style={{ backgroundColor: clientDropdownOpen ? "rgba(163,128,246,0.1)" : "rgba(163,128,246,0.07)" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                style={{ backgroundColor: selectedClient.color }}
              >
                {selectedClient.letter}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-black text-[#0A1547] truncate leading-tight">{selectedClient.name}</p>
                <p className="text-[10px] text-[#0A1547]/40">Client account</p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#0A1547]/30 flex-shrink-0 transition-transform duration-200 ${clientDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {clientDropdownOpen && !collapsed && (
            <div
              className="absolute left-3 right-3 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 mt-1"
              style={{ top: "100%" }}
            >
              {CLIENTS.map((client) => (
                <button
                  key={client.id}
                  onClick={() => { setSelectedClient(client); setClientDropdownOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.letter}
                  </div>
                  <span className="flex-1 text-xs font-semibold text-[#0A1547] truncate">{client.name}</span>
                  {selectedClient.id === client.id && (
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A380F6" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden
          ${collapsed ? "px-0 flex flex-col items-center" : "px-3"}`}>
          {navItems.map((item, idx) => {
            const active     = isActive(item.href);
            const tourHighlight = idx === currentTourNavIndex;

            if (collapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={item.label}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 ${
                    active ? "text-[#A380F6]" : "text-[#0A1547]/40 hover:text-[#0A1547] hover:bg-gray-50"
                  }`}
                  style={{
                    ...(active ? { backgroundColor: "rgba(163,128,246,0.1)" } : {}),
                    ...(tourHighlight ? {
                      backgroundColor: "rgba(163,128,246,0.15)",
                      boxShadow: "0 0 0 2px #A380F6",
                    } : {}),
                  }}
                >
                  <item.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active ? "text-[#A380F6]" : "text-[#0A1547]/50 hover:text-[#0A1547] hover:bg-gray-50"
                }`}
                style={{
                  ...(active ? { backgroundColor: "rgba(163,128,246,0.1)" } : {}),
                  ...(tourHighlight ? {
                    backgroundColor: "rgba(163,128,246,0.12)",
                    color: "#A380F6",
                    boxShadow: "0 0 0 2px #A380F6",
                    fontWeight: 800,
                  } : {}),
                }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className={`border-t border-gray-100 flex-shrink-0 ${collapsed ? "py-3 flex justify-center" : "px-3 py-3"}`}>
          {collapsed ? (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#0A1547]/35 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-[#0A1547]/40 hover:text-[#0A1547] hover:bg-gray-50 transition-all duration-150"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${contentML}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-5">
          <button
            className="lg:hidden mr-3 p-1.5 rounded-lg text-[#0A1547]/50 hover:text-[#0A1547] hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <span className="text-sm font-bold text-[#0A1547]">{title}</span>
          </div>

          {/* Take a Tour button */}
          <button
            onClick={startTour}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: tourActive ? "#A380F6" : "rgba(163,128,246,0.10)",
              color: tourActive ? "white" : "#A380F6",
              border: "1px solid rgba(163,128,246,0.25)",
            }}
          >
            <Map className="w-3.5 h-3.5" />
            Take a Tour
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── Tour overlay ─────────────────────────────────────── */}
      {tourActive && (
        <TourOverlay
          step={TOUR_STEPS[tourStep]}
          total={TOUR_STEPS.length}
          tourStep={tourStep}
          onPrev={prevStep}
          onNext={nextStep}
          onFinish={endTour}
        />
      )}
    </div>
  );
}
