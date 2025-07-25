import { ConvexProvider, convex } from "@/lib/convex";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import HubWithinLogo from "@/components/nghb-logo";
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Import pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import AdminComplete from "@/pages/admin-complete";
import TestAuth from "@/pages/test-auth";
import NotFound from "@/pages/not-found";
import Careers from "@/pages/careers";
import Internships from "@/pages/internships";
import Courses from "@/pages/courses";
import Directory from "@/pages/directory";
import CvShowcase from "@/pages/cv-showcase";
import CvUpload from "@/pages/cv-upload";
import SubmitInternship from "@/pages/submit-internship";
import JoinCommunity from "@/pages/join-community";
import CommunityBenefits from "@/pages/community-benefits";

// Protected Route Component
const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/login");
      } else if (requireAdmin && !isAdmin) {
        setLocation("/");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <HubWithinLogo size="large" className="mx-auto mb-6 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <HubWithinLogo size="large" className="mx-auto mb-6 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      <div className="pt-16">
        <Switch>
          {/* Public routes */}
          <Route path="/login">
            <PublicRoute>
              <Login />
            </PublicRoute>
          </Route>
          <Route path="/admin-login">
            <AdminLogin />
          </Route>
          <Route path="/test-auth">
            <TestAuth />
          </Route>
          {/* Protected routes */}
          <Route path="/">
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Route>
          <Route path="/admin">
            <ProtectedRoute requireAdmin>
              <AdminComplete />
            </ProtectedRoute>
          </Route>

          <Route path="/careers">
            <ProtectedRoute>
              <Careers />
            </ProtectedRoute>
          </Route>
          <Route path="/internships">
            <ProtectedRoute>
              <Internships />
            </ProtectedRoute>
          </Route>
          <Route path="/courses">
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          </Route>
          <Route path="/directory">
            <ProtectedRoute>
              <Directory />
            </ProtectedRoute>
          </Route>
          <Route path="/cv-showcase">
            <ProtectedRoute>
              <CvShowcase />
            </ProtectedRoute>
          </Route>
          <Route path="/cv-upload">
            <ProtectedRoute>
              <CvUpload />
            </ProtectedRoute>
          </Route>
          <Route path="/submit-internship">
            <ProtectedRoute>
              <SubmitInternship />
            </ProtectedRoute>
          </Route>
          <Route path="/join-community">
            <ProtectedRoute>
              <JoinCommunity />
            </ProtectedRoute>
          </Route>
          <Route path="/community-benefits">
            <ProtectedRoute>
              <CommunityBenefits />
            </ProtectedRoute>
          </Route>
          {/* Catch all */}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ConvexProvider>
  );
}

export default App;
