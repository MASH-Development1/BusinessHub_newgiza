import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Home, AlertCircle, UserPlus } from "lucide-react";
import HubWithinLogo from "@/components/nghb-logo";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    fullName: "",
    email: "",
    unitNumber: "",
    mobile: "",
  });
  const [, setLocation] = useLocation();

  // Convex mutations
  const loginWithEmail = useMutation(api.auth.loginWithEmail);
  const requestAccess = useMutation(api.accessRequests.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Login with email (checks whitelist)
      const result = await loginWithEmail({ email });
      // Store user session using AuthContext
      const userData = { 
        email: result.user.email, 
        name: result.user.name, 
        role: result.user.role, 
        id: result.user._id 
      };
      login(userData, result.sessionId);
      toast({ title: "Welcome!", description: "Access granted. Redirecting to platform..." });
      if (result.user.role === 'admin') {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ 
        title: "Access Denied", 
        description: error.message || "Unable to authenticate. Please try again or request access.",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.fullName || !requestForm.email || !requestForm.unitNumber) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    try {
      await requestAccess({
        full_name: requestForm.fullName,
        email: requestForm.email,
        unit_number: requestForm.unitNumber,
        mobile: requestForm.mobile || null,
      });
      toast({ 
        title: "Request Submitted", 
        description: "Your access request has been submitted. You'll receive an email once approved." 
      });
      setRequestForm({ fullName: "", email: "", unitNumber: "", mobile: "" });
      setShowRequestForm(false);
    } catch (error) {
      console.error("Request error:", error);
      toast({ 
        title: "Request Failed", 
        description: "Unable to submit request. Please try again.",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <HubWithinLogo size="large" className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Welcome to Hub Within</h1>
          <p className="text-muted-foreground">
            NewGiza Community Access Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card/80 backdrop-blur border-border shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              {showRequestForm ? <UserPlus className="h-6 w-6 text-primary" /> : <Shield className="h-6 w-6 text-primary" />}
            </div>
            <CardTitle>{showRequestForm ? "Request Access" : "Resident Access"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {showRequestForm 
                ? "Fill out the form below to request access to the NewGiza community platform"
                : "Enter your whitelisted email to access the community platform"
              }
            </p>
          </CardHeader>
          <CardContent>
            {!showRequestForm ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your whitelisted email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                    {isLoading ? "Verifying..." : "Access Platform"}
                  </Button>
                </form>

                {/* Request Access Button */}
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRequestForm(true)}
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Request Access
                  </Button>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={requestForm.fullName}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="requestEmail" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="requestEmail"
                        type="email"
                        placeholder="your-email@example.com"
                        value={requestForm.email}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="unitNumber" className="block text-sm font-medium mb-2">
                        NewGiza Unit Number *
                      </label>
                      <Input
                        id="unitNumber"
                        type="text"
                        placeholder="e.g., Building A, Apt 101"
                        value={requestForm.unitNumber}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, unitNumber: e.target.value }))}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                        Mobile Number (Optional)
                      </label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+20 XXX XXX XXXX"
                        value={requestForm.mobile}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, mobile: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1" 
                      onClick={() => setShowRequestForm(false)}
                    >
                      Back to Login
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {!showRequestForm && (
              <>
                {/* Information Panel */}
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-primary mb-1">Restricted Access</p>
                      <p className="text-muted-foreground">
                        This platform is exclusively for verified NewGiza residents. 
                        If you're a resident but can't access the platform, use the request access form above.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Link */}
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLocation("/admin-login")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Community Administrator? Click here
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Hub Within - NewGiza © 2025</p>
          <p className="mt-1">Where Growth Begins, From Within.</p>
        </div>
      </div>
    </div>
  );
}