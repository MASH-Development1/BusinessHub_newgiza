import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, User, CheckCircle } from "lucide-react";
import { PROFESSIONAL_SECTIONS } from "@shared/sections";
import { useCreateCvShowcase } from "@/lib/convexApi";

export default function CvUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [cvForm, setCvForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    section: "",
    customSection: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    yearsOfExperience: "",
    linkedinUrl: "",
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // CV Upload mutation
  const createCvMutation = useCreateCvShowcase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast({ title: "Error", description: "Please select a CV file", variant: "destructive" });
      return;
    }
    
    // Create form data with all fields and the file
    const formData = new FormData();
    Object.keys(cvForm).forEach(key => {
      if (key === 'section' && cvForm.section === 'Other' && cvForm.customSection) {
        formData.append(key, cvForm.customSection);
      } else if (key !== 'customSection') {
        formData.append(key, cvForm[key as keyof typeof cvForm]);
      }
    });
    
    // Add the CV file
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    // Submit using Convex mutation
    createCvMutation.mutate(formData, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({ title: "Success", description: "Your CV has been uploaded successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to upload CV. Please try again.", variant: "destructive" });
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="page-section">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-card border-border text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">CV Uploaded Successfully!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for submitting your CV to the NewGiza Business Hub community showcase. 
                Your profile will be reviewed and published within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Upload Another CV
                </Button>
                <Button onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Upload Your <span className="text-primary">CV</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your professional profile with the NewGiza community and connect with fellow residents.
          </p>
        </div>

        {/* Upload Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name *"
                    value={cvForm.name}
                    onChange={(e) => setCvForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={cvForm.email}
                    onChange={(e) => setCvForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Phone Number"
                    value={cvForm.phone}
                    onChange={(e) => setCvForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Professional Title *"
                    value={cvForm.title}
                    onChange={(e) => setCvForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <Select value={cvForm.section} onValueChange={(value) => setCvForm(prev => ({ ...prev, section: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Professional Section *" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONAL_SECTIONS.map((section) => (
                      <SelectItem key={section.name} value={section.name}>
                        {section.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other (specify below)</SelectItem>
                  </SelectContent>
                </Select>
                
                {cvForm.section === "Other" && (
                  <Input
                    placeholder="Please specify your professional sector *"
                    value={cvForm.customSection}
                    onChange={(e) => setCvForm(prev => ({ ...prev, customSection: e.target.value }))}
                    required
                  />
                )}
                
                <Textarea
                  placeholder="Professional Bio - Tell us about yourself and your expertise"
                  value={cvForm.bio}
                  onChange={(e) => setCvForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Years of Experience"
                    value={cvForm.yearsOfExperience}
                    onChange={(e) => setCvForm(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  />
                  <Input
                    placeholder="LinkedIn Profile (optional)"
                    value={cvForm.linkedinUrl}
                    onChange={(e) => setCvForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  />
                </div>
                
                <Input
                  placeholder="Key Skills (comma-separated)"
                  value={cvForm.skills}
                  onChange={(e) => setCvForm(prev => ({ ...prev, skills: e.target.value }))}
                />
              </div>

              {/* Experience & Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Background</h3>
                <Textarea
                  placeholder="Work Experience - Brief overview of your professional journey"
                  value={cvForm.experience}
                  onChange={(e) => setCvForm(prev => ({ ...prev, experience: e.target.value }))}
                  rows={4}
                />
                
                <Textarea
                  placeholder="Education - Your academic background"
                  value={cvForm.education}
                  onChange={(e) => setCvForm(prev => ({ ...prev, education: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">CV Upload</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <label className="block text-sm font-medium mb-2">
                      Upload your CV (PDF or Word document) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                      required
                    />
                    {cvFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {cvFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full text-lg py-6" 
                  disabled={createCvMutation.isPending}
                >
                  {createCvMutation.isPending ? "Uploading..." : "Upload CV to Showcase"}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  * Required fields. Your CV will be reviewed before being published to the community showcase.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}