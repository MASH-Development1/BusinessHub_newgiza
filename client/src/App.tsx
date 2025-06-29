import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Home from "@/pages/home";
import Careers from "@/pages/careers";
import Internships from "@/pages/internships";
import Courses from "@/pages/courses";
import Directory from "@/pages/directory";
import JoinCommunity from "@/pages/join-community";
import CvShowcase from "@/pages/cv-showcase";
import CvUpload from "@/pages/cv-upload";
import CvLogin from "@/pages/cv-login";
import CommunityBenefits from "@/pages/community-benefits";
import Admin from "@/pages/admin-complete";
import AdminInternships from "@/pages/admin-internships";
import AdminSimpleInternships from "@/pages/admin-simple-internships";
import TestPending from "@/pages/test-pending";
import AdminDisasterRecovery from "@/pages/admin-disaster-recovery";
import SubmitInternship from "@/pages/submit-internship";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin === true;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "pt-16" : ""}>
        <Switch>
          {/* Public routes */}
          <Route path="/admin-login" component={AdminLogin} />
          
          {/* Login first, then redirect to home */}
          {!isAuthenticated ? (
            <Route path="/" component={Login} />
          ) : (
            <Route path="/" component={Home} />
          )}
          <Route path="/login" component={Login} />
          <Route path="/cv-login" component={CvLogin} />
          <Route path="/cv-showcase" component={CvShowcase} />
          
          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/careers" component={Careers} />
              <Route path="/internships" component={Internships} />
              <Route path="/courses" component={Courses} />
              <Route path="/directory" component={Directory} />
              <Route path="/join-community" component={JoinCommunity} />
              <Route path="/cv-upload" component={CvUpload} />
              <Route path="/community-benefits" component={CommunityBenefits} />
              <Route path="/submit-internship" component={SubmitInternship} />
              <Route path="/admin" component={isAdmin ? Admin : AdminLogin} />
              <Route path="/admin/internships" component={isAdmin ? AdminInternships : AdminLogin} />
              <Route path="/admin-internships" component={isAdmin ? AdminSimpleInternships : AdminLogin} />
              <Route path="/test-pending" component={isAdmin ? TestPending : AdminLogin} />
            </>
          ) : null}
          
          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function Router() {
  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
