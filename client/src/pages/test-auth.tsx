import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function TestAuth() {
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin, logout, sessionId } = useAuth();
  const [testEmail, setTestEmail] = useState("test@newgiza.com");
  const [testName, setTestName] = useState("Test User");

  // Convex mutations
  const addTestEmailToWhitelist = useMutation(api.auth.addTestEmailToWhitelist);
  const createUser = useMutation(api.auth.createUser);
  const createAdminUser = useMutation(api.auth.createAdminUser);

  const handleAddToWhitelist = async () => {
    try {
      await addTestEmailToWhitelist({ email: testEmail, name: testName });
      toast({ title: "Success", description: "Email added to whitelist" });
    } catch (error) {
      console.error("Error adding to whitelist:", error);
      toast({ title: "Error", description: "Failed to add email to whitelist", variant: "destructive" });
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser({ email: testEmail, name: testName, role: "user" });
      toast({ title: "Success", description: "User created" });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdminUser({ email: testEmail, name: testName });
      toast({ title: "Success", description: "Admin user created" });
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({ title: "Error", description: "Failed to create admin", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "You have been logged out" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Auth Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Auth Status</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
                  <p><strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}</p>
                  <p><strong>Session ID:</strong> {sessionId || "None"}</p>
                  {user && (
                    <>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                    </>
                  )}
                </div>
                {isAuthenticated && (
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                )}
              </div>

              {/* Test Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Test Controls</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Test Email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Test Name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Button onClick={handleAddToWhitelist} className="w-full">
                    Add Email to Whitelist
                  </Button>
                  <Button onClick={handleCreateUser} className="w-full" variant="outline">
                    Create Test User
                  </Button>
                  <Button onClick={handleCreateAdmin} className="w-full" variant="outline">
                    Create Test Admin
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => window.location.href = "/login"} className="w-full">
            Go to Login
          </Button>
          <Button onClick={() => window.location.href = "/admin-login"} className="w-full" variant="outline">
            Go to Admin Login
          </Button>
          <Button onClick={() => window.location.href = "/"} className="w-full" variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 