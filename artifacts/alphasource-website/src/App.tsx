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
import InterviewPage from "@/pages/InterviewPage";

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

/* ── Client dashboard guard ─────────────────────────────── */
function DashboardGuard() {
  const { isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn) setLocation("/");
  }, [isLoggedIn, setLocation]);

  if (!isLoggedIn) return null;

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
  const { isAdminLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdminLoggedIn) setLocation("/");
  }, [isAdminLoggedIn, setLocation]);

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

/* ── Router ─────────────────────────────────────────────── */
function Router() {
  const [location] = useLocation();
  const isDashboard = location === "/dashboard" || location.startsWith("/dashboard/");
  const isAdmin     = location === "/admin"     || location.startsWith("/admin/");
  const isInterview = location === "/interview" || location.startsWith("/interview/");

  if (isDashboard) return <DashboardGuard />;
  if (isAdmin)     return <AdminGuard />;
  if (isInterview) return (
    <Switch>
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
