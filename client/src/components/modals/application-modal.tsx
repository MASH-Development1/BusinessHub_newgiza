import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import { X } from "lucide-react";
import type { Job, Internship } from "@shared/schema";
import { useCreateJobApplication, useCreateInternshipApplication } from "@/lib/convexApi";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  internship?: Internship | null;
  type: "job" | "internship";
}

export default function ApplicationModal({ 
  isOpen, 
  onClose, 
  job, 
  internship, 
  type 
}: ApplicationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Use the correct Convex mutation hook
  const createJobApp = useCreateJobApplication();
  const createInternshipApp = useCreateInternshipApplication();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicantPhone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please provide your phone number to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV/Resume to continue.",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('applicantName', formData.applicantName);
    submitData.append('applicantEmail', formData.applicantEmail);
    submitData.append('applicantPhone', formData.applicantPhone);
    submitData.append('coverLetter', formData.coverLetter);
    submitData.append('cv', cvFile);
    if (type === "job" && job?.id) {
      submitData.append("jobId", job.id.toString());
      createJobApp.mutate(submitData, {
        onSuccess: () => {
          toast({
            title: "Application Submitted",
            description: "Your application has been sent successfully. We'll review it and get back to you soon.",
          });
          queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
          handleClose();
        },
        onError: (error) => {
          toast({
            title: "Submission Failed",
            description: "There was an error submitting your application. Please try again.",
            variant: "destructive",
          });
          console.error('Application submission error:', error);
        },
      });
    } else if (type === "internship" && internship?.id) {
      submitData.append("internshipId", internship.id.toString());
      createInternshipApp.mutate(submitData, {
        onSuccess: () => {
          toast({
            title: "Application Submitted",
            description: "Your application has been sent successfully. We'll review it and get back to you soon.",
          });
          queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
          handleClose();
        },
        onError: (error) => {
          toast({
            title: "Submission Failed",
            description: "There was an error submitting your application. Please try again.",
            variant: "destructive",
          });
          console.error('Application submission error:', error);
        },
      });
    }
  };

  const handleClose = () => {
    setFormData({
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      coverLetter: "",
    });
    setCvFile(null);
    onClose();
  };

  const positionTitle = type === "job" ? job?.title : internship?.title;
  const companyName = type === "job" ? job?.company : internship?.company;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Apply for Position
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {positionTitle && (
            <div className="text-left">
              <p className="text-lg font-semibold text-primary">{positionTitle}</p>
              <p className="text-muted-foreground">{companyName}</p>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                placeholder="Enter your full name"
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                required
                value={formData.applicantEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantEmail: e.target.value }))}
                placeholder="Enter your email address"
                className="bg-muted border-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.applicantPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, applicantPhone: e.target.value }))}
              placeholder="Enter your phone number"
              className="bg-muted border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Letter (Optional)
            </label>
            <Textarea
              rows={4}
              value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Tell us why you're interested in this position..."
              className="bg-muted border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload CV/Resume *
            </label>
            <FileUpload
              onFileSelect={setCvFile}
              selectedFile={cvFile}
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024} // 10MB
              description="PDF, DOC, DOCX up to 10MB"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={createJobApp.isPending || createInternshipApp.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={createJobApp.isPending || createInternshipApp.isPending}
            >
              {createJobApp.isPending || createInternshipApp.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
