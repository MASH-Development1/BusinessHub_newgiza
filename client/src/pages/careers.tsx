import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Clock,
  Star,
  Plus,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import ApplicationModal from "@/components/modals/application-modal";
import { useJobs, useCreateJob } from "@/lib/convexApi";
import { useAuth } from "@/contexts/AuthContext";

const jobSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  posterRole: z.string().min(1, "Please select your role in the company"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  skills: z.string().min(3, "Required skills must be specified"),
  salaryRange: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(8, "Please enter a valid phone number"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  industry: z.string().min(1, "Please select industry"),
  jobType: z.string().min(1, "Please select job type"),
});

type JobFormData = z.infer<typeof jobSchema>;

const industries = [
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
  "Other",
];

const roles = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "Vice President",
  "Director",
  "Department Head",
  "Hiring Manager",
  "HR Manager",
  "HR Business Partner",
  "Talent Acquisition",
  "Team Lead",
  "Project Manager",
  "Senior Manager",
  "Manager",
  "Supervisor",
  "Staff Member",
  "Other",
];

export default function Careers() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: jobs = [] } = useJobs();
  const { user: currentUser, sessionId } = useAuth();
  const createJobMutation = useCreateJob(); // Using createJobMutation directly

  // Filter jobs based on industry and search
  const filteredJobs = jobs.filter((job: any) => {
    const matchesIndustry =
      selectedIndustry === "all" || job.industry === selectedIndustry;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch && job.isApproved;
  });

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      posterRole: "",
      location: "",
      description: "",
      requirements: "",
      salaryRange: "",
      contactEmail: currentUser?.email || "",
      contactPhone: "",
      experienceLevel: "",
      industry: "",
      jobType: "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      await createJobMutation.mutateAsync({
        title: data.title,
        company: data.company,
        poster_email: currentUser?.email || data.contactEmail,
        poster_role: data.posterRole,
        description: data.description,
        requirements: data.requirements || undefined,
        skills: data.skills || undefined,
        industry: data.industry || undefined,
        experience_level: data.experienceLevel || undefined,
        job_type: data.jobType || undefined,
        location: data.location || undefined,
        salary_range: data.salaryRange || undefined,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        is_active: true,
        is_approved: false, // User submissions need approval
        status: "pending", // Pending status for user submissions
        sessionId: sessionId || undefined,
      });

      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting has been submitted for admin approval.",
      });
      form.reset();
      setIsPostJobOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Only show approved and active jobs to regular users
  const approvedJobs = Array.isArray(jobs)
    ? jobs.filter((job) => job.isApproved && job.isActive)
    : [];

  return (
    <div className="page-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Career <span className="text-primary">Opportunities</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover exclusive job opportunities within the NewGiza community
          </p>

          <Dialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Submit a job posting for admin approval. Your posting will be
                  reviewed and published once approved.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Software Engineer"
                            {...field}
                          />
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
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="posterRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role in Company *</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            options={roles.map((role) => ({
                              value: role,
                              label: role,
                            }))}
                            placeholder="Select your role"
                            searchPlaceholder="Search roles..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Cairo, Egypt"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 15,000 - 25,000 EGP"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level *</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value}
                              onValueChange={field.onChange}
                              options={[
                                { value: "Entry Level", label: "Entry Level" },
                                { value: "Mid Level", label: "Mid Level" },
                                {
                                  value: "Senior Level",
                                  label: "Senior Level",
                                },
                                { value: "Executive", label: "Executive" },
                              ]}
                              placeholder="Select level"
                              searchPlaceholder="Search experience levels..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value}
                              onValueChange={field.onChange}
                              options={industries.map((industry) => ({
                                value: industry,
                                label: industry,
                              }))}
                              placeholder="Select industry"
                              searchPlaceholder="Search industries..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type *</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value}
                              onValueChange={field.onChange}
                              options={[
                                { value: "Full-time", label: "Full-time" },
                                { value: "Part-time", label: "Part-time" },
                                { value: "Contract", label: "Contract" },
                                { value: "Remote", label: "Remote" },
                              ]}
                              placeholder="Select type"
                              searchPlaceholder="Search job types..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List the required skills, qualifications, and experience..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., JavaScript, React, Node.js, SQL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Email* (Visible to Admins Only)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="recruiter@company.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This email will only be visible to admins for
                          applicant management
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Phone * (Visible to Admins Only)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+20 10 1234 5678"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This phone number will only be visible to admins for
                          applicant management
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPostJobOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createJobMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createJobMutation.isPending
                        ? "Posting..."
                        : "Submit for Approval"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Filter Opportunities</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search by job title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Select
                value={selectedIndustry}
                onValueChange={setSelectedIndustry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredJobs.length} opportunities found
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 text-gray-900 dark:text-white font-bold">
                        {job.title}
                      </CardTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span>
                            {job.location || "Location not specified"}
                          </span>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {job.salaryRange}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span>{job.jobType || "Type not specified"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge
                          variant="default"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                        >
                          {job.experienceLevel ||
                            "Experience level not specified"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                        >
                          {job.industry || "Industry not specified"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                        >
                          {job.jobType || "Job type not specified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                      Job Description
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  {job.requirements && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                        Requirements
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {job.requirements}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {job.skills && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                        Required Skills
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                          {job.skills}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Job Details Summary */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Job Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Position:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Company:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.company}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Experience:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.experienceLevel || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Industry:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.industry || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Posted by:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.posterRole || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Contact:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {job.posterEmail || job.contactEmail}
                        </span>
                      </div>
                      {job.salaryRange && (
                        <div className="col-span-2">
                          <span className="text-gray-700 dark:text-gray-300">
                            Salary Range:
                          </span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {job.salaryRange}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsApplicationOpen(true);
                      }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Apply for this Position
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Jobs Available Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to post a job opportunity for the NewGiza
                community!
              </p>
              <Button
                onClick={() => setIsPostJobOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post the First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationOpen}
        onClose={() => {
          setIsApplicationOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        type="job"
      />
    </div>
  );
}
