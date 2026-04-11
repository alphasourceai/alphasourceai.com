import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AlphaScreenPage from "@/pages/AlphaScreenPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import RolesPage from "@/pages/dashboard/RolesPage";
import CandidatesPage from "@/pages/dashboard/CandidatesPage";
import MembersPage from "@/pages/dashboard/MembersPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function DashboardGuard() {
  const { isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      setLocation("/");
    }
  }, [isLoggedIn, setLocation]);

  if (!isLoggedIn) return null;

  return (
    <Switch>
      <Route path="/dashboard" component={OverviewPage} />
      <Route path="/dashboard/roles" component={RolesPage} />
      <Route path="/dashboard/candidates" component={CandidatesPage} />
      <Route path="/dashboard/members" component={MembersPage} />
      <Route path="/dashboard/billing" component={BillingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [location] = useLocation();
  const isDashboard = location === "/dashboard" || location.startsWith("/dashboard/");

  if (isDashboard) {
    return <DashboardGuard />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/alphascreen" component={AlphaScreenPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/terms" component={TermsPage} />
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
