import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function CvLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/cv-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // Invalidate auth cache to refresh user state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

      toast({
        title: "Login Successful",
        description: "You can now edit your CV.",
      });

      // Redirect to CV showcase page
      setLocation("/cv-showcase");
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              CV Owner Login
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your email address to edit your CV
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link href="/cv-showcase">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to CV Showcase
                </Button>
              </Link>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-medium mb-2">How to access your CV:</p>
              <ul className="space-y-1 text-sm">
                <li>• Enter the email address you used when submitting your CV</li>
                <li>• You will be automatically logged in if your CV exists</li>
                <li>• Only you and admins can edit your CV</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}