import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { insertInternshipSchema } from "@shared/schema";
import {
  GraduationCap,
  Building2,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import { useLocation } from "wouter";
import { useCreateInternship } from "@/lib/convexApi";
import { useAuth } from "@/contexts/AuthContext";

export default function SubmitInternship() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, sessionId } = useAuth();
  const createInternshipMutation = useCreateInternship();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    posterRole: "",
    description: "",
    requirements: "",
    skills: "",
    department: "",
    duration: "",
    isPaid: false,
    stipend: "",
    location: "",
    positions: 1,
    contactEmail: user?.email || "",
    contactPhone: "",
    startDate: "",
    applicationDeadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = insertInternshipSchema.parse({
        ...formData,
        positions: Number(formData.positions),
      });

      await createInternshipMutation.mutateAsync({
        title: formData.title,
        company: formData.company,
        poster_email: user?.email || formData.contactEmail,
        poster_role: formData.posterRole,
        description: formData.description,
        requirements: formData.requirements || undefined,
        skills: formData.skills || undefined,
        department: formData.department || undefined,
        duration: formData.duration,
        is_paid: formData.isPaid,
        stipend: formData.stipend || undefined,
        location: formData.location || undefined,
        positions: Number(formData.positions),
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || undefined,
        start_date: formData.startDate || undefined,
        application_deadline: formData.applicationDeadline || undefined,
        is_active: true,
        is_approved: false, // User submissions need approval
        sessionId: sessionId || undefined,
      });

      toast({
        title: "Internship Submitted",
        description:
          "Your internship posting has been submitted for admin approval.",
      });
      navigate("/internships");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error.message || "Failed to submit internship. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Submit Internship Opportunity
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Post an internship opportunity for NewGiza community members
          </p>
        </div>

        {/* Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Internship Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Internship Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Marketing Intern"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="Company name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="posterRole">Your Role *</Label>
                  <Input
                    id="posterRole"
                    value={formData.posterRole}
                    onChange={(e) =>
                      handleInputChange("posterRole", e.target.value)
                    }
                    placeholder="e.g., HR Manager, Team Lead"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Industry (Optional)</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Human Resources">
                        Human Resources
                      </SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Media & Communications">
                        Media & Communications
                      </SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  placeholder="Education level, skills, experience required..."
                />
              </div>

              <div>
                <Label htmlFor="skills">Required Skills (Optional)</Label>
                <Textarea
                  id="skills"
                  rows={2}
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="List key skills needed for this role..."
                />
              </div>

              {/* Internship Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      handleInputChange("duration", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="2 months">2 months</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="positions">
                    Number of Positions (Optional)
                  </Label>
                  <Input
                    id="positions"
                    type="number"
                    min="1"
                    value={formData.positions}
                    onChange={(e) =>
                      handleInputChange(
                        "positions",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Remote, NewGiza, Cairo"
                  />
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPaid", checked)
                    }
                  />
                  <Label htmlFor="isPaid" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    This is a paid internship
                  </Label>
                </div>

                {formData.isPaid && (
                  <div>
                    <Label htmlFor="stipend">Stipend Amount (Optional)</Label>
                    <Input
                      id="stipend"
                      value={formData.stipend}
                      onChange={(e) =>
                        handleInputChange("stipend", e.target.value)
                      }
                      placeholder="e.g., 3000 EGP/month"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    placeholder="e.g., January 2025, Immediate"
                  />
                </div>
                <div>
                  <Label htmlFor="applicationDeadline">
                    Application Deadline (Optional)
                  </Label>
                  <Input
                    id="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      handleInputChange("applicationDeadline", e.target.value)
                    }
                    placeholder="e.g., December 31, 2024"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail">
                    Contact Email* (Visible to Admins Only)
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    placeholder="applications@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">
                    Contact Phone (Optional, Visible to Admins Only)
                  </Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    placeholder="+20 xxx xxx xxxx"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={createInternshipMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createInternshipMutation.isPending
                    ? "Submitting..."
                    : "Submit for Approval"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/internships")}
                >
                  Cancel
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Approval Process
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your internship posting will be reviewed by our admin team
                      before being published. You'll be notified once it's
                      approved and live on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
