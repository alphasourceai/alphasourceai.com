import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ClientProvider } from "@/context/ClientContext";
import { AdminClientProvider } from "@/context/AdminClientContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Public pages */
import HomePage from "@/pages/HomePage";
import AlphaScreenPage from "@/pages/AlphaScreenPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import CandidateTermsPage from "@/pages/CandidateTermsPage";
import InterviewPage from "@/pages/InterviewPage";
import InterviewCviPage from "@/pages/InterviewCviPage";
import AccommodationRequestPage from "@/pages/AccommodationRequestPage";
import TextInterviewPage from "@/pages/TextInterviewPage";
import PwResetPage from "@/pages/PwResetPage";
import MembershipAgreementSignerPage from "@/pages/MembershipAgreementSignerPage";

/* Client dashboard */
import OverviewPage from "@/pages/dashboard/OverviewPage";
import RolesPage from "@/pages/dashboard/RolesPage";
import CandidatesPage from "@/pages/dashboard/CandidatesPage";
import MembersPage from "@/pages/dashboard/MembersPage";
import BillingPage from "@/pages/dashboard/BillingPage";

/* Admin dashboard */
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminClientsPage from "@/pages/admin/AdminClientsPage";
import AdminRolesPage from "@/pages/admin/AdminRolesPage";
import AdminCandidatesPage from "@/pages/admin/AdminCandidatesPage";
import AdminRoleConfigPage from "@/pages/admin/AdminRoleConfigPage";
import AdminMembersPage from "@/pages/admin/AdminMembersPage";
import AdminAccommodationsPage from "@/pages/admin/AdminAccommodationsPage";
import AdminBillingPage from "@/pages/admin/AdminBillingPage";
import AdminAuditLogsPage from "@/pages/admin/AdminAuditLogsPage";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const DASHBOARD_TAB_ROUTE: Record<string, string> = {
  roles: "/dashboard/roles",
  candidates: "/dashboard/candidates",
  members: "/dashboard/members",
  billing: "/dashboard/billing",
};

/* ── Client dashboard guard ─────────────────────────────── */
function DashboardGuard() {
  const { isLoggedIn, clientAuthReady } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (clientAuthReady && !isLoggedIn) setLocation("/");
  }, [clientAuthReady, isLoggedIn, setLocation]);

  useEffect(() => {
    if (!clientAuthReady || !isLoggedIn) return;
    if (location !== "/dashboard") return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search || "");
    const tab = String(params.get("tab") || "").trim().toLowerCase();
    const target = DASHBOARD_TAB_ROUTE[tab];
    if (!target) return;
    const search = window.location.search || "";
    setLocation(`${target}${search}`);
  }, [clientAuthReady, isLoggedIn, location, setLocation]);

  if (!clientAuthReady) return null;

  if (!isLoggedIn) return null;

  if (location === "/dashboard" && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search || "");
    const tab = String(params.get("tab") || "").trim().toLowerCase();
    if (DASHBOARD_TAB_ROUTE[tab]) return null;
  }

  return (
    <ClientProvider>
      <Switch>
        <Route path="/dashboard"            component={OverviewPage} />
        <Route path="/dashboard/roles"      component={RolesPage} />
        <Route path="/dashboard/candidates" component={CandidatesPage} />
        <Route path="/dashboard/members"    component={MembersPage} />
        <Route path="/dashboard/billing"    component={BillingPage} />
        <Route component={NotFound} />
      </Switch>
    </ClientProvider>
  );
}

/* ── Admin dashboard guard ──────────────────────────────── */
function AdminGuard() {
  const { isAdminLoggedIn, adminAuthReady } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (adminAuthReady && !isAdminLoggedIn) setLocation("/");
  }, [adminAuthReady, isAdminLoggedIn, setLocation]);

  if (!adminAuthReady) return null;
  if (!isAdminLoggedIn) return null;

  return (
    <AdminClientProvider>
      <Switch>
        <Route path="/admin"                  component={AdminOverviewPage} />
        <Route path="/admin/clients"          component={AdminClientsPage} />
        <Route path="/admin/roles"            component={AdminRolesPage} />
        <Route path="/admin/candidates"       component={AdminCandidatesPage} />
        <Route path="/admin/role-config"      component={AdminRoleConfigPage} />
        <Route path="/admin/members"          component={AdminMembersPage} />
        <Route path="/admin/accommodations"   component={AdminAccommodationsPage} />
        <Route path="/admin/billing"          component={AdminBillingPage} />
        <Route path="/admin/audit-logs"       component={AdminAuditLogsPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminClientProvider>
  );
}

function InterviewCompletePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center px-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md text-center"
        style={{ border: "1px solid rgba(10,21,71,0.07)", boxShadow: "0 4px 24px rgba(10,21,71,0.08)" }}
      >
        <h1 className="text-xl font-black text-[#0A1547] mb-3">Interview complete</h1>
        <p className="text-sm text-[#0A1547]/65 leading-relaxed">
          Thank you for completing your interview. You may now close this window.
        </p>
      </div>
    </div>
  );
}

function InterviewTokenAlias({ params }: { params?: { role_token?: string } }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const roleToken = String(params?.role_token || "").trim();
    if (!roleToken) {
      setLocation("/interview");
      return;
    }
    setLocation(`/interview/${encodeURIComponent(roleToken)}`);
  }, [params?.role_token, setLocation]);

  return null;
}

/* ── Router ─────────────────────────────────────────────── */
function Router() {
  const [location] = useLocation();
  const isDashboard = location === "/dashboard" || location.startsWith("/dashboard/");
  const isAdmin     = location === "/admin"     || location.startsWith("/admin/");
  const isInterview =
    location === "/interview" ||
    location.startsWith("/interview/") ||
    location === "/interview-access" ||
    location.startsWith("/interview-access/") ||
    location.startsWith("/interview-host/") ||
    location.startsWith("/text-interview/") ||
    location.startsWith("/membership-agreement/sign/") ||
    location === "/pwreset" ||
    location === "/accommodation-request" ||
    location.startsWith("/accommodation-request/") ||
    location === "/interview-cvi" ||
    location === "/interview-complete";

  if (isDashboard) return <DashboardGuard />;
  if (isAdmin)     return <AdminGuard />;
  if (isInterview) return (
    <Switch>
      <Route path="/accommodation-request/:role_token" component={AccommodationRequestPage} />
      <Route path="/accommodation-request" component={AccommodationRequestPage} />
      <Route path="/interview-access/:role_token" component={InterviewTokenAlias} />
      <Route path="/interview-host/:role_token" component={InterviewTokenAlias} />
      <Route path="/text-interview/:token" component={TextInterviewPage} />
      <Route path="/membership-agreement/sign/:token" component={MembershipAgreementSignerPage} />
      <Route path="/interview/terms" component={CandidateTermsPage} />
      <Route path="/pwreset" component={PwResetPage} />
      <Route path="/interview-access" component={InterviewPage} />
      <Route path="/interview-cvi" component={InterviewCviPage} />
      <Route path="/interview-complete" component={InterviewCompletePage} />
      <Route path="/interview/live" component={InterviewCviPage} />
      <Route path="/interview/complete" component={InterviewCompletePage} />
      <Route path="/interview/:role_token" component={InterviewPage} />
      <Route path="/interview" component={InterviewPage} />
    </Switch>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/"            component={HomePage} />
          <Route path="/alphascreen" component={AlphaScreenPage} />
          <Route path="/about"       component={AboutPage} />
          <Route path="/terms"       component={TermsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
