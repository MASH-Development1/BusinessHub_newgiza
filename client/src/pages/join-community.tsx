import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Upload, FileText } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  company: z.string().optional(),
  phone: z.string().optional(),
  areaOfExpertise: z.string().min(1, "Please select an area of expertise"),
  bio: z.string().optional(),
  howCanYouSupport: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const expertiseAreas = [
  "Technology/IT",
  "Marketing", 
  "Finance",
  "Human Resources",
  "Sales",
  "Procurement",
  "Operations",
  "Legal",
  "Healthcare",
  "Education",
  "Engineering",
  "Design",
  "Consulting",
  "Real Estate",
  "Other"
];

export default function JoinCommunity() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      company: "",
      phone: "",
      areaOfExpertise: "",
      bio: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const formData = new FormData();
      
      // Add profile data
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('title', data.title);
      formData.append('company', data.company || '');
      formData.append('phone', data.phone || '');
      formData.append('industry', data.areaOfExpertise);
      formData.append('bio', data.bio || '');
      formData.append('howCanYouSupport', data.howCanYouSupport || '');
      
      // Add CV file if selected
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      console.log("Sending profile data with CV:", {
        name: data.name,
        email: data.email,
        cvFile: cvFile?.name || 'None'
      });

      const response = await fetch("/api/profiles", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create profile");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your profile has been created successfully. Welcome to the NGBH community!",
      });
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to NGBH!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your professional profile has been created successfully. You're now part of the NewGiza professional community.
          </p>
          <div className="space-y-4">
            <Button asChild>
              <a href="/directory">View Professional Directory</a>
            </Button>
            <div>
              <Button variant="outline" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Join Professional <span className="text-primary">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Create your professional profile and connect with fellow NewGiza residents
          </p>
        </div>

        {/* Profile Creation Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Create Your Professional Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Software Engineer, Marketing Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Microsoft, ABC Corporation, Freelance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaOfExpertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area of Expertise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your area of expertise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expertiseAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your background, experience, and what you're passionate about..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="howCanYouSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How can you support the community? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us how you can help fellow residents or contribute to the community..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CV Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cv-upload">CV/Resume (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {cvFile ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{cvFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCvFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <Label
                          htmlFor="cv-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          Click to upload your CV/Resume (PDF, DOC, DOCX)
                        </Label>
                      </div>
                    )}
                    <Input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Creating Profile..." : "Join Professional Community"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}