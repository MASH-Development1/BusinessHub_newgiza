import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useJobs,
  useInternships,
  useCourses,
  useApplications,
  useProfiles,
  useCommunityBenefits,
  useStats,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useCreateInternship,
  useUpdateInternship,
  useDeleteInternship,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useCreateCommunityBenefit,
  useUpdateCommunityBenefit,
  useDeleteCommunityBenefit,
  useUpdateApplicationStatus,
  useDeleteCvShowcase,
  useDeleteProfile,
  useWhitelist,
  useAddToWhitelist,
  useRemoveFromWhitelist,
  useAccessRequests,
  useUpdateAccessRequestStatus,
  useRemovedJobs,
  useRemovedInternships,
  useRestoreRemovedJob,
  useRestoreRemovedInternship,
  usePermanentlyDeleteRemovedJob,
  usePermanentlyDeleteRemovedInternship,
} from "@/lib/convexApi";
import {
  Job,
  Internship,
  Course,
  Profile,
  CommunityBenefit,
  Application,
  EmailWhitelist,
  AccessRequest,
} from "@/lib/typeAdapter";
import {
  Users,
  Briefcase,
  GraduationCap,
  BookOpen,
  Upload,
  Mail,
  Check,
  X,
  TrendingUp,
  FileText,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Gift,
  RotateCcw,
  Shield,
  UserCheck,
  User,
  Pencil,
} from "lucide-react";

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

const experienceLevels = [
  { value: "Entry Level", label: "Entry Level" },
  { value: "Mid Level", label: "Mid Level" },
  { value: "Senior Level", label: "Senior Level" },
  { value: "Executive", label: "Executive" },
];

const jobTypes = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

export default function AdminComplete() {
  const { toast } = useToast();
  const { user, sessionId } = useAuth(); // Add sessionId to get current user session

  // Form states
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    posterRole: "",
    description: "",
    requirements: "",
    location: "",
    industry: "",
    experienceLevel: "",
    jobType: "",
    skills: "",
    salaryRange: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [internshipForm, setInternshipForm] = useState({
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
    positions: "",
    contactEmail: "",
    contactPhone: "",
    startDate: "",
    applicationDeadline: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructor: "",
    type: "",
    duration: "",
  });

  const [benefitForm, setBenefitForm] = useState({
    title: "",
    description: "",
    businessName: "",
    location: "",
    discountPercentage: "",
    category: "",
    validUntil: "",
    isActive: true,
    showOnHomepage: false,
  });

  const [whitelistForm, setWhitelistForm] = useState({
    email: "",
    name: "",
    unit: "",
    phone: "",
  });

  // Dialog states for job management
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isJobEditOpen, setIsJobEditOpen] = useState(false);
  const [editJobForm, setEditJobForm] = useState({
    title: "",
    company: "",
    posterRole: "",
    description: "",
    requirements: "",
    location: "",
    industry: "",
    experienceLevel: "",
    jobType: "",
    skills: "",
    salaryRange: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Dialog states for internship management
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [isInternshipDetailsOpen, setIsInternshipDetailsOpen] = useState(false);
  const [isInternshipEditOpen, setIsInternshipEditOpen] = useState(false);
  const [editInternshipForm, setEditInternshipForm] = useState({
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
    positions: "",
    contactEmail: "",
    contactPhone: "",
    startDate: "",
    applicationDeadline: "",
  });

  // Fetch data using Convex hooks
  const { data: stats = {} } = useStats();
  const { data: jobs = [] } = useJobs();
  const { data: internships = [] } = useInternships();
  const { data: courses = [] } = useCourses();
  const { data: applications = [] } = useApplications();
  const { data: profiles = [] } = useProfiles();
  const { data: benefits = [] } = useCommunityBenefits();
  const { data: whitelist = [] } = useWhitelist();
  const { data: accessRequests = [] } = useAccessRequests();
  const { data: removedJobs = [] } = useRemovedJobs();
  const { data: removedInternships = [] } = useRemovedInternships();

  // Mutations
  const createJobMutation = useCreateJob();
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const createInternshipMutation = useCreateInternship();
  const deleteInternshipMutation = useDeleteInternship();
  const updateInternshipMutation = useUpdateInternship();

  const createCourseMutation = useCreateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const updateCourseMutation = useUpdateCourse();

  const createBenefitMutation = useCreateCommunityBenefit();
  const deleteBenefitMutation = useDeleteCommunityBenefit();
  const updateBenefitMutation = useUpdateCommunityBenefit();

  const deleteCvMutation = useDeleteCvShowcase();
  const deleteProfileMutation = useDeleteProfile();
  const updateApplicationStatusMutation = useUpdateApplicationStatus();

  const addToWhitelistMutation = useAddToWhitelist();
  const removeFromWhitelistMutation = useRemoveFromWhitelist();
  const updateAccessRequestStatusMutation = useUpdateAccessRequestStatus();

  // Removed items mutations
  const restoreJobMutation = useRestoreRemovedJob();
  const restoreInternshipMutation = useRestoreRemovedInternship();
  const deleteRemovedJobMutation = usePermanentlyDeleteRemovedJob();
  const deleteRemovedInternshipMutation =
    usePermanentlyDeleteRemovedInternship();

  // Helper functions
  const formatDate = (dateString: string | Date | number | undefined) => {
    if (!dateString) return "N/A";

    let date: Date;
    if (typeof dateString === "string") {
      date = new Date(dateString);
    } else if (typeof dateString === "number") {
      date = new Date(dateString);
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      return "N/A";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Form handlers
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(
      {
        title: jobForm.title,
        company: jobForm.company,
        poster_email: user?.email || "admin@businesshub.com",
        poster_role: jobForm.posterRole,
        description: jobForm.description,
        requirements: jobForm.requirements || undefined,
        skills: jobForm.skills || undefined,
        industry: jobForm.industry || undefined,
        experience_level: jobForm.experienceLevel || undefined,
        job_type: jobForm.jobType || undefined,
        location: jobForm.location || undefined,
        salary_range: jobForm.salaryRange || undefined,
        contact_email: jobForm.contactEmail,
        contact_phone: jobForm.contactPhone,
        is_active: true,
        is_approved: true,
        status: "active",
        sessionId: sessionId || undefined,
      },
      {
        onSuccess: () => {
          setJobForm({
            title: "",
            company: "",
            posterRole: "",
            description: "",
            requirements: "",
            location: "",
            industry: "",
            experienceLevel: "",
            jobType: "",
            skills: "",
            salaryRange: "",
            contactEmail: "",
            contactPhone: "",
          });
          toast({ title: "Success", description: "Job created successfully!" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create job",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInternshipMutation.mutate(
      {
        title: internshipForm.title,
        company: internshipForm.company,
        poster_email: user?.email || "admin@businesshub.com",
        poster_role: internshipForm.posterRole,
        description: internshipForm.description,
        requirements: internshipForm.requirements || undefined,
        skills: internshipForm.skills || undefined,
        department: internshipForm.department || undefined,
        duration: internshipForm.duration,
        is_paid: internshipForm.isPaid,
        stipend: internshipForm.stipend || undefined,
        location: internshipForm.location || undefined,
        positions: internshipForm.positions
          ? parseInt(internshipForm.positions)
          : undefined,
        contact_email: internshipForm.contactEmail,
        contact_phone: internshipForm.contactPhone || undefined,
        start_date: internshipForm.startDate || undefined,
        application_deadline: internshipForm.applicationDeadline || undefined,
        is_active: true,
        is_approved: true,
        status: "approved",
        sessionId: sessionId || undefined,
      },
      {
        onSuccess: () => {
          setInternshipForm({
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
            positions: "",
            contactEmail: "",
            contactPhone: "",
            startDate: "",
            applicationDeadline: "",
          });
          toast({
            title: "Success",
            description: "Internship created successfully!",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create internship",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(
      {
        ...courseForm,
        status: "active",
        isActive: true,
      },
      {
        onSuccess: () => {
          setCourseForm({
            title: "",
            description: "",
            instructor: "",
            type: "",
            duration: "",
          });
          toast({
            title: "Success",
            description: "Course created successfully!",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create course",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBenefitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBenefitMutation.mutate(
      {
        ...benefitForm,
        status: "active",
      },
      {
        onSuccess: () => {
          setBenefitForm({
            title: "",
            description: "",
            businessName: "",
            location: "",
            discountPercentage: "",
            category: "",
            validUntil: "",
            isActive: true,
            showOnHomepage: false,
          });
          toast({
            title: "Success",
            description: "Community benefit created successfully!",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create community benefit",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleWhitelistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToWhitelistMutation.mutate(
      {
        email: whitelistForm.email,
        name: whitelistForm.name || undefined,
        unit: whitelistForm.unit || undefined,
        phone: whitelistForm.phone || undefined,
        addedBy: user?.email || "admin", // Pass current user's email
      },
      {
        onSuccess: () => {
          setWhitelistForm({
            email: "",
            name: "",
            unit: "",
            phone: "",
          });
          toast({
            title: "Success",
            description: "Email added to whitelist successfully!",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add email to whitelist",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleAccessRequestStatusUpdate = (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    updateAccessRequestStatusMutation.mutate(
      {
        id: id as any,
        status,
        adminEmail: user?.email || "admin", // Pass current user's email
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Access request ${status} successfully!`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: `Failed to ${status} access request`,
            variant: "destructive",
          });
        },
      }
    );
  };

  // Removed items handlers
  const handleRestoreJob = (id: string) => {
    restoreJobMutation.mutate(id as any, {
      onSuccess: () =>
        toast({ title: "Success", description: "Job restored successfully!" }),
      onError: () =>
        toast({
          title: "Error",
          description: "Failed to restore job",
          variant: "destructive",
        }),
    });
  };

  const handleRestoreInternship = (id: string) => {
    restoreInternshipMutation.mutate(id as any, {
      onSuccess: () =>
        toast({
          title: "Success",
          description: "Internship restored successfully!",
        }),
      onError: () =>
        toast({
          title: "Error",
          description: "Failed to restore internship",
          variant: "destructive",
        }),
    });
  };

  const handleDeleteRemovedJob = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this job? This action cannot be undone."
      )
    ) {
      deleteRemovedJobMutation.mutate(id as any, {
        onSuccess: () =>
          toast({ title: "Success", description: "Job permanently deleted!" }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to delete job",
            variant: "destructive",
          }),
      });
    }
  };

  const handleDeleteRemovedInternship = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this internship? This action cannot be undone."
      )
    ) {
      deleteRemovedInternshipMutation.mutate(id as any, {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Internship permanently deleted!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to delete internship",
            variant: "destructive",
          }),
      });
    }
  };

  // Job management handlers
  const viewJobDetails = (job: any) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const editJob = (job: any) => {
    setSelectedJob(job);
    setEditJobForm({
      title: job.title || "",
      company: job.company || "",
      posterRole: job.poster_role || "",
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      industry: job.industry || "",
      experienceLevel: job.experience_level || "",
      jobType: job.job_type || "",
      skills: job.skills || "",
      salaryRange: job.salary_range || "",
      contactEmail: job.contactEmail || "",
      contactPhone: job.contactPhone || "",
    });
    setIsJobEditOpen(true);
  };

  const handleEditJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    updateJobMutation.mutate(
      {
        id: selectedJob.id,
        title: editJobForm.title,
        company: editJobForm.company,
        poster_role: editJobForm.posterRole,
        description: editJobForm.description,
        requirements: editJobForm.requirements || undefined,
        location: editJobForm.location || undefined,
        industry: editJobForm.industry || undefined,
        experience_level: editJobForm.experienceLevel || undefined,
        job_type: editJobForm.jobType || undefined,
        skills: editJobForm.skills || undefined,
        salary_range: editJobForm.salaryRange || undefined,
        contact_email: editJobForm.contactEmail,
        contact_phone: editJobForm.contactPhone,
      },
      {
        onSuccess: () => {
          setIsJobEditOpen(false);
          setSelectedJob(null);
          setEditJobForm({
            title: "",
            company: "",
            posterRole: "",
            description: "",
            requirements: "",
            location: "",
            industry: "",
            experienceLevel: "",
            jobType: "",
            skills: "",
            salaryRange: "",
            contactEmail: "",
            contactPhone: "",
          });
          toast({
            title: "Success",
            description: "Job updated successfully!",
          });
        },
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to update job",
            variant: "destructive",
          }),
      }
    );
  };

  const approveJob = (jobId: string) => {
    updateJobMutation.mutate(
      {
        id: jobId as any,
        is_approved: true,
        status: "approved",
      },
      {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Job approved successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to approve job",
            variant: "destructive",
          }),
      }
    );
  };

  const rejectJob = (jobId: string) => {
    updateJobMutation.mutate(
      {
        id: jobId as any,
        is_approved: false,
        status: "rejected",
      },
      {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Job rejected successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to reject job",
            variant: "destructive",
          }),
      }
    );
  };

  const deleteJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJobMutation.mutate(jobId as any, {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Job deleted successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to delete job",
            variant: "destructive",
          }),
      });
    }
  };

  // Internship management handlers
  const viewInternshipDetails = (internship: any) => {
    setSelectedInternship(internship);
    setIsInternshipDetailsOpen(true);
  };

  const editInternship = (internship: any) => {
    setSelectedInternship(internship);
    setEditInternshipForm({
      title: internship.title || "",
      company: internship.company || "",
      posterRole: internship.posterRole || "",
      description: internship.description || "",
      requirements: internship.requirements || "",
      skills: internship.skills || "",
      department: internship.department || "",
      duration: internship.duration || "",
      isPaid: internship.is_paid || false,
      stipend: internship.stipend || "",
      location: internship.location || "",
      positions: internship.positions ? internship.positions.toString() : "",
      contactEmail: internship.contactEmail || "",
      contactPhone: internship.contactPhone || "",
      startDate: internship.startDate || "",
      applicationDeadline: internship.applicationDeadline || "",
    });
    setIsInternshipEditOpen(true);
  };

  const handleEditInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    updateInternshipMutation.mutate(
      {
        id: selectedInternship.id,
        title: editInternshipForm.title,
        company: editInternshipForm.company,
        poster_role: editInternshipForm.posterRole,
        description: editInternshipForm.description,
        requirements: editInternshipForm.requirements || undefined,
        skills: editInternshipForm.skills || undefined,
        department: editInternshipForm.department || undefined,
        duration: editInternshipForm.duration,
        is_paid: editInternshipForm.isPaid,
        stipend: editInternshipForm.stipend || undefined,
        location: editInternshipForm.location || undefined,
        positions: editInternshipForm.positions
          ? parseInt(editInternshipForm.positions)
          : undefined,
        contact_email: editInternshipForm.contactEmail,
        contact_phone: editInternshipForm.contactPhone || undefined,
        start_date: editInternshipForm.startDate || undefined,
        application_deadline:
          editInternshipForm.applicationDeadline || undefined,
      },
      {
        onSuccess: () => {
          setIsInternshipEditOpen(false);
          setSelectedInternship(null);
          setEditInternshipForm({
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
            positions: "",
            contactEmail: "",
            contactPhone: "",
            startDate: "",
            applicationDeadline: "",
          });
          toast({
            title: "Success",
            description: "Internship updated successfully!",
          });
        },
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to update internship",
            variant: "destructive",
          }),
      }
    );
  };

  const approveInternship = (internshipId: string) => {
    updateInternshipMutation.mutate(
      {
        id: internshipId as any,
        is_approved: true,
        status: "approved",
      },
      {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Internship approved successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to approve internship",
            variant: "destructive",
          }),
      }
    );
  };

  const rejectInternship = (internshipId: string) => {
    updateInternshipMutation.mutate(
      {
        id: internshipId as any,
        is_approved: false,
        status: "rejected",
      },
      {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Internship rejected successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to reject internship",
            variant: "destructive",
          }),
      }
    );
  };

  const deleteInternship = (internshipId: string) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      deleteInternshipMutation.mutate(internshipId as any, {
        onSuccess: () =>
          toast({
            title: "Success",
            description: "Internship deleted successfully!",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to delete internship",
            variant: "destructive",
          }),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Whitelisted Users
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {whitelist.length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jobs Posted</p>
                  <p className="text-2xl font-bold text-primary">
                    {jobs.length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Internships</p>
                  <p className="text-2xl font-bold text-primary">
                    {internships.length}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Access Requests
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {accessRequests.length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
            <TabsTrigger value="removed">Removed Items</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Job Form */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Create New Job
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Job Title *
                      </Label>
                      <Input
                        value={jobForm.title}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, title: e.target.value })
                        }
                        placeholder="e.g., Senior Software Engineer"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Company *
                      </Label>
                      <Input
                        value={jobForm.company}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, company: e.target.value })
                        }
                        placeholder="Company name"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Your Role in Company *
                      </Label>
                      <SearchableSelect
                        value={jobForm.posterRole}
                        onValueChange={(value) =>
                          setJobForm({ ...jobForm, posterRole: value })
                        }
                        options={roles.map((role) => ({
                          value: role,
                          label: role,
                        }))}
                        placeholder="Select your role"
                        searchPlaceholder="Search roles..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Job Description *
                      </Label>
                      <Textarea
                        value={jobForm.description}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Requirements (Optional)
                      </Label>
                      <Textarea
                        value={jobForm.requirements}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            requirements: e.target.value,
                          })
                        }
                        placeholder="List the required skills, qualifications, and experience..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Industry (Optional)
                        </Label>
                        <SearchableSelect
                          value={jobForm.industry}
                          onValueChange={(value) =>
                            setJobForm({ ...jobForm, industry: value })
                          }
                          options={industries.map((industry) => ({
                            value: industry,
                            label: industry,
                          }))}
                          placeholder="Select industry"
                          searchPlaceholder="Search industries..."
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Location (Optional)
                        </Label>
                        <Input
                          value={jobForm.location}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, location: e.target.value })
                          }
                          placeholder="e.g., Cairo, Egypt"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Experience Level (Optional)
                        </Label>
                        <SearchableSelect
                          value={jobForm.experienceLevel}
                          onValueChange={(value) =>
                            setJobForm({ ...jobForm, experienceLevel: value })
                          }
                          options={experienceLevels}
                          placeholder="Select level"
                          searchPlaceholder="Search levels..."
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Job Type (Optional)
                        </Label>
                        <SearchableSelect
                          value={jobForm.jobType}
                          onValueChange={(value) =>
                            setJobForm({ ...jobForm, jobType: value })
                          }
                          options={jobTypes}
                          placeholder="Select type"
                          searchPlaceholder="Search types..."
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Required Skills (Optional)
                        </Label>
                        <Input
                          value={jobForm.skills}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, skills: e.target.value })
                          }
                          placeholder="e.g., JavaScript, React, Node.js"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Salary Range (Optional)
                        </Label>
                        <Input
                          value={jobForm.salaryRange}
                          onChange={(e) =>
                            setJobForm({
                              ...jobForm,
                              salaryRange: e.target.value,
                            })
                          }
                          placeholder="e.g., 15,000 - 25,000 EGP"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Contact Email *
                        </Label>
                        <Input
                          type="email"
                          value={jobForm.contactEmail}
                          onChange={(e) =>
                            setJobForm({
                              ...jobForm,
                              contactEmail: e.target.value,
                            })
                          }
                          placeholder="recruiter@company.com"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Contact Phone *
                        </Label>
                        <Input
                          type="tel"
                          value={jobForm.contactPhone}
                          onChange={(e) =>
                            setJobForm({
                              ...jobForm,
                              contactPhone: e.target.value,
                            })
                          }
                          placeholder="+20 10 1234 5678"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={createJobMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {createJobMutation.isPending
                        ? "Creating..."
                        : "Create Job"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Job List */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    All Jobs ({jobs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 h-[840px] overflow-y-auto">
                    {jobs.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No jobs created yet</p>
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div
                          key={job.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {job.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {job.company}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    job.status === "approved"
                                      ? "default"
                                      : job.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className={
                                    job.status === "approved"
                                      ? "bg-green-100 text-green-800 border-green-300"
                                      : job.status === "rejected"
                                        ? "bg-red-100 text-red-800 border-red-300"
                                        : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  }
                                >
                                  {job.status === "approved"
                                    ? "Approved"
                                    : job.status === "rejected"
                                      ? "Rejected"
                                      : "Pending"}
                                </Badge>
                                {job.industry && (
                                  <Badge
                                    variant="outline"
                                    className="text-blue-700 border-blue-300 bg-blue-50"
                                  >
                                    {job.industry}
                                  </Badge>
                                )}
                                {job.location && (
                                  <Badge
                                    variant="outline"
                                    className="text-purple-700 border-purple-300 bg-purple-50"
                                  >
                                    {job.location}
                                  </Badge>
                                )}
                                {job.salaryRange && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300 bg-green-50"
                                  >
                                    {job.salaryRange}
                                  </Badge>
                                )}
                              </div>
                              {job.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {job.description.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 ml-4 min-w-fit">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => viewJobDetails(job)}
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-white"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {job.status === "approved" && (
                                  <Button
                                    onClick={() => editJob(job)}
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  onClick={() => deleteJob(job.id)}
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {job.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => editJob(job)}
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => approveJob(job.id)}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => rejectJob(job.id)}
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Internship Form */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Create New Internship
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleInternshipSubmit} className="space-y-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Internship Title *
                      </Label>
                      <Input
                        value={internshipForm.title}
                        onChange={(e) =>
                          setInternshipForm({
                            ...internshipForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Software Development Intern"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Company *
                      </Label>
                      <Input
                        value={internshipForm.company}
                        onChange={(e) =>
                          setInternshipForm({
                            ...internshipForm,
                            company: e.target.value,
                          })
                        }
                        placeholder="Company name"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Your Role in Company *
                      </Label>
                      <SearchableSelect
                        value={internshipForm.posterRole}
                        onValueChange={(value) =>
                          setInternshipForm({
                            ...internshipForm,
                            posterRole: value,
                          })
                        }
                        options={roles.map((role) => ({
                          value: role,
                          label: role,
                        }))}
                        placeholder="Select your role"
                        searchPlaceholder="Search roles..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Internship Description *
                      </Label>
                      <Textarea
                        value={internshipForm.description}
                        onChange={(e) =>
                          setInternshipForm({
                            ...internshipForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Requirements (Optional)
                      </Label>
                      <Textarea
                        value={internshipForm.requirements}
                        onChange={(e) =>
                          setInternshipForm({
                            ...internshipForm,
                            requirements: e.target.value,
                          })
                        }
                        placeholder="Education level, skills, experience required..."
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Department/Industry (Optional)
                        </Label>
                        <Input
                          value={internshipForm.department}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              department: e.target.value,
                            })
                          }
                          placeholder="e.g., Engineering, Marketing"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Location (Optional)
                        </Label>
                        <Input
                          value={internshipForm.location}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              location: e.target.value,
                            })
                          }
                          placeholder="e.g., Cairo, Egypt or Remote"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Duration *
                        </Label>
                        <Input
                          value={internshipForm.duration}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              duration: e.target.value,
                            })
                          }
                          placeholder="e.g., 3 months, Summer 2025"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Number of Positions (Optional)
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={internshipForm.positions}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              positions: e.target.value,
                            })
                          }
                          placeholder="e.g., 2"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Required Skills (Optional)
                        </Label>
                        <Input
                          value={internshipForm.skills}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              skills: e.target.value,
                            })
                          }
                          placeholder="e.g., JavaScript, React, Node.js"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Start Date (Optional)
                        </Label>
                        <Input
                          value={internshipForm.startDate}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              startDate: e.target.value,
                            })
                          }
                          placeholder="e.g., January 2025, Immediate"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={internshipForm.isPaid}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              isPaid: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <Label className="text-gray-700 dark:text-gray-300">
                          This is a paid internship
                        </Label>
                      </div>
                      {internshipForm.isPaid && (
                        <div>
                          <Label className="text-gray-700 dark:text-gray-300">
                            Stipend Amount (Optional)
                          </Label>
                          <Input
                            value={internshipForm.stipend}
                            onChange={(e) =>
                              setInternshipForm({
                                ...internshipForm,
                                stipend: e.target.value,
                              })
                            }
                            placeholder="e.g., 3,000 EGP/month"
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Contact Email *
                        </Label>
                        <Input
                          type="email"
                          value={internshipForm.contactEmail}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              contactEmail: e.target.value,
                            })
                          }
                          placeholder="hr@company.com"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">
                          Contact Phone
                        </Label>
                        <Input
                          type="tel"
                          value={internshipForm.contactPhone}
                          onChange={(e) =>
                            setInternshipForm({
                              ...internshipForm,
                              contactPhone: e.target.value,
                            })
                          }
                          placeholder="+20 10 1234 5678"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={createInternshipMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {createInternshipMutation.isPending
                        ? "Creating..."
                        : "Create Internship"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Internship List */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    All Internships ({internships.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 h-[840px] overflow-y-auto">
                    {internships.length === 0 ? (
                      <div className="text-center py-8">
                        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No internships created yet
                        </p>
                      </div>
                    ) : (
                      internships.map((internship) => (
                        <div
                          key={internship.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {internship.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {internship.company}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    internship.status === "approved"
                                      ? "default"
                                      : internship.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className={
                                    internship.status === "approved"
                                      ? "bg-green-100 text-green-800 border-green-300"
                                      : internship.status === "rejected"
                                        ? "bg-red-100 text-red-800 border-red-300"
                                        : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  }
                                >
                                  {internship.status === "approved"
                                    ? "Approved"
                                    : internship.status === "rejected"
                                      ? "Rejected"
                                      : "Pending"}
                                </Badge>
                                {internship.department && (
                                  <Badge
                                    variant="outline"
                                    className="text-blue-700 border-blue-300 bg-blue-50"
                                  >
                                    {internship.department}
                                  </Badge>
                                )}
                                {internship.location && (
                                  <Badge
                                    variant="outline"
                                    className="text-purple-700 border-purple-300 bg-purple-50"
                                  >
                                    {internship.location}
                                  </Badge>
                                )}
                                {internship.duration && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300 bg-green-50"
                                  >
                                    {internship.duration}
                                  </Badge>
                                )}
                                {internship.isPaid && (
                                  <Badge
                                    variant="outline"
                                    className="text-orange-700 border-orange-300 bg-orange-50"
                                  >
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              {internship.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {internship.description.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 ml-4 min-w-fit">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    viewInternshipDetails(internship)
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-white"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {internship.status === "approved" && (
                                  <Button
                                    onClick={() => editInternship(internship)}
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  onClick={() =>
                                    deleteInternship(internship.id)
                                  }
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {internship.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => editInternship(internship)}
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      approveInternship(internship.id)
                                    }
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      rejectInternship(internship.id)
                                    }
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Manage Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Course</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCourseSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="course-title">Title</Label>
                        <Input
                          id="course-title"
                          value={courseForm.title}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-description">Description</Label>
                        <Textarea
                          id="course-description"
                          value={courseForm.description}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="course-instructor">Instructor</Label>
                          <Input
                            id="course-instructor"
                            value={courseForm.instructor}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                instructor: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="course-type">Type</Label>
                          <Input
                            id="course-type"
                            value={courseForm.type}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                type: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="course-duration">Duration</Label>
                        <Input
                          id="course-duration"
                          value={courseForm.duration}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              duration: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={createCourseMutation.isPending}
                      >
                        {createCourseMutation.isPending
                          ? "Creating..."
                          : "Create Course"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.instructor}
                            </p>
                            <p className="text-sm">{course.type}</p>
                            <Badge
                              variant={
                                course.isActive ? "default" : "secondary"
                              }
                            >
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deleteCourseMutation.mutate(course.id, {
                                  onSuccess: () =>
                                    toast({
                                      title: "Success",
                                      description:
                                        "Course deleted successfully!",
                                    }),
                                  onError: () =>
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete course",
                                      variant: "destructive",
                                    }),
                                })
                              }
                              disabled={deleteCourseMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Manage Community Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Benefit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Community Benefit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBenefitSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="benefit-title">Title</Label>
                        <Input
                          id="benefit-title"
                          value={benefitForm.title}
                          onChange={(e) =>
                            setBenefitForm({
                              ...benefitForm,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="benefit-description">Description</Label>
                        <Textarea
                          id="benefit-description"
                          value={benefitForm.description}
                          onChange={(e) =>
                            setBenefitForm({
                              ...benefitForm,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="benefit-business">
                            Business Name
                          </Label>
                          <Input
                            id="benefit-business"
                            value={benefitForm.businessName}
                            onChange={(e) =>
                              setBenefitForm({
                                ...benefitForm,
                                businessName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="benefit-location">Location</Label>
                          <Input
                            id="benefit-location"
                            value={benefitForm.location}
                            onChange={(e) =>
                              setBenefitForm({
                                ...benefitForm,
                                location: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="benefit-discount">
                            Discount Percentage
                          </Label>
                          <Input
                            id="benefit-discount"
                            value={benefitForm.discountPercentage}
                            onChange={(e) =>
                              setBenefitForm({
                                ...benefitForm,
                                discountPercentage: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="benefit-category">Category</Label>
                          <Input
                            id="benefit-category"
                            value={benefitForm.category}
                            onChange={(e) =>
                              setBenefitForm({
                                ...benefitForm,
                                category: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="benefit-valid-until">Valid Until</Label>
                        <Input
                          id="benefit-valid-until"
                          type="date"
                          value={benefitForm.validUntil}
                          onChange={(e) =>
                            setBenefitForm({
                              ...benefitForm,
                              validUntil: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={createBenefitMutation.isPending}
                      >
                        {createBenefitMutation.isPending
                          ? "Creating..."
                          : "Create Benefit"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <Card key={benefit.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {benefit.businessName}
                            </p>
                            <p className="text-sm">{benefit.location}</p>
                            <Badge
                              variant={
                                benefit.isActive ? "default" : "secondary"
                              }
                            >
                              {benefit.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deleteBenefitMutation.mutate(benefit.id, {
                                  onSuccess: () =>
                                    toast({
                                      title: "Success",
                                      description:
                                        "Benefit deleted successfully!",
                                    }),
                                  onError: () =>
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete benefit",
                                      variant: "destructive",
                                    }),
                                })
                              }
                              disabled={deleteBenefitMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Manage Email Whitelist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Email to Whitelist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Email to Whitelist</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleWhitelistSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="whitelist-email">Email</Label>
                        <Input
                          id="whitelist-email"
                          type="email"
                          value={whitelistForm.email}
                          onChange={(e) =>
                            setWhitelistForm({
                              ...whitelistForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="whitelist-name">Name (Optional)</Label>
                        <Input
                          id="whitelist-name"
                          value={whitelistForm.name}
                          onChange={(e) =>
                            setWhitelistForm({
                              ...whitelistForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="whitelist-unit">
                            Unit (Optional)
                          </Label>
                          <Input
                            id="whitelist-unit"
                            value={whitelistForm.unit}
                            onChange={(e) =>
                              setWhitelistForm({
                                ...whitelistForm,
                                unit: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="whitelist-phone">
                            Phone (Optional)
                          </Label>
                          <Input
                            id="whitelist-phone"
                            value={whitelistForm.phone}
                            onChange={(e) =>
                              setWhitelistForm({
                                ...whitelistForm,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={addToWhitelistMutation.isPending}
                      >
                        {addToWhitelistMutation.isPending
                          ? "Adding..."
                          : "Add to Whitelist"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {whitelist.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.email}</h3>
                            {item.name && (
                              <p className="text-sm text-muted-foreground">
                                {item.name}
                              </p>
                            )}
                            {item.unit && (
                              <p className="text-sm">{item.unit}</p>
                            )}
                            <Badge
                              variant={item.isActive ? "default" : "secondary"}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeFromWhitelistMutation.mutate(item.id, {
                                  onSuccess: () =>
                                    toast({
                                      title: "Success",
                                      description:
                                        "Email removed from whitelist successfully!",
                                    }),
                                  onError: () =>
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to remove email from whitelist",
                                      variant: "destructive",
                                    }),
                                })
                              }
                              disabled={removeFromWhitelistMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Manage Access Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {request.fullName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {request.email}
                            </p>
                            <p className="text-sm">
                              Unit: {request.unitNumber}
                            </p>
                            {request.mobile && (
                              <p className="text-sm">
                                Mobile: {request.mobile}
                              </p>
                            )}
                            <Badge variant={getStatusBadge(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {request.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAccessRequestStatusUpdate(
                                      request.id.toString(),
                                      "approved"
                                    )
                                  }
                                  disabled={
                                    updateAccessRequestStatusMutation.isPending
                                  }
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAccessRequestStatusUpdate(
                                      request.id.toString(),
                                      "rejected"
                                    )
                                  }
                                  disabled={
                                    updateAccessRequestStatusMutation.isPending
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Removed Items Tab */}
          <TabsContent value="removed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Manage Removed Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="removed-jobs" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="removed-jobs">
                      Removed Jobs ({removedJobs?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="removed-internships">
                      Removed Internships ({removedInternships?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="removed-jobs" className="space-y-4">
                    {removedJobs?.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>No removed jobs found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {removedJobs?.map((job) => (
                          <Card
                            key={job._id}
                            className="border-l-4 border-l-red-500"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {job.company}
                                  </p>
                                  <p className="text-sm">
                                    {job.location || "Remote"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">
                                      {job.job_type || "Full-time"}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {job.experience_level || "Any"}
                                    </Badge>
                                    {job.salary_range && (
                                      <Badge variant="outline">
                                        {job.salary_range}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {job.description}
                                  </p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    <div>Posted by: {job.poster_email}</div>
                                    <div>
                                      Removed at:{" "}
                                      {new Date(
                                        job.removed_at || ""
                                      ).toLocaleDateString()}
                                    </div>
                                    {job.removal_reason && (
                                      <div>Reason: {job.removal_reason}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestoreJob(job._id)}
                                    disabled={restoreJobMutation.isPending}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Restore
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteRemovedJob(job._id)
                                    }
                                    disabled={
                                      deleteRemovedJobMutation.isPending
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="removed-internships"
                    className="space-y-4"
                  >
                    {removedInternships?.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>No removed internships found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {removedInternships?.map((internship) => (
                          <Card
                            key={internship._id}
                            className="border-l-4 border-l-red-500"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">
                                    {internship.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {internship.company}
                                  </p>
                                  <p className="text-sm">
                                    {internship.location || "Remote"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">
                                      {internship.duration}
                                    </Badge>
                                    <Badge
                                      variant={
                                        internship.is_paid
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {internship.is_paid ? "Paid" : "Unpaid"}
                                    </Badge>
                                    {internship.stipend && (
                                      <Badge variant="outline">
                                        {internship.stipend}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {internship.description}
                                  </p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    <div>
                                      Posted by: {internship.poster_email}
                                    </div>
                                    <div>
                                      Removed at:{" "}
                                      {new Date(
                                        internship.removed_at || ""
                                      ).toLocaleDateString()}
                                    </div>
                                    {internship.removal_reason && (
                                      <div>
                                        Reason: {internship.removal_reason}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleRestoreInternship(internship._id)
                                    }
                                    disabled={
                                      restoreInternshipMutation.isPending
                                    }
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Restore
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteRemovedInternship(
                                        internship._id
                                      )
                                    }
                                    disabled={
                                      deleteRemovedInternshipMutation.isPending
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Instructions:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • <strong>Restore:</strong> Move the item back to the
                      active jobs/internships list
                    </li>
                    <li>
                      • <strong>Delete:</strong> Permanently remove the item
                      from the database (cannot be undone)
                    </li>
                    <li>
                      • Items are automatically moved here when they are removed
                      from the main listings
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Job Details Dialog */}
        <Dialog open={isJobDetailsOpen} onOpenChange={setIsJobDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Job Review: {selectedJob?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Job Information */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Job Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Job Title
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedJob.title}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedJob.company}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Industry
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedJob.industry || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Job Type
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedJob.job_type || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Experience Level
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedJob.experience_level || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedJob.location || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Salary Range
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedJob.salary_range || "Not disclosed"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </span>
                          <Badge
                            variant={
                              selectedJob.status === "approved"
                                ? "default"
                                : selectedJob.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              selectedJob.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : selectedJob.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }
                          >
                            {selectedJob.status === "approved"
                              ? "Approved"
                              : selectedJob.status === "rejected"
                                ? "Rejected"
                                : "Pending"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Job Description
                        </span>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {selectedJob.description}
                          </p>
                        </div>
                      </div>

                      {selectedJob.requirements && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requirements
                          </span>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {selectedJob.requirements}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedJob.skills && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Required Skills
                          </span>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {selectedJob.skills}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contact Email
                          </span>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">
                            {selectedJob.contactEmail}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contact Phone
                          </span>
                          <p className="text-gray-900 dark:text-white text-sm">
                            {selectedJob.contactPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Job Poster Information & Timeline */}
                <div className="space-y-6">
                  {/* Job Poster Information Card */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Job Poster Information
                      </h3>
                    </div>

                    {selectedJob.posterEmail ? (
                      <div className="space-y-3">
                        <div>
                          <span className="block text-xs text-blue-700 dark:text-blue-300">
                            Posted by:
                          </span>
                          <p className="text-blue-900 dark:text-blue-100 text-sm font-medium">
                            {selectedJob.posterEmail}
                          </p>
                        </div>
                        <div>
                          <span className="block text-xs text-blue-700 dark:text-blue-300">
                            Role:
                          </span>
                          <p className="text-blue-900 dark:text-blue-100 text-sm">
                            {selectedJob.posterRole}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          No poster information available
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs">
                          Job created by admin
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                        Timeline
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs text-green-700 dark:text-green-300">
                          Posted Date:
                        </span>
                        <p className="text-green-900 dark:text-green-100 text-sm font-medium">
                          {formatDate(selectedJob.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="block text-xs text-green-700 dark:text-green-300">
                          Last Updated:
                        </span>
                        <p className="text-green-900 dark:text-green-100 text-sm font-medium">
                          {formatDate(selectedJob.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedJob.status === "pending" && (
                      <Button
                        onClick={() => {
                          approveJob(selectedJob.id);
                          setIsJobDetailsOpen(false);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Approve Job
                      </Button>
                    )}
                    {selectedJob.status === "pending" && (
                      <Button
                        onClick={() => {
                          rejectJob(selectedJob.id);
                          setIsJobDetailsOpen(false);
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Job
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteJob(selectedJob.id);
                        setIsJobDetailsOpen(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Job
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsJobDetailsOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Job Edit Dialog */}
        <Dialog open={isJobEditOpen} onOpenChange={setIsJobEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditJobSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-job-title" className="mb-3 block">
                  Title *
                </Label>
                <Input
                  id="edit-job-title"
                  value={editJobForm.title}
                  onChange={(e) =>
                    setEditJobForm({ ...editJobForm, title: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-job-company" className="mb-3 block">
                  Company *
                </Label>
                <Input
                  id="edit-job-company"
                  value={editJobForm.company}
                  onChange={(e) =>
                    setEditJobForm({ ...editJobForm, company: e.target.value })
                  }
                  placeholder="Company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-job-poster-role" className="mb-3 block">
                  Your Role in Company *
                </Label>
                <SearchableSelect
                  value={editJobForm.posterRole}
                  onValueChange={(value) =>
                    setEditJobForm({ ...editJobForm, posterRole: value })
                  }
                  options={roles.map((role) => ({
                    value: role,
                    label: role,
                  }))}
                  placeholder="Select your role"
                  searchPlaceholder="Search roles..."
                />
              </div>
              <div>
                <Label htmlFor="edit-job-description" className="mb-3 block">
                  Job Description *
                </Label>
                <Textarea
                  id="edit-job-description"
                  value={editJobForm.description}
                  onChange={(e) =>
                    setEditJobForm({
                      ...editJobForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-job-requirements" className="mb-3 block">
                  Requirements (Optional)
                </Label>
                <Textarea
                  id="edit-job-requirements"
                  value={editJobForm.requirements}
                  onChange={(e) =>
                    setEditJobForm({
                      ...editJobForm,
                      requirements: e.target.value,
                    })
                  }
                  placeholder="List the required skills, qualifications, and experience..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-job-location" className="mb-3 block">
                    Location (Optional)
                  </Label>
                  <Input
                    id="edit-job-location"
                    value={editJobForm.location}
                    onChange={(e) =>
                      setEditJobForm({
                        ...editJobForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g., Cairo, Egypt"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-job-salary" className="mb-3 block">
                    Salary Range (Optional)
                  </Label>
                  <Input
                    id="edit-job-salary"
                    value={editJobForm.salaryRange}
                    onChange={(e) =>
                      setEditJobForm({
                        ...editJobForm,
                        salaryRange: e.target.value,
                      })
                    }
                    placeholder="e.g., 15,000 - 25,000 EGP"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-job-experience" className="mb-3 block">
                    Experience Level (Optional)
                  </Label>
                  <SearchableSelect
                    value={editJobForm.experienceLevel}
                    onValueChange={(value) =>
                      setEditJobForm({
                        ...editJobForm,
                        experienceLevel: value,
                      })
                    }
                    options={experienceLevels}
                    placeholder="Select level"
                    searchPlaceholder="Search levels..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-job-industry" className="mb-3 block">
                    Industry (Optional)
                  </Label>
                  <SearchableSelect
                    value={editJobForm.industry}
                    onValueChange={(value) =>
                      setEditJobForm({
                        ...editJobForm,
                        industry: value,
                      })
                    }
                    options={industries.map((industry) => ({
                      value: industry,
                      label: industry,
                    }))}
                    placeholder="Select industry"
                    searchPlaceholder="Search industries..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-job-type" className="mb-3 block">
                    Job Type (Optional)
                  </Label>
                  <SearchableSelect
                    value={editJobForm.jobType}
                    onValueChange={(value) =>
                      setEditJobForm({
                        ...editJobForm,
                        jobType: value,
                      })
                    }
                    options={jobTypes}
                    placeholder="Select type"
                    searchPlaceholder="Search types..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-job-skills" className="mb-3 block">
                  Required Skills (Optional)
                </Label>
                <Input
                  id="edit-job-skills"
                  value={editJobForm.skills}
                  onChange={(e) =>
                    setEditJobForm({ ...editJobForm, skills: e.target.value })
                  }
                  placeholder="e.g., JavaScript, React, Node.js, SQL"
                />
              </div>
              <div>
                <Label htmlFor="edit-job-contact-email" className="mb-3 block">
                  Contact Email *
                </Label>
                <Input
                  id="edit-job-contact-email"
                  type="email"
                  value={editJobForm.contactEmail}
                  onChange={(e) =>
                    setEditJobForm({
                      ...editJobForm,
                      contactEmail: e.target.value,
                    })
                  }
                  placeholder="recruiter@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-job-contact-phone" className="mb-3 block">
                  Contact Phone *
                </Label>
                <Input
                  id="edit-job-contact-phone"
                  type="tel"
                  value={editJobForm.contactPhone}
                  onChange={(e) =>
                    setEditJobForm({
                      ...editJobForm,
                      contactPhone: e.target.value,
                    })
                  }
                  placeholder="+20 10 1234 5678"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={updateJobMutation.isPending}>
                  {updateJobMutation.isPending ? "Updating..." : "Update Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsJobEditOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Internship Details Dialog */}
        <Dialog
          open={isInternshipDetailsOpen}
          onOpenChange={setIsInternshipDetailsOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Internship Review: {selectedInternship?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedInternship && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Internship Information */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Internship Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Internship Title
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedInternship.title}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedInternship.company}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Department
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedInternship.department || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Duration
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedInternship.duration || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedInternship.location || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Number of Positions
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedInternship.positions || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Compensation
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedInternship.is_paid
                              ? selectedInternship.stipend
                                ? `Paid - ${selectedInternship.stipend}`
                                : "Paid"
                              : "Unpaid"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </span>
                          <Badge
                            variant={
                              selectedInternship.status === "approved"
                                ? "default"
                                : selectedInternship.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              selectedInternship.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : selectedInternship.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }
                          >
                            {selectedInternship.status === "approved"
                              ? "Approved"
                              : selectedInternship.status === "rejected"
                                ? "Rejected"
                                : "Pending"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Internship Description
                        </span>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {selectedInternship.description}
                          </p>
                        </div>
                      </div>

                      {selectedInternship.requirements && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requirements
                          </span>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {selectedInternship.requirements}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedInternship.skills && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Required Skills
                          </span>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {selectedInternship.skills}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contact Email
                          </span>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">
                            {selectedInternship.contactEmail || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contact Phone
                          </span>
                          <p className="text-gray-900 dark:text-white text-sm">
                            {selectedInternship.contactPhone || "N/A"}
                          </p>
                        </div>
                      </div>

                      {(selectedInternship.start_date ||
                        selectedInternship.application_deadline) && (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedInternship.start_date && (
                            <div>
                              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Start Date
                              </span>
                              <p className="text-gray-900 dark:text-white text-sm">
                                {selectedInternship.start_date}
                              </p>
                            </div>
                          )}
                          {selectedInternship.application_deadline && (
                            <div>
                              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Application Deadline
                              </span>
                              <p className="text-gray-900 dark:text-white text-sm">
                                {selectedInternship.application_deadline}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Internship Poster Information & Timeline */}
                <div className="space-y-6">
                  {/* Internship Poster Information Card */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Internship Poster Information
                      </h3>
                    </div>

                    {selectedInternship.posterEmail ? (
                      <div className="space-y-3">
                        <div>
                          <span className="block text-xs text-blue-700 dark:text-blue-300">
                            Posted by:
                          </span>
                          <p className="text-blue-900 dark:text-blue-100 text-sm font-medium">
                            {selectedInternship.posterEmail}
                          </p>
                        </div>
                        <div>
                          <span className="block text-xs text-blue-700 dark:text-blue-300">
                            Role:
                          </span>
                          <p className="text-blue-900 dark:text-blue-100 text-sm">
                            {selectedInternship.posterRole || "N/A"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          No poster information available
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs">
                          Internship created by admin
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                        Timeline
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs text-green-700 dark:text-green-300">
                          Posted Date:
                        </span>
                        <p className="text-green-900 dark:text-green-100 text-sm font-medium">
                          {formatDate(selectedInternship.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="block text-xs text-green-700 dark:text-green-300">
                          Last Updated:
                        </span>
                        <p className="text-green-900 dark:text-green-100 text-sm font-medium">
                          {formatDate(selectedInternship.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedInternship.status === "pending" && (
                      <Button
                        onClick={() => {
                          approveInternship(selectedInternship.id);
                          setIsInternshipDetailsOpen(false);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Approve Internship
                      </Button>
                    )}
                    {selectedInternship.status === "pending" && (
                      <Button
                        onClick={() => {
                          rejectInternship(selectedInternship.id);
                          setIsInternshipDetailsOpen(false);
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Internship
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setIsInternshipDetailsOpen(false);
                        editInternship(selectedInternship);
                      }}
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Internship
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteInternship(selectedInternship.id);
                        setIsInternshipDetailsOpen(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Internship
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsInternshipDetailsOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Internship Dialog */}
        <Dialog
          open={isInternshipEditOpen}
          onOpenChange={setIsInternshipEditOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Internship</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditInternshipSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-internship-title" className="mb-3 block">
                  Internship Title *
                </Label>
                <Input
                  id="edit-internship-title"
                  value={editInternshipForm.title}
                  onChange={(e) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Software Development Intern"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-internship-company" className="mb-3 block">
                  Company *
                </Label>
                <Input
                  id="edit-internship-company"
                  value={editInternshipForm.company}
                  onChange={(e) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      company: e.target.value,
                    })
                  }
                  placeholder="Company name"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-internship-poster-role"
                  className="mb-3 block"
                >
                  Your Role in Company *
                </Label>
                <SearchableSelect
                  value={editInternshipForm.posterRole}
                  onValueChange={(value) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      posterRole: value,
                    })
                  }
                  options={roles.map((role) => ({
                    value: role,
                    label: role,
                  }))}
                  placeholder="Select your role"
                  searchPlaceholder="Search roles..."
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-internship-description"
                  className="mb-3 block"
                >
                  Internship Description *
                </Label>
                <Textarea
                  id="edit-internship-description"
                  value={editInternshipForm.description}
                  onChange={(e) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-internship-requirements"
                  className="mb-3 block"
                >
                  Requirements (Optional)
                </Label>
                <Textarea
                  id="edit-internship-requirements"
                  value={editInternshipForm.requirements}
                  onChange={(e) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      requirements: e.target.value,
                    })
                  }
                  placeholder="Education level, skills, experience required..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="edit-internship-department"
                    className="mb-3 block"
                  >
                    Department/Industry
                  </Label>
                  <Input
                    id="edit-internship-department"
                    value={editInternshipForm.department}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        department: e.target.value,
                      })
                    }
                    placeholder="e.g., Engineering, Marketing"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-internship-location"
                    className="mb-3 block"
                  >
                    Location
                  </Label>
                  <Input
                    id="edit-internship-location"
                    value={editInternshipForm.location}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g., Cairo, Egypt or Remote"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="edit-internship-duration"
                    className="mb-3 block"
                  >
                    Duration *
                  </Label>
                  <Input
                    id="edit-internship-duration"
                    value={editInternshipForm.duration}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        duration: e.target.value,
                      })
                    }
                    placeholder="e.g., 3 months, Summer 2025"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-internship-positions"
                    className="mb-3 block"
                  >
                    Number of Positions
                  </Label>
                  <Input
                    id="edit-internship-positions"
                    type="number"
                    min="1"
                    value={editInternshipForm.positions}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        positions: e.target.value,
                      })
                    }
                    placeholder="e.g., 2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-internship-skills" className="mb-3 block">
                  Required Skills
                </Label>
                <Input
                  id="edit-internship-skills"
                  value={editInternshipForm.skills}
                  onChange={(e) =>
                    setEditInternshipForm({
                      ...editInternshipForm,
                      skills: e.target.value,
                    })
                  }
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editInternshipForm.isPaid}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        isPaid: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label>This is a paid internship</Label>
                </div>
                {editInternshipForm.isPaid && (
                  <div>
                    <Label
                      htmlFor="edit-internship-stipend"
                      className="mb-3 block"
                    >
                      Stipend Amount
                    </Label>
                    <Input
                      id="edit-internship-stipend"
                      value={editInternshipForm.stipend}
                      onChange={(e) =>
                        setEditInternshipForm({
                          ...editInternshipForm,
                          stipend: e.target.value,
                        })
                      }
                      placeholder="e.g., 3,000 EGP/month"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="edit-internship-start-date"
                    className="mb-3 block"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="edit-internship-start-date"
                    value={editInternshipForm.startDate}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        startDate: e.target.value,
                      })
                    }
                    placeholder="e.g., January 2025, Immediate"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-internship-deadline"
                    className="mb-3 block"
                  >
                    Application Deadline
                  </Label>
                  <Input
                    id="edit-internship-deadline"
                    value={editInternshipForm.applicationDeadline}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        applicationDeadline: e.target.value,
                      })
                    }
                    placeholder="e.g., December 31, 2024"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="edit-internship-contact-email"
                    className="mb-3 block"
                  >
                    Contact Email *
                  </Label>
                  <Input
                    id="edit-internship-contact-email"
                    type="email"
                    value={editInternshipForm.contactEmail}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        contactEmail: e.target.value,
                      })
                    }
                    placeholder="hr@company.com"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-internship-contact-phone"
                    className="mb-3 block"
                  >
                    Contact Phone
                  </Label>
                  <Input
                    id="edit-internship-contact-phone"
                    type="tel"
                    value={editInternshipForm.contactPhone}
                    onChange={(e) =>
                      setEditInternshipForm({
                        ...editInternshipForm,
                        contactPhone: e.target.value,
                      })
                    }
                    placeholder="+20 10 1234 5678"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateInternshipMutation.isPending}
                >
                  {updateInternshipMutation.isPending
                    ? "Updating..."
                    : "Update Internship"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInternshipEditOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
