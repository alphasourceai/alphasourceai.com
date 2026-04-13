import { useState, useRef, useEffect, ReactNode } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useClient, CLIENTS } from "@/context/ClientContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Overview",   href: "/dashboard",            icon: LayoutDashboard },
  { label: "Roles",      href: "/dashboard/roles",       icon: Briefcase },
  { label: "Candidates", href: "/dashboard/candidates",  icon: Users },
  { label: "Members",    href: "/dashboard/members",     icon: UserCheck },
  { label: "Billing",    href: "/dashboard/billing",     icon: CreditCard },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const { selectedClient, setSelectedClient } = useClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const sidebarW = collapsed ? "w-16" : "w-60";
  const contentML = collapsed ? "lg:ml-16" : "lg:ml-60";

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex" style={{ fontFamily: "'Raleway', sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
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
            /* Collapsed: alpha symbol + expand carets stacked */
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
            /* Collapsed: just the avatar, click expands */
            <button
              onClick={() => setCollapsed(false)}
              title={selectedClient.name}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: selectedClient.color }}
            >
              {selectedClient.letter}
            </button>
          ) : (
            /* Expanded: full dropdown trigger */
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

          {/* Dropdown panel */}
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
          {navItems.map((item) => {
            const active = isActive(item.href);
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
                  style={active ? { backgroundColor: "rgba(163,128,246,0.1)" } : {}}
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
                style={active ? { backgroundColor: "rgba(163,128,246,0.1)" } : {}}
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

      {/* ── Main content ──────────────────────────────────────── */}
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
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ backgroundColor: selectedClient.color === "#0A1547" ? "#A380F6" : selectedClient.color }}
            >
              {selectedClient.letter === "∗" ? "A" : selectedClient.letter}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
