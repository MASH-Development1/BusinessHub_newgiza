import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EmailWhitelist } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from "@/lib/dateUtils";
import {
  Trash2,
  Trash,
  Check,
  X,
  Upload,
  Download,
  Eye,
  Plus,
  Users,
  FileText,
  Target,
  BookOpen,
  Mail,
  Settings,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  User,
  Briefcase,
  GraduationCap,
  Edit,
  UserCheck,
  RotateCcw,
  Star,
  UserPlus,
  Save,
  FolderOpen,
  Archive,
  ClipboardList,
  Shield,
  HardDrive,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements?: string;
  skills?: string;
  industry?: string;
  experienceLevel?: string;
  jobType?: string;
  location?: string;
  salaryRange?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  isApproved?: boolean;
  postedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CV {
  id: number;
  name: string;
  email: string;
  section: string;
  experience: string;
  skills?: string;
  cvFileName?: string;
  createdAt?: string;
}

interface Profile {
  id: number;
  name: string;
  email: string;
  company?: string;
  position?: string;
  industry?: string;
  phone?: string;
  linkedIn?: string;
  isVisible?: boolean;
}

interface AccessRequest {
  id: number;
  fullName: string;
  email: string;
  unitNumber: string;
  mobile?: string;
  status: string;
  requestedAt: string;
}

interface CommunityBenefit {
  id: number;
  title: string;
  description: string;
  businessName: string;
  location?: string;
  discountPercentage?: string;
  category?: string;
  validUntil?: string;
  isActive: boolean;
  showOnHomepage: boolean;
}

interface Internship {
  id: number;
  title: string;
  company: string;
  description: string;
  department?: string;
  duration?: string;
  requirements?: string;
  isApproved?: boolean;
  status?: string;
}

interface Course {
  id: number;
  title: string;
  provider: string;
  description: string;
  type?: string;
  duration?: string;
  price?: number;
  isApproved?: boolean;
}

interface Application {
  id: number;
  type: string;
  jobId?: number;
  internshipId?: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  coverLetter?: string;
  cvFileName?: string;
  cvFilePath?: string;
  status: string;
  appliedAt: string;
  jobTitle?: string;
  company?: string;
}

interface RemovedJob {
  id: number;
  originalJobId: number;
  title: string;
  company: string;
  posterEmail: string;
  posterRole: string;
  description: string;
  requirements?: string;
  skills?: string;
  industry?: string;
  experienceLevel?: string;
  jobType?: string;
  location?: string;
  salaryRange?: string;
  contactEmail: string;
  contactPhone: string;
  isActive?: boolean;
  isApproved?: boolean;
  status?: string;
  postedBy?: number;
  originalCreatedAt?: string;
  originalUpdatedAt?: string;
  removedAt: string;
  removedBy?: number;
  removalReason?: string;
}

interface RemovedInternship {
  id: number;
  originalInternshipId: number;
  title: string;
  company: string;
  posterEmail: string;
  posterRole: string;
  description: string;
  requirements?: string;
  skills?: string;
  department?: string;
  duration: string;
  isPaid?: boolean;
  stipend?: string;
  location?: string;
  positions?: number;
  contactEmail: string;
  contactPhone?: string;
  startDate?: string;
  applicationDeadline?: string;
  isActive?: boolean;
  isApproved?: boolean;
  status?: string;
  postedBy?: number;
  originalCreatedAt?: string;
  originalUpdatedAt?: string;
  removedAt: string;
  removedBy?: number;
  removalReason?: string;
}

export default function AdminComplete() {
  // State management
  const [jobs, setJobs] = useState<Job[]>([]);
  const [removedJobs, setRemovedJobs] = useState<RemovedJob[]>([]);
  const [removedInternships, setRemovedInternships] = useState<
    RemovedInternship[]
  >([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [whitelist, setWhitelist] = useState<EmailWhitelist[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [benefits, setBenefits] = useState<CommunityBenefit[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [approvedInternships, setApprovedInternships] = useState<Internship[]>(
    []
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobPoster, setJobPoster] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    skills: "",
    industry: "",
    experienceLevel: "",
    jobType: "",
    location: "",
    salaryRange: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [internshipForm, setInternshipForm] = useState({
    title: "",
    company: "",
    description: "",
    department: "",
    duration: "",
    requirements: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    provider: "",
    description: "",
    type: "",
    duration: "",
    price: "",
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

  const [newEmail, setNewEmail] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(
    null
  );
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    isActive: true,
  });
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);

  // Search states
  const [whitelistSearch, setWhitelistSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [removedJobSearch, setRemovedJobSearch] = useState("");
  const [removedInternshipSearch, setRemovedInternshipSearch] = useState("");
  const [cvSearch, setCvSearch] = useState("");
  const [profileSearch, setProfileSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  // Admin settings states
  const [adminForm, setAdminForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [positionTypeFilter, setPositionTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Controlled search handlers to prevent doubled characters
  const handleWhitelistSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWhitelistSearch(e.target.value);
    },
    []
  );

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const endpoints = [
        { url: "/api/jobs", setter: setJobs },
        { url: "/api/admin/removed-jobs", setter: setRemovedJobs },
        {
          url: "/api/admin/removed-internships",
          setter: setRemovedInternships,
        },
        { url: "/api/cv-showcase", setter: setCvs },
        { url: "/api/profiles", setter: setProfiles },
        { url: "/api/users", setter: setUsers },
        { url: "/api/whitelist", setter: setWhitelist },
        { url: "/api/access-requests", setter: setAccessRequests },
        { url: "/api/admin/community-benefits", setter: setBenefits },
        { url: "/api/admin/internships/pending", setter: setInternships },
        { url: "/api/internships", setter: setApprovedInternships },
        { url: "/api/courses", setter: setCourses },
        { url: "/api/applications", setter: setApplications },
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            credentials: "include",
            headers: { Accept: "application/json" },
          });
          if (response.ok) {
            const data = await response.json();
            endpoint.setter(Array.isArray(data) ? data : []);
          } else {
            endpoint.setter([]);
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint.url}:`, error);
          endpoint.setter([]);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchBackups();
  }, []);

  // Job Management
  const createJob = async () => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job created successfully" });
        setJobForm({
          title: "",
          company: "",
          description: "",
          requirements: "",
          skills: "",
          industry: "",
          experienceLevel: "",
          jobType: "",
          location: "",
          salaryRange: "",
          contactEmail: "",
          contactPhone: "",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    }
  };

  const approveJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job approved" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve job",
        variant: "destructive",
      });
    }
  };

  const editJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      description: job.description || "",
      requirements: job.requirements || "",
      skills: job.skills || "",
      industry: job.industry || "",
      experienceLevel: job.experienceLevel || "",
      jobType: job.jobType || "",
      location: job.location || "",
      salaryRange: job.salaryRange || "",
      contactEmail: job.contactEmail || "",
      contactPhone: job.contactPhone || "",
    });
  };

  const updateJob = async () => {
    if (!editingJob) return;

    try {
      const response = await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(jobForm),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job updated successfully" });
        setEditingJob(null);
        setJobForm({
          title: "",
          company: "",
          description: "",
          requirements: "",
          skills: "",
          industry: "",
          experienceLevel: "",
          jobType: "",
          location: "",
          salaryRange: "",
          contactEmail: "",
          contactPhone: "",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job moved to removed jobs" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  // Removed Jobs Management
  const restoreJob = async (removedJobId: number) => {
    try {
      const response = await fetch(
        `/api/admin/removed-jobs/${removedJobId}/restore`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "Job restored successfully" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore job",
        variant: "destructive",
      });
    }
  };

  const permanentlyDeleteJob = async (removedJobId: number) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/removed-jobs/${removedJobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job permanently deleted" });
        setRemovedJobs((prev) => prev.filter((job) => job.id !== removedJobId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to permanently delete job",
        variant: "destructive",
      });
    }
  };

  // Removed Internships Management
  const restoreInternship = async (removedInternshipId: number) => {
    try {
      const response = await fetch(
        `/api/admin/removed-internships/${removedInternshipId}/restore`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "Internship restored successfully",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore internship",
        variant: "destructive",
      });
    }
  };

  const permanentlyDeleteInternship = async (removedInternshipId: number) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this internship? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/removed-internships/${removedInternshipId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "Internship permanently deleted",
        });
        setRemovedInternships((prev) =>
          prev.filter((internship) => internship.id !== removedInternshipId)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to permanently delete internship",
        variant: "destructive",
      });
    }
  };

  // CV Management
  const deleteCV = async (cvId: number) => {
    try {
      const response = await fetch(`/api/cv-showcase/${cvId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "CV deleted" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete CV",
        variant: "destructive",
      });
    }
  };

  // Profile Management
  const deleteProfile = async (profileId: number) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Profile deleted" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  // User Management - removing duplicate function

  // Backup and Restore Management
  const [backups, setBackups] = useState<any[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const fetchBackups = async () => {
    try {
      const response = await fetch("/api/admin/backups", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
    }
  };

  const createBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await fetch("/api/admin/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Manual backup - ${new Date().toLocaleString()}`,
        }),
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Backup created successfully" });
        fetchBackups();
      } else {
        throw new Error("Backup failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      });
    } finally {
      setBackupLoading(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    if (
      !confirm(
        "Are you sure you want to restore this backup? This will overwrite all current data."
      )
    ) {
      return;
    }

    setRestoreLoading(true);
    try {
      const response = await fetch(`/api/admin/backups/${backupId}/restore`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Backup restored successfully. Refreshing data...",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Restore failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore backup",
        variant: "destructive",
      });
    } finally {
      setRestoreLoading(false);
    }
  };

  // User Management Functions
  const editUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      unit: user.unit || "",
      isActive: user.isActive !== false,
    });
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
        credentials: "include",
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update whitelist instead of users since we're editing whitelist entries
        setWhitelist(
          whitelist.map((u) => (u.id === editingUser.id ? updatedUser : u))
        );
        setEditingUser(null);
        toast({ title: "Success", description: "User updated successfully" });
        // Refresh all data to ensure consistency
        fetchAllData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const removeUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Force fresh data fetch by adding cache-busting timestamp
        const timestamp = Date.now();
        const freshResponse = await fetch(`/api/whitelist?t=${timestamp}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          setUsers(freshData);
        }

        toast({ title: "Success", description: "User deleted successfully" });
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Job Details and Poster Management
  const viewJobDetails = async (job: Job) => {
    setSelectedJob(job);

    // Fetch job poster details if available
    if (job.postedBy) {
      try {
        const response = await fetch(`/api/users/${job.postedBy}`, {
          credentials: "include",
        });
        if (response.ok) {
          const poster = await response.json();
          setJobPoster(poster);
        }
      } catch (error) {
        console.error("Error fetching job poster:", error);
        setJobPoster(null);
      }
    } else {
      setJobPoster(null);
    }
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
    setJobPoster(null);
  };

  // Application Management Functions
  const updateApplicationStatus = async (
    applicationId: number,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        );
        toast({
          title: "Success",
          description: `Application ${status.toLowerCase()}.`,
        });
      } else {
        throw new Error("Failed to update application status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const downloadCV = async (
    filePath: string | undefined,
    fileName: string | undefined
  ) => {
    if (!filePath || !fileName) {
      toast({
        title: "Error",
        description: "CV file information is missing.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Extract the actual filename from the file path
      const actualFilename = filePath.split("/").pop();
      if (!actualFilename) {
        throw new Error("Invalid file path");
      }

      const response = await fetch(
        `/api/cv/download/${encodeURIComponent(actualFilename)}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Use the display name for download
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to download CV");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download CV.",
        variant: "destructive",
      });
    }
  };

  // Whitelist Management
  const addToWhitelist = async () => {
    if (!newEmail) return;
    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Email added to whitelist" });
        setNewEmail("");
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add email",
        variant: "destructive",
      });
    }
  };

  const removeFromWhitelist = async (id: number) => {
    try {
      const response = await fetch(`/api/whitelist/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Email removed from whitelist",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove email",
        variant: "destructive",
      });
    }
  };

  // Access Request Management
  const approveAccess = async (id: number) => {
    try {
      const response = await fetch(`/api/access-requests/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Update state locally instead of full page refresh
        setAccessRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "approved" } : req
          )
        );
        setWhitelist((prev) => {
          const request = accessRequests.find((req) => req.id === id);
          if (request) {
            return [
              ...prev,
              {
                id: Date.now(),
                email: request.email,
                addedAt: new Date().toISOString(),
              },
            ];
          }
          return prev;
        });
        toast({
          title: "Success",
          description: "Access approved and added to whitelist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve access",
        variant: "destructive",
      });
    }
  };

  const rejectAccess = async (id: number) => {
    try {
      const response = await fetch(`/api/access-requests/${id}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Update state locally instead of full page refresh
        setAccessRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "rejected" } : req
          )
        );
        toast({ title: "Success", description: "Access request rejected" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject access",
        variant: "destructive",
      });
    }
  };

  const approveAllPendingRequests = async () => {
    const pendingRequests = accessRequests.filter(
      (req) => req.status === "pending"
    );
    if (pendingRequests.length === 0) {
      toast({
        title: "No Action Needed",
        description: "No pending requests to approve",
      });
      return;
    }

    try {
      const approvalPromises = pendingRequests.map((req) =>
        fetch(`/api/access-requests/${req.id}/approve`, {
          method: "POST",
          credentials: "include",
        })
      );

      const results = await Promise.all(approvalPromises);
      const successCount = results.filter((res) => res.ok).length;

      if (successCount === pendingRequests.length) {
        // Update state locally for all approved requests
        setAccessRequests((prev) =>
          prev.map((req) =>
            req.status === "pending" ? { ...req, status: "approved" } : req
          )
        );
        setWhitelist((prev) => [
          ...prev,
          ...pendingRequests.map((req) => ({
            id: Date.now() + req.id,
            email: req.email,
            addedAt: new Date().toISOString(),
          })),
        ]);
        toast({
          title: "Success",
          description: `All ${successCount} pending requests approved and added to whitelist`,
        });
      } else {
        toast({
          title: "Partial Success",
          description: `${successCount} of ${pendingRequests.length} requests approved`,
          variant: "destructive",
        });
        fetchAllData(); // Refresh data if partial success
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve all requests",
        variant: "destructive",
      });
    }
  };

  // CV-Job Matching
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const findMatchingJobs = async (cvId: number) => {
    try {
      setIsMatching(true);
      const response = await fetch(`/api/admin/cv-job-match/${cvId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const matches = await response.json();
        setMatchingResults(matches);
        toast({
          title: "CV-Job Matches",
          description: `Found ${matches.length} matching jobs`,
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find matches",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  // Internship Management
  const createInternship = async () => {
    try {
      const response = await fetch("/api/internships", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(internshipForm),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Internship created successfully",
        });
        setInternshipForm({
          title: "",
          company: "",
          description: "",
          department: "",
          duration: "",
          requirements: "",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create internship",
        variant: "destructive",
      });
    }
  };

  const updateInternship = async () => {
    if (!editingInternship) return;

    try {
      const response = await fetch(`/api/internships/${editingInternship.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(internshipForm),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Internship updated successfully",
        });
        setInternshipForm({
          title: "",
          company: "",
          description: "",
          department: "",
          duration: "",
          requirements: "",
        });
        setEditingInternship(null);
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update internship",
        variant: "destructive",
      });
    }
  };

  const deleteInternship = async (id: number, isApproved: boolean = false) => {
    try {
      const response = await fetch(`/api/internships/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        // Update local state immediately
        if (isApproved) {
          setApprovedInternships((prev) =>
            prev.filter((internship) => internship.id !== id)
          );
        } else {
          setInternships((prev) =>
            prev.filter((internship) => internship.id !== id)
          );
        }
        toast({
          title: "Success",
          description: "Internship moved to removed internships",
        });
        setTimeout(() => fetchAllData(), 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete internship",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete internship",
        variant: "destructive",
      });
    }
  };

  // Internship Management
  const approveInternship = async (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await fetch(`/api/admin/internships/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Update local state immediately to prevent UI flicker
        setInternships((prev) =>
          prev.map((internship) =>
            internship.id === id
              ? { ...internship, isApproved: true, status: "approved" }
              : internship
          )
        );
        toast({
          title: "Success",
          description: "Internship approved successfully",
        });
        // Fetch fresh data without causing redirect
        setTimeout(() => fetchAllData(), 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to approve internship",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve internship",
        variant: "destructive",
      });
    }
  };

  const rejectInternship = async (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await fetch(`/api/admin/internships/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Update local state immediately
        setInternships((prev) =>
          prev.map((internship) =>
            internship.id === id
              ? { ...internship, status: "rejected" }
              : internship
          )
        );
        toast({
          title: "Success",
          description: "Internship rejected successfully",
        });
        setTimeout(() => fetchAllData(), 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to reject internship",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject internship",
        variant: "destructive",
      });
    }
  };

  const editApprovedInternship = (internship: Internship) => {
    setInternshipForm({
      title: internship.title,
      company: internship.company,
      description: internship.description,
      department: internship.department || "",
      duration: internship.duration || "",
      requirements: internship.requirements || "",
    });
    setEditingInternship(internship);
  };

  // Admin credentials change functionality
  const changeAdminCredentials = async () => {
    // Validation
    if (
      adminForm.newPassword &&
      adminForm.newPassword !== adminForm.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.newPassword && adminForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!adminForm.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }

    if (!adminForm.newEmail && !adminForm.newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new email or password to update",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/change-credentials", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: adminForm.currentPassword,
          newEmail: adminForm.newEmail || undefined,
          newPassword: adminForm.newPassword || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin credentials updated successfully",
        });
        setAdminForm({
          currentPassword: "",
          newEmail: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowAdminSettings(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update credentials",
        variant: "destructive",
      });
    }
  };

  const approveAllPendingInternships = async () => {
    const pendingInternships = internships.filter(
      (internship) => !internship.isApproved && internship.status === "pending"
    );
    if (pendingInternships.length === 0) {
      toast({
        title: "No Action Needed",
        description: "No pending internships to approve",
      });
      return;
    }

    try {
      const approvalPromises = pendingInternships.map((internship) =>
        fetch(`/api/admin/internships/${internship.id}/approve`, {
          method: "POST",
          credentials: "include",
        })
      );

      const results = await Promise.all(approvalPromises);
      const successCount = results.filter((res) => res.ok).length;

      if (successCount === pendingInternships.length) {
        toast({
          title: "Success",
          description: `All ${successCount} pending internships approved successfully`,
        });
        fetchAllData();
      } else {
        toast({
          title: "Partial Success",
          description: `${successCount} of ${pendingInternships.length} internships approved`,
          variant: "destructive",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve internships",
        variant: "destructive",
      });
    }
  };

  // Course Management
  const createCourse = async () => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...courseForm,
          price: courseForm.price ? parseFloat(courseForm.price) : 0,
        }),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Course created successfully" });
        setCourseForm({
          title: "",
          provider: "",
          description: "",
          type: "",
          duration: "",
          price: "",
        });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Course deleted" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  // Benefits Management
  const createBenefit = async () => {
    try {
      const formData = new FormData();
      Object.keys(benefitForm).forEach((key) => {
        formData.append(
          key,
          benefitForm[key as keyof typeof benefitForm] as string
        );
      });
      selectedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await fetch("/api/admin/community-benefits", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Benefit created successfully",
        });
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
        setSelectedImages([]);
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create benefit",
        variant: "destructive",
      });
    }
  };

  const deleteBenefit = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/community-benefits/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast({ title: "Success", description: "Benefit deleted" });
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete benefit",
        variant: "destructive",
      });
    }
  };

  const pendingJobs = jobs.filter(
    (job) => job.status === "pending" || !job.isApproved
  );
  const pendingRequests = accessRequests.filter(
    (req) => req.status === "pending"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
          </h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading admin data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <Button onClick={fetchAllData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">({pendingJobs.length} pending)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">CVs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{cvs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Directory</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Access Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Registered Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{whitelist.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">({applications.filter(app => app.status === 'pending').length} pending)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="flex flex-wrap w-full bg-gray-100 border border-gray-200 p-2 h-auto min-h-[50px] gap-1">
            <TabsTrigger
              value="jobs"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="removed-jobs"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Removed Jobs
            </TabsTrigger>
            <TabsTrigger
              value="internships"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Internships
            </TabsTrigger>
            <TabsTrigger
              value="removed-internships"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Removed Internships
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="cvs"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              CVs
            </TabsTrigger>
            <TabsTrigger
              value="matching"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              CV-Job Match
            </TabsTrigger>
            <TabsTrigger
              value="directory"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Directory
            </TabsTrigger>
            <TabsTrigger
              value="whitelist"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Whitelist
            </TabsTrigger>
            <TabsTrigger
              value="access"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Access
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-sm px-4 py-2 flex-shrink-0 rounded-md font-medium transition-all hover:bg-gray-50"
            >
              Backup
            </TabsTrigger>
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
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">
                      Job Title
                    </Label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, title: e.target.value })
                      }
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">
                      Company
                    </Label>
                    <Input
                      value={jobForm.company}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, company: e.target.value })
                      }
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      value={jobForm.description}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, description: e.target.value })
                      }
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Industry
                      </Label>
                      <Input
                        value={jobForm.industry}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, industry: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Location
                      </Label>
                      <Input
                        value={jobForm.location}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, location: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={createJob}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </Button>
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                                    job.isApproved ? "default" : "secondary"
                                  }
                                  className={
                                    job.isApproved
                                      ? "bg-green-100 text-green-800 border-green-300"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  }
                                >
                                  {job.isApproved ? "Approved" : "Pending"}
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
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => viewJobDetails(job)}
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-white"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!job.isApproved && (
                                <>
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
                                </>
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
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Removed Jobs Tab */}
          <TabsContent value="removed-jobs" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Removed Jobs Management ({removedJobs.length} total)
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Manage jobs that have been removed. You can restore them or
                  permanently delete them.
                </p>
              </CardHeader>
              <CardContent>
                {/* Search for removed jobs */}
                <div className="mb-6">
                  <Label
                    htmlFor="removed-job-search"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Search Removed Jobs
                  </Label>
                  <Input
                    id="removed-job-search"
                    placeholder="Search by title, company, or description..."
                    value={removedJobSearch}
                    onChange={(e) => setRemovedJobSearch(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(() => {
                    const filteredRemovedJobs = removedJobs.filter((job) => {
                      const searchLower = removedJobSearch.toLowerCase();
                      return (
                        !removedJobSearch ||
                        job.title.toLowerCase().includes(searchLower) ||
                        job.company.toLowerCase().includes(searchLower) ||
                        job.description.toLowerCase().includes(searchLower)
                      );
                    });

                    if (filteredRemovedJobs.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">
                            {removedJobSearch
                              ? "No removed jobs match your search"
                              : "No removed jobs found"}
                          </p>
                        </div>
                      );
                    }

                    return filteredRemovedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {job.company}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Removed
                              </span>
                              {job.industry && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  {job.industry}
                                </span>
                              )}
                              {job.location && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {job.location}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <p>
                                Removed:{" "}
                                {new Date(job.removedAt).toLocaleDateString()}
                              </p>
                              {job.removalReason && (
                                <p>Reason: {job.removalReason}</p>
                              )}
                              <p>
                                Originally posted:{" "}
                                {job.originalCreatedAt
                                  ? new Date(
                                      job.originalCreatedAt
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </p>
                            </div>
                            {job.description && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {job.description.substring(0, 150)}...
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => restoreJob(job.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              onClick={() => permanentlyDeleteJob(job.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete Forever
                            </Button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Application Management ({applications.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Application Filters */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-[200px]">
                    <Label
                      htmlFor="application-search"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Search Applications
                    </Label>
                    <Input
                      id="application-search"
                      placeholder="Search by name, email, position..."
                      value={applicationSearch}
                      onChange={(e) => setApplicationSearch(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="min-w-[150px]">
                    <Label
                      htmlFor="position-type-filter"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Position Type
                    </Label>
                    <Select
                      value={positionTypeFilter}
                      onValueChange={setPositionTypeFilter}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="job">Jobs Only</SelectItem>
                        <SelectItem value="internship">
                          Internships Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="min-w-[150px]">
                    <Label
                      htmlFor="status-filter"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Status
                    </Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">
                          Under Review
                        </SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="min-w-[150px]">
                    <Label
                      htmlFor="sector-filter"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Sector
                    </Label>
                    <Select
                      value={sectorFilter}
                      onValueChange={setSectorFilter}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
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

                  {(applicationSearch ||
                    positionTypeFilter !== "all" ||
                    statusFilter !== "all" ||
                    sectorFilter !== "all") && (
                    <div className="flex items-end">
                      <Button
                        onClick={() => {
                          setApplicationSearch("");
                          setPositionTypeFilter("all");
                          setStatusFilter("all");
                          setSectorFilter("all");
                        }}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>

                {/* Filtered Applications Display */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(() => {
                    // Filter applications based on search and filters
                    const filteredApplications = applications.filter(
                      (application) => {
                        // Search filter
                        const searchLower = applicationSearch.toLowerCase();
                        const matchesSearch =
                          !applicationSearch ||
                          application.applicantName
                            .toLowerCase()
                            .includes(searchLower) ||
                          application.applicantEmail
                            .toLowerCase()
                            .includes(searchLower) ||
                          (application.jobTitle &&
                            application.jobTitle
                              .toLowerCase()
                              .includes(searchLower)) ||
                          (application.company &&
                            application.company
                              .toLowerCase()
                              .includes(searchLower));

                        // Position type filter
                        const matchesPositionType =
                          positionTypeFilter === "all" ||
                          (positionTypeFilter === "job" && application.jobId) ||
                          (positionTypeFilter === "internship" &&
                            application.internshipId);

                        // Status filter
                        const matchesStatus =
                          statusFilter === "all" ||
                          application.status === statusFilter;

                        // Sector filter - simplified for now
                        const matchesSector = sectorFilter === "all";

                        return (
                          matchesSearch &&
                          matchesPositionType &&
                          matchesStatus &&
                          matchesSector
                        );
                      }
                    );

                    if (filteredApplications.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            {applications.length === 0
                              ? "No applications submitted yet"
                              : "No applications match the current filters"}
                          </p>
                        </div>
                      );
                    }

                    return filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className="border border-border rounded-lg p-4 bg-muted"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {application.applicantName}
                              </h3>
                              <Badge
                                variant={
                                  application.status === "approved"
                                    ? "default"
                                    : application.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  application.status === "approved"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : application.status === "rejected"
                                      ? "bg-red-100 text-red-800 border-red-300"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }
                              >
                                {application.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Email:
                                </span>
                                <span
                                  className="ml-2 text-blue-600 hover:underline cursor-pointer"
                                  onClick={() =>
                                    (window.location.href = `mailto:${application.applicantEmail}`)
                                  }
                                >
                                  {application.applicantEmail}
                                </span>
                              </div>
                              {application.applicantPhone && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Phone:
                                  </span>
                                  <span
                                    className="ml-2 text-green-600 hover:underline cursor-pointer"
                                    onClick={() =>
                                      (window.location.href = `tel:${application.applicantPhone}`)
                                    }
                                  >
                                    {application.applicantPhone}
                                  </span>
                                </div>
                              )}
                              <div className="md:col-span-2">
                                <span className="text-muted-foreground">
                                  Position:
                                </span>
                                <span className="ml-2 text-foreground font-medium">
                                  {application.jobTitle || "Position"}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {application.jobId ? "Job" : "Internship"}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Company:
                                </span>
                                <span className="ml-2 text-foreground font-medium">
                                  {application.company || "Company"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Applied:
                                </span>
                                <span className="ml-2 text-foreground">
                                  {formatDate(application.appliedAt)}
                                </span>
                              </div>
                            </div>

                            {application.coverLetter && (
                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Cover Letter:
                                </span>
                                <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded border">
                                  {application.coverLetter.length > 200
                                    ? `${application.coverLetter.substring(0, 200)}...`
                                    : application.coverLetter}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4 min-w-[200px]">
                            {/* Status Update Dropdown */}
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">
                                Status
                              </Label>
                              <Select
                                value={application.status}
                                onValueChange={(status) =>
                                  updateApplicationStatus(
                                    application.id,
                                    status
                                  )
                                }
                              >
                                <SelectTrigger className="w-full h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="submitted">
                                    Submitted
                                  </SelectItem>
                                  <SelectItem value="under_review">
                                    Under Review
                                  </SelectItem>
                                  <SelectItem value="interview">
                                    Interview
                                  </SelectItem>
                                  <SelectItem value="accepted">
                                    Accepted
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* CV Actions */}
                            <div className="flex flex-col gap-1">
                              {application.cvFileName &&
                              application.cvFilePath ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      // Extract the actual filename from the file path
                                      const actualFilename =
                                        application.cvFilePath
                                          ?.split("/")
                                          .pop();
                                      if (actualFilename) {
                                        window.open(
                                          `/api/cv/download/${encodeURIComponent(actualFilename)}`,
                                          "_blank"
                                        );
                                      }
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-50 text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View CV
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      application.cvFilePath &&
                                      downloadCV(
                                        application.cvFilePath,
                                        application.cvFileName
                                      )
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 text-gray-500 cursor-not-allowed text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  No CV
                                </Button>
                              )}
                            </div>

                            {/* Contact Actions */}
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={() =>
                                  (window.location.href = `mailto:${application.applicantEmail}`)
                                }
                                size="sm"
                                variant="outline"
                                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                              {application.applicantPhone && (
                                <Button
                                  onClick={() =>
                                    (window.location.href = `tel:${application.applicantPhone}`)
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50 text-xs"
                                >
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV-Job Matching Tab */}
          <TabsContent value="matching" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  CV-Job Matching System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Available CVs
                    </h3>
                    <div className="space-y-3">
                      {cvs.length === 0 ? (
                        <div className="text-center py-8 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No CVs available for matching
                          </p>
                        </div>
                      ) : (
                        cvs.map((cv) => (
                          <div
                            key={cv.id}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {cv.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {cv.section} • {cv.experience}
                            </p>
                            {cv.skills && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Skills: {cv.skills}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => findMatchingJobs(cv.id)}
                                disabled={isMatching}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Target className="h-4 w-4 mr-1" />
                                {isMatching ? "Matching..." : "Find Jobs"}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Matching Results
                    </h3>
                    {matchingResults.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {matchingResults.map((match, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-green-50 dark:bg-green-900/20"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {match.job?.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`${
                                  match.score >= 80
                                    ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200"
                                    : match.score >= 60
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200"
                                      : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
                                }`}
                              >
                                {match.score}% Match
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {match.job?.company}
                            </p>
                            {match.job?.industry && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Industry: {match.job.industry}
                              </p>
                            )}
                            {match.job?.experienceLevel && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Level: {match.job.experienceLevel}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Click "Find Jobs" to see matches
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CVs Tab */}
          <TabsContent value="cvs" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  CV Management ({cvs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {cv.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {cv.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cv.section}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cv.experience}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {cv.cvFileName && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `/api/cv-showcase/${cv.id}/download`,
                                "_blank"
                              )
                            }
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => findMatchingJobs(cv.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Match Jobs
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCV(cv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Professional Directory ({profiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {profiles.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No profiles created yet</p>
                    </div>
                  ) : (
                    profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {profile.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {profile.email}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {profile.company && (
                                <Badge
                                  variant="outline"
                                  className="border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600"
                                >
                                  {profile.company}
                                </Badge>
                              )}
                              {profile.position && (
                                <Badge
                                  variant="outline"
                                  className="border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600"
                                >
                                  {profile.position}
                                </Badge>
                              )}
                              {profile.industry && (
                                <Badge
                                  variant="outline"
                                  className="border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600"
                                >
                                  {profile.industry}
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  profile.isVisible ? "default" : "secondary"
                                }
                                className={
                                  profile.isVisible
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                }
                              >
                                {profile.isVisible ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => deleteProfile(profile.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Email Whitelist Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {/* Add new email */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addToWhitelist()}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                    <Button
                      onClick={addToWhitelist}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email
                    </Button>
                  </div>

                  {/* Search whitelist */}
                  <div className="relative">
                    <Input
                      placeholder="Search by email, name, or unit..."
                      value={whitelistSearch}
                      onChange={handleWhitelistSearchChange}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 pl-10 pr-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    {whitelistSearch && (
                      <button
                        onClick={() => setWhitelistSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {whitelist
                    .filter((item) => {
                      if (!whitelistSearch) return true;
                      const searchLower = whitelistSearch.toLowerCase();
                      return (
                        item.email.toLowerCase().includes(searchLower) ||
                        (item.name &&
                          item.name.toLowerCase().includes(searchLower)) ||
                        (item.unit &&
                          item.unit.toLowerCase().includes(searchLower))
                      );
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.email}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-300 bg-green-50"
                              >
                                Approved
                              </Badge>
                            </div>

                            {item.name && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Full Name:
                                  </span>
                                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                {item.unit && (
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Unit:
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                      {item.unit}
                                    </span>
                                  </div>
                                )}
                                {item.phone && (
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Mobile:
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                      {item.phone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Added to whitelist: {formatDate(item.createdAt)}
                            </p>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => editUser(item)}
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => removeUser(item.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="access" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 dark:text-white">
                    Access Requests ({pendingRequests.length} pending)
                  </CardTitle>
                  {pendingRequests.length > 0 && (
                    <Button
                      onClick={approveAllPendingRequests}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve All ({pendingRequests.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {request.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {request.email}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            Unit: {request.unitNumber}
                          </p>
                          {request.mobile && (
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              Mobile: {request.mobile}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                            Requested: {formatDateTime(request.requestedAt)}
                          </p>
                          <Badge
                            variant={
                              request.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                            className="mt-2"
                          >
                            {request.status}
                          </Badge>
                        </div>
                        {request.status === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => approveAccess(request.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => rejectAccess(request.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Removed Internships Tab */}
          <TabsContent value="removed-internships" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Removed Internships Management ({
                    removedInternships.length
                  }{" "}
                  total)
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Manage internships that have been removed. You can restore
                  them or permanently delete them.
                </p>
              </CardHeader>
              <CardContent>
                {/* Search for removed internships */}
                <div className="mb-6">
                  <Label
                    htmlFor="removed-internship-search"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Search Removed Internships
                  </Label>
                  <Input
                    id="removed-internship-search"
                    placeholder="Search by title, company, or description..."
                    value={removedInternshipSearch}
                    onChange={(e) => setRemovedInternshipSearch(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(() => {
                    const filteredRemovedInternships =
                      removedInternships.filter((internship) => {
                        const searchLower =
                          removedInternshipSearch.toLowerCase();
                        return (
                          !removedInternshipSearch ||
                          internship.title
                            .toLowerCase()
                            .includes(searchLower) ||
                          internship.company
                            .toLowerCase()
                            .includes(searchLower) ||
                          internship.description
                            .toLowerCase()
                            .includes(searchLower)
                        );
                      });

                    if (filteredRemovedInternships.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">
                            {removedInternshipSearch
                              ? "No removed internships match your search"
                              : "No removed internships found"}
                          </p>
                        </div>
                      );
                    }

                    return filteredRemovedInternships.map((internship) => (
                      <div
                        key={internship.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {internship.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {internship.company}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Removed
                              </span>
                              {internship.department && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  {internship.department}
                                </span>
                              )}
                              {internship.location && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {internship.location}
                                </span>
                              )}
                              {internship.duration && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {internship.duration}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <p>
                                Removed:{" "}
                                {new Date(
                                  internship.removedAt
                                ).toLocaleDateString()}
                              </p>
                              {internship.removalReason && (
                                <p>Reason: {internship.removalReason}</p>
                              )}
                              <p>
                                Originally posted:{" "}
                                {internship.originalCreatedAt
                                  ? new Date(
                                      internship.originalCreatedAt
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </p>
                            </div>
                            {internship.description && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {internship.description.substring(0, 150)}...
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => restoreInternship(internship.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              onClick={() =>
                                permanentlyDeleteInternship(internship.id)
                              }
                              size="sm"
                              variant="destructive"
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete Forever
                            </Button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Course Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    Create New Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Course Title</Label>
                    <Input
                      value={courseForm.title}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, title: e.target.value })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Provider</Label>
                    <Input
                      value={courseForm.provider}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          provider: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Type</Label>
                      <Input
                        value={courseForm.type}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, type: e.target.value })
                        }
                        placeholder="e.g. Online, In-person"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Duration</Label>
                      <Input
                        value={courseForm.duration}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            duration: e.target.value,
                          })
                        }
                        placeholder="e.g. 6 weeks"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700">Price (optional)</Label>
                    <Input
                      value={courseForm.price}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, price: e.target.value })
                      }
                      placeholder="e.g. 299"
                      type="number"
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Description</Label>
                    <Textarea
                      value={courseForm.description}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <Button
                    onClick={createCourse}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </CardContent>
              </Card>

              {/* Courses List */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    All Courses ({courses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {courses.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No courses created yet</p>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {course.provider}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    course.isApproved ? "default" : "secondary"
                                  }
                                >
                                  {course.isApproved ? "Approved" : "Pending"}
                                </Badge>
                                {course.type && (
                                  <Badge variant="outline">{course.type}</Badge>
                                )}
                                {course.duration && (
                                  <Badge variant="outline">
                                    {course.duration}
                                  </Badge>
                                )}
                                {course.price && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300"
                                  >
                                    ${course.price}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => deleteCourse(course.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    {editingInternship
                      ? "Edit Internship"
                      : "Create New Internship"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Internship Title</Label>
                    <Input
                      value={internshipForm.title}
                      onChange={(e) =>
                        setInternshipForm({
                          ...internshipForm,
                          title: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Company</Label>
                    <Input
                      value={internshipForm.company}
                      onChange={(e) =>
                        setInternshipForm({
                          ...internshipForm,
                          company: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Department</Label>
                    <Input
                      value={internshipForm.department}
                      onChange={(e) =>
                        setInternshipForm({
                          ...internshipForm,
                          department: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Duration</Label>
                    <Input
                      value={internshipForm.duration}
                      onChange={(e) =>
                        setInternshipForm({
                          ...internshipForm,
                          duration: e.target.value,
                        })
                      }
                      placeholder="e.g. 3 months"
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Description</Label>
                    <Textarea
                      value={internshipForm.description}
                      onChange={(e) =>
                        setInternshipForm({
                          ...internshipForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={
                        editingInternship ? updateInternship : createInternship
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {editingInternship ? (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Internship
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Internship
                        </>
                      )}
                    </Button>
                    {editingInternship && (
                      <Button
                        onClick={() => {
                          setEditingInternship(null);
                          setInternshipForm({
                            title: "",
                            company: "",
                            description: "",
                            department: "",
                            duration: "",
                            requirements: "",
                          });
                        }}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Internships List */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900">
                      All Internships ({internships.length})
                    </CardTitle>
                    {internships.filter(
                      (internship) =>
                        !internship.isApproved &&
                        internship.status === "pending"
                    ).length > 0 && (
                      <Button
                        onClick={approveAllPendingInternships}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve All (
                        {
                          internships.filter(
                            (internship) =>
                              !internship.isApproved &&
                              internship.status === "pending"
                          ).length
                        }
                        )
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                                    internship.isApproved
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {internship.isApproved
                                    ? "Approved"
                                    : "Pending"}
                                </Badge>
                                {internship.department && (
                                  <Badge variant="outline">
                                    {internship.department}
                                  </Badge>
                                )}
                                {internship.duration && (
                                  <Badge variant="outline">
                                    {internship.duration}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() =>
                                  setSelectedInternship(internship)
                                }
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                onClick={() =>
                                  editApprovedInternship(internship)
                                }
                                size="sm"
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!internship.isApproved &&
                                internship.status === "pending" && (
                                  <>
                                    <Button
                                      onClick={(e) =>
                                        approveInternship(internship.id, e)
                                      }
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={(e) =>
                                        rejectInternship(internship.id, e)
                                      }
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              <Button
                                onClick={() => deleteInternship(internship.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Approved Internships Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    Published Internships ({approvedInternships.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {approvedInternships.length === 0 ? (
                      <div className="text-center py-8">
                        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No published internships yet
                        </p>
                      </div>
                    ) : (
                      approvedInternships.map((internship) => (
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
                                  variant="default"
                                  className="bg-green-600"
                                >
                                  Published
                                </Badge>
                                {internship.department && (
                                  <Badge variant="outline">
                                    {internship.department}
                                  </Badge>
                                )}
                                {internship.duration && (
                                  <Badge variant="outline">
                                    {internship.duration}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() =>
                                  setSelectedInternship(internship)
                                }
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                onClick={() =>
                                  editApprovedInternship(internship)
                                }
                                size="sm"
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Delete "${internship.title}" internship? This will remove it from public view.`
                                    )
                                  ) {
                                    deleteInternship(internship.id, true);
                                  }
                                }}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Benefit Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    Create New Community Benefit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Benefit Title</Label>
                    <Input
                      value={benefitForm.title}
                      onChange={(e) =>
                        setBenefitForm({
                          ...benefitForm,
                          title: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Business Name</Label>
                    <Input
                      value={benefitForm.businessName}
                      onChange={(e) =>
                        setBenefitForm({
                          ...benefitForm,
                          businessName: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Discount %</Label>
                      <Input
                        value={benefitForm.discountPercentage}
                        onChange={(e) =>
                          setBenefitForm({
                            ...benefitForm,
                            discountPercentage: e.target.value,
                          })
                        }
                        placeholder="e.g. 20%"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Category</Label>
                      <Input
                        value={benefitForm.category}
                        onChange={(e) =>
                          setBenefitForm({
                            ...benefitForm,
                            category: e.target.value,
                          })
                        }
                        placeholder="e.g. Restaurant"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700">Location</Label>
                    <Input
                      value={benefitForm.location}
                      onChange={(e) =>
                        setBenefitForm({
                          ...benefitForm,
                          location: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Description</Label>
                    <Textarea
                      value={benefitForm.description}
                      onChange={(e) =>
                        setBenefitForm({
                          ...benefitForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={benefitForm.isActive}
                        onCheckedChange={(checked) =>
                          setBenefitForm({
                            ...benefitForm,
                            isActive: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="isActive" className="text-gray-700">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showOnHomepage"
                        checked={benefitForm.showOnHomepage}
                        onCheckedChange={(checked) =>
                          setBenefitForm({
                            ...benefitForm,
                            showOnHomepage: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="showOnHomepage" className="text-gray-700">
                        Show on Homepage
                      </Label>
                    </div>
                  </div>
                  <Button
                    onClick={createBenefit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Benefit
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits List */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    All Benefits ({benefits.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {benefits.length === 0 ? (
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No benefits created yet</p>
                      </div>
                    ) : (
                      benefits.map((benefit) => (
                        <div
                          key={benefit.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {benefit.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {benefit.businessName}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    benefit.isActive ? "default" : "secondary"
                                  }
                                >
                                  {benefit.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {benefit.discountPercentage && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300"
                                  >
                                    {benefit.discountPercentage} off
                                  </Badge>
                                )}
                                {benefit.category && (
                                  <Badge variant="outline">
                                    {benefit.category}
                                  </Badge>
                                )}
                                {benefit.showOnHomepage && (
                                  <Badge
                                    variant="outline"
                                    className="text-blue-700 border-blue-300"
                                  >
                                    Homepage
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => deleteBenefit(benefit.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          {/* Backup and Restore Tab */}
          <TabsContent value="backup" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  System Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create Backup Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Create New Backup
                  </h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={createBackup}
                      disabled={backupLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {backupLoading ? "Creating..." : "Create Backup"}
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      Creates a complete backup of all platform data including
                      jobs, CVs, profiles, and files
                    </p>
                  </div>
                </div>

                {/* Backup History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Backup History
                  </h3>
                  {backups.length > 0 ? (
                    <div className="space-y-3">
                      {backups.map((backup) => (
                        <div
                          key={backup.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {backup.description}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Created: {formatDateTime(backup.timestamp)} •
                              Size: {backup.size} • Files: {backup.filesCount}
                            </p>
                            <Badge
                              variant={
                                backup.status === "completed"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {backup.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => restoreBackup(backup.id)}
                              disabled={restoreLoading}
                              variant="outline"
                              size="sm"
                              className="border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              {restoreLoading ? "Restoring..." : "Restore"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No backups available. Create your first backup above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Job Details Modal */}
        {selectedJob && (
          <Dialog open={!!selectedJob} onOpenChange={closeJobDetails}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-300">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Job Review: {selectedJob.title}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Job Details */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-gray-700" />
                        Job Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Job Title
                          </Label>
                          <p className="text-gray-900 font-semibold">
                            {selectedJob.title}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Company
                          </Label>
                          <p className="text-gray-900 font-semibold">
                            {selectedJob.company}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Industry
                          </Label>
                          <p className="text-gray-900">
                            {selectedJob.industry || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Job Type
                          </Label>
                          <p className="text-gray-900">
                            {selectedJob.jobType || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Experience Level
                          </Label>
                          <p className="text-gray-900">
                            {selectedJob.experienceLevel || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Location
                          </Label>
                          <p className="text-gray-900">
                            {selectedJob.location || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Salary Range
                          </Label>
                          <p className="text-gray-900">
                            {selectedJob.salaryRange || "Not disclosed"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <Badge
                            variant={
                              selectedJob.isApproved ? "default" : "secondary"
                            }
                            className={
                              selectedJob.isApproved
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }
                          >
                            {selectedJob.isApproved
                              ? "Approved"
                              : "Pending Approval"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Job Description
                        </Label>
                        <div className="bg-white p-3 rounded border border-gray-300 text-gray-900 text-sm whitespace-pre-wrap">
                          {selectedJob.description}
                        </div>
                      </div>

                      {selectedJob.requirements && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Requirements
                          </Label>
                          <div className="bg-white p-3 rounded border border-gray-300 text-gray-900 text-sm whitespace-pre-wrap">
                            {selectedJob.requirements}
                          </div>
                        </div>
                      )}

                      {selectedJob.skills && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Required Skills
                          </Label>
                          <div className="bg-white p-3 rounded border border-gray-300 text-gray-900 text-sm whitespace-pre-wrap">
                            {selectedJob.skills}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Contact Email
                          </Label>
                          <p className="text-blue-600 font-medium">
                            {selectedJob.contactEmail}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Contact Phone
                          </Label>
                          <p className="text-gray-900 font-medium">
                            {selectedJob.contactPhone}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Poster Details */}
                <div className="space-y-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-700" />
                        Job Poster Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {jobPoster ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Name
                            </Label>
                            <p className="text-gray-900 font-semibold">
                              {jobPoster.name || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Email
                            </Label>
                            <p className="text-blue-600 font-medium">
                              {jobPoster.email}
                            </p>
                          </div>
                          {jobPoster.phone && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Phone
                              </Label>
                              <p className="text-gray-900 font-medium">
                                {jobPoster.phone}
                              </p>
                            </div>
                          )}
                          {jobPoster.unit && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Unit Number
                              </Label>
                              <p className="text-gray-900 font-medium">
                                {jobPoster.unit}
                              </p>
                            </div>
                          )}
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              User ID
                            </Label>
                            <p className="text-gray-600 font-medium">
                              #{jobPoster.id}
                            </p>
                          </div>
                          {jobPoster.createdAt && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Member Since
                              </Label>
                              <p className="text-gray-900 font-medium">
                                {formatDate(jobPoster.createdAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : selectedJob.postedBy ? (
                        <div className="text-center py-4">
                          <p className="text-gray-600 font-medium">
                            Loading poster details...
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 font-medium">
                            No poster information available
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Job created by admin
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedJob.createdAt && (
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-700" />
                          Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Posted Date
                            </Label>
                            <p className="text-gray-900 font-medium">
                              {formatDate(selectedJob.createdAt)}
                            </p>
                          </div>
                          {selectedJob.updatedAt &&
                            selectedJob.updatedAt !== selectedJob.createdAt && (
                              <div>
                                <Label className="text-sm font-medium text-gray-700">
                                  Last Updated
                                </Label>
                                <p className="text-gray-900 font-medium">
                                  {formatDate(selectedJob.updatedAt)}
                                </p>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!selectedJob.isApproved && (
                      <Button
                        onClick={() => {
                          approveJob(selectedJob.id);
                          closeJobDetails();
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white border-0 font-medium"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve Job
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this job?")
                        ) {
                          deleteJob(selectedJob.id);
                          closeJobDetails();
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white border-0 font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Job
                    </Button>
                    <Button
                      onClick={closeJobDetails}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 font-medium"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Job Dialog */}
        {editingJob && (
          <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-300">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Edit Job: {editingJob.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-gray-700">Job Title</Label>
                  <Input
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Company</Label>
                  <Input
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Industry</Label>
                  <Input
                    value={jobForm.industry}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, industry: e.target.value })
                    }
                    placeholder="e.g. Technology, Finance, Healthcare"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Experience Level</Label>
                  <Select
                    value={jobForm.experienceLevel}
                    onValueChange={(value) =>
                      setJobForm({ ...jobForm, experienceLevel: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Job Type</Label>
                  <Select
                    value={jobForm.jobType}
                    onValueChange={(value) =>
                      setJobForm({ ...jobForm, jobType: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Location</Label>
                  <Input
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    placeholder="e.g. Cairo, Egypt or Remote"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Salary Range</Label>
                  <Input
                    value={jobForm.salaryRange}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salaryRange: e.target.value })
                    }
                    placeholder="e.g. 15,000 - 25,000 EGP"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Contact Email</Label>
                  <Input
                    value={jobForm.contactEmail}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, contactEmail: e.target.value })
                    }
                    type="email"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-700">Description</Label>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    rows={4}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-700">Requirements</Label>
                  <Textarea
                    value={jobForm.requirements}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, requirements: e.target.value })
                    }
                    rows={3}
                    placeholder="List the required qualifications and experience"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-700">Skills</Label>
                  <Textarea
                    value={jobForm.skills}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, skills: e.target.value })
                    }
                    rows={2}
                    placeholder="Required skills (comma-separated)"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={updateJob}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => setEditingJob(null)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* User Edit Dialog */}
        {editingUser && (
          <Dialog
            open={!!editingUser}
            onOpenChange={() => setEditingUser(null)}
          >
            <DialogContent className="max-w-md bg-white border-gray-300">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Edit User: {editingUser.email}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-gray-700">Name</Label>
                  <Input
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    type="email"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Phone</Label>
                  <Input
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({ ...userForm, phone: e.target.value })
                    }
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Unit Number</Label>
                  <Input
                    value={userForm.unit}
                    onChange={(e) =>
                      setUserForm({ ...userForm, unit: e.target.value })
                    }
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={userForm.isActive}
                    onChange={(e) =>
                      setUserForm({ ...userForm, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive" className="text-gray-700">
                    Active User
                  </Label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={updateUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => setEditingUser(null)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Internship Details Modal */}
        {selectedInternship && (
          <Dialog
            open={!!selectedInternship}
            onOpenChange={() => setSelectedInternship(null)}
          >
            <DialogContent className="max-w-2xl bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Internship Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Position Title
                    </Label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                      {selectedInternship.title}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Company</Label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                      {selectedInternship.company}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                    {selectedInternship.description}
                  </p>
                </div>

                {selectedInternship.requirements && (
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Requirements
                    </Label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                      {selectedInternship.requirements}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInternship.department && (
                    <div>
                      <Label className="text-gray-700 font-medium">
                        Department
                      </Label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                        {selectedInternship.department}
                      </p>
                    </div>
                  )}
                  {selectedInternship.duration && (
                    <div>
                      <Label className="text-gray-700 font-medium">
                        Duration
                      </Label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                        {selectedInternship.duration}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Badge
                    variant={
                      selectedInternship.isApproved ? "default" : "secondary"
                    }
                  >
                    {selectedInternship.isApproved
                      ? "Approved"
                      : "Pending Review"}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    Status: Recently Submitted
                  </p>
                </div>

                {!selectedInternship.isApproved &&
                  selectedInternship.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => {
                          approveInternship(selectedInternship.id);
                          setSelectedInternship(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve Internship
                      </Button>
                      <Button
                        onClick={() => {
                          rejectInternship(selectedInternship.id);
                          setSelectedInternship(null);
                        }}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Internship
                      </Button>
                    </div>
                  )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Admin Settings Floating Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowAdminSettings(!showAdminSettings)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin Settings
          </Button>
        </div>

        {/* Admin Settings Modal */}
        {showAdminSettings && (
          <Dialog open={showAdminSettings} onOpenChange={setShowAdminSettings}>
            <DialogContent className="max-w-lg bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Admin Settings
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">
                    Current Password (Required)
                  </Label>
                  <Input
                    type="password"
                    value={adminForm.currentPassword}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>

                <div className="border-t pt-4">
                  <Label className="text-gray-700">
                    New Admin Email (Optional)
                  </Label>
                  <Input
                    type="email"
                    value={adminForm.newEmail}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, newEmail: e.target.value })
                    }
                    placeholder="Enter new admin email"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">
                    New Password (Optional)
                  </Label>
                  <Input
                    type="password"
                    value={adminForm.newPassword}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password (min 8 characters)"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={adminForm.confirmPassword}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="bg-white text-gray-900 border-gray-300"
                    disabled={!adminForm.newPassword}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={changeAdminCredentials}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    disabled={
                      !adminForm.currentPassword ||
                      (!adminForm.newEmail && !adminForm.newPassword)
                    }
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Settings
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAdminSettings(false);
                      setAdminForm({
                        currentPassword: "",
                        newEmail: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-700 flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
