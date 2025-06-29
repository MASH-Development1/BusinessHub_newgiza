import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield } from "lucide-react";
import HubWithinLogo from "@/components/nghb-logo";

export default function AdminLogin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Admin login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Admin Access Granted", description: "Welcome to the admin dashboard" });
      // Invalidate auth cache to refresh user state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Access Denied", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast({ title: "Error", description: "Please enter both email and password", variant: "destructive" });
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500/5 via-background to-red-500/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <HubWithinLogo size="large" className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            Hub Within - Community Management
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card/80 backdrop-blur border-border shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle>Administrator Access</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your admin credentials to manage the community platform
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = "/login"}
                className="text-muted-foreground hover:text-primary"
              >
                ← Back to Resident Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}