import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  usePermanentlyDeleteRemovedInternship
} from "@/lib/convexApi";
import { Job, Internship, Course, Profile, CommunityBenefit, Application, EmailWhitelist, AccessRequest } from "@/lib/typeAdapter";
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
} from "lucide-react";

export default function AdminComplete() {
  const { toast } = useToast();

  // Form states
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    industry: "",
    experienceLevel: "",
    skills: "",
    salaryRange: "",
  });

  const [internshipForm, setInternshipForm] = useState({
    title: "",
    company: "",
    description: "",
    department: "",
    duration: "",
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
  const deleteRemovedInternshipMutation = usePermanentlyDeleteRemovedInternship();

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
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
    createJobMutation.mutate({
      ...jobForm,
      status: "active",
      isActive: true,
    }, {
      onSuccess: () => {
        setJobForm({
          title: "",
          company: "",
          description: "",
          location: "",
          industry: "",
          experienceLevel: "",
          skills: "",
          salaryRange: "",
        });
        toast({ title: "Success", description: "Job created successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
      }
    });
  };

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInternshipMutation.mutate({
      ...internshipForm,
      status: "active",
      isActive: true,
    }, {
      onSuccess: () => {
        setInternshipForm({
          title: "",
          company: "",
          description: "",
          department: "",
          duration: "",
        });
        toast({ title: "Success", description: "Internship created successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create internship", variant: "destructive" });
      }
    });
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate({
          ...courseForm,
      status: "active",
      isActive: true,
    }, {
      onSuccess: () => {
        setCourseForm({
          title: "",
          description: "",
          instructor: "",
          type: "",
          duration: "",
        });
        toast({ title: "Success", description: "Course created successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create course", variant: "destructive" });
      }
    });
  };

  const handleBenefitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBenefitMutation.mutate({
      ...benefitForm,
      status: "active",
    }, {
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
        toast({ title: "Success", description: "Community benefit created successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create community benefit", variant: "destructive" });
      }
    });
  };

  const handleWhitelistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToWhitelistMutation.mutate({
      email: whitelistForm.email,
      name: whitelistForm.name || undefined,
      unit: whitelistForm.unit || undefined,
      phone: whitelistForm.phone || undefined,
    }, {
      onSuccess: () => {
        setWhitelistForm({
          email: "",
          name: "",
          unit: "",
          phone: "",
        });
        toast({ title: "Success", description: "Email added to whitelist successfully!" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add email to whitelist", variant: "destructive" });
      }
    });
  };

  const handleAccessRequestStatusUpdate = (id: string, status: "pending" | "approved" | "rejected") => {
    updateAccessRequestStatusMutation.mutate({ id: id as any, status }, {
      onSuccess: () => {
        toast({ title: "Success", description: `Access request ${status} successfully!` });
      },
      onError: () => {
        toast({ title: "Error", description: `Failed to ${status} access request`, variant: "destructive" });
      }
    });
  };

  // Removed items handlers
  const handleRestoreJob = (id: string) => {
    restoreJobMutation.mutate(id as any, {
      onSuccess: () => toast({ title: "Success", description: "Job restored successfully!" }),
      onError: () => toast({ title: "Error", description: "Failed to restore job", variant: "destructive" })
    });
  };

  const handleRestoreInternship = (id: string) => {
    restoreInternshipMutation.mutate(id as any, {
      onSuccess: () => toast({ title: "Success", description: "Internship restored successfully!" }),
      onError: () => toast({ title: "Error", description: "Failed to restore internship", variant: "destructive" })
    });
  };

  const handleDeleteRemovedJob = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this job? This action cannot be undone.")) {
      deleteRemovedJobMutation.mutate(id as any, {
        onSuccess: () => toast({ title: "Success", description: "Job permanently deleted!" }),
        onError: () => toast({ title: "Error", description: "Failed to delete job", variant: "destructive" })
      });
    }
  };

  const handleDeleteRemovedInternship = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this internship? This action cannot be undone.")) {
      deleteRemovedInternshipMutation.mutate(id as any, {
        onSuccess: () => toast({ title: "Success", description: "Internship permanently deleted!" }),
        onError: () => toast({ title: "Error", description: "Failed to delete internship", variant: "destructive" })
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
                  <p className="text-sm text-muted-foreground">Whitelisted Users</p>
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
                  <p className="text-sm text-muted-foreground">Access Requests</p>
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
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Manage Jobs
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Job</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div>
                        <Label htmlFor="job-title">Title</Label>
                    <Input
                          id="job-title"
                      value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="job-company">Company</Label>
                    <Input
                          id="job-company"
                      value={jobForm.company}
                          onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="job-description">Description</Label>
                    <Textarea
                          id="job-description"
                      value={jobForm.description}
                          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                          required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                          <Label htmlFor="job-location">Location</Label>
                      <Input
                            id="job-location"
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            required
                      />
                    </div>
                    <div>
                          <Label htmlFor="job-industry">Industry</Label>
                      <Input
                            id="job-industry"
                            value={jobForm.industry}
                            onChange={(e) => setJobForm({ ...jobForm, industry: e.target.value })}
                            required
                      />
                    </div>
                  </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="job-experience">Experience Level</Label>
                  <Input
                            id="job-experience"
                            value={jobForm.experienceLevel}
                            onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                            required
                  />
                </div>
                        <div>
                          <Label htmlFor="job-salary">Salary Range</Label>
                    <Input
                            id="job-salary"
                            value={jobForm.salaryRange}
                            onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                            required
                    />
                  </div>
                  </div>
                              <div>
                        <Label htmlFor="job-skills">Skills</Label>
                    <Input
                          id="job-skills"
                          value={jobForm.skills}
                          onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                          required
                        />
                  </div>
                      <Button type="submit" disabled={createJobMutation.isPending}>
                        {createJobMutation.isPending ? "Creating..." : "Create Job"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                                <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <p className="text-sm">{job.location}</p>
                            <Badge variant={getStatusBadge(job.status)}>{job.status}</Badge>
                                </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteJobMutation.mutate(job.id, {
                                onSuccess: () => toast({ title: "Success", description: "Job deleted successfully!" }),
                                onError: () => toast({ title: "Error", description: "Failed to delete job", variant: "destructive" })
                              })}
                              disabled={deleteJobMutation.isPending}
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

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Manage Internships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Internship
                            </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Internship</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleInternshipSubmit} className="space-y-4">
                  <div>
                        <Label htmlFor="internship-title">Title</Label>
                    <Input
                          id="internship-title"
                          value={internshipForm.title}
                          onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="internship-company">Company</Label>
                    <Input
                          id="internship-company"
                          value={internshipForm.company}
                          onChange={(e) => setInternshipForm({ ...internshipForm, company: e.target.value })}
                          required
                    />
                  </div>
                    <div>
                        <Label htmlFor="internship-description">Description</Label>
                        <Textarea
                          id="internship-description"
                          value={internshipForm.description}
                          onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                          required
                      />
                    </div>
                      <div className="grid grid-cols-2 gap-4">
                    <div>
                          <Label htmlFor="internship-department">Department</Label>
                      <Input
                            id="internship-department"
                            value={internshipForm.department}
                            onChange={(e) => setInternshipForm({ ...internshipForm, department: e.target.value })}
                            required
                          />
                  </div>
                  <div>
                          <Label htmlFor="internship-duration">Duration</Label>
                    <Input
                            id="internship-duration"
                            value={internshipForm.duration}
                            onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                            required
                    />
                  </div>
                  </div>
                      <Button type="submit" disabled={createInternshipMutation.isPending}>
                        {createInternshipMutation.isPending ? "Creating..." : "Create Internship"}
                  </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {internships.map((internship) => (
                    <Card key={internship.id}>
                      <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{internship.title}</h3>
                            <p className="text-sm text-muted-foreground">{internship.company}</p>
                            <p className="text-sm">{internship.department}</p>
                            <Badge variant={getStatusBadge(internship.status)}>{internship.status}</Badge>
                              </div>
                          <div className="flex gap-2">
                              <Button
                              variant="outline"
                                size="sm"
                              onClick={() => deleteInternshipMutation.mutate(internship.id, {
                                onSuccess: () => toast({ title: "Success", description: "Internship deleted successfully!" }),
                                onError: () => toast({ title: "Error", description: "Failed to delete internship", variant: "destructive" })
                              })}
                              disabled={deleteInternshipMutation.isPending}
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
                          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="course-description">Description</Label>
                        <Textarea
                          id="course-description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          required
                    />
                  </div>
                      <div className="grid grid-cols-2 gap-4">
                  <div>
                          <Label htmlFor="course-instructor">Instructor</Label>
                    <Input
                            id="course-instructor"
                            value={courseForm.instructor}
                            onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                            required
                    />
                  </div>
                  <div>
                          <Label htmlFor="course-type">Type</Label>
                    <Input
                            id="course-type"
                            value={courseForm.type}
                            onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value })}
                            required
                          />
                        </div>
                  </div>
                  <div>
                        <Label htmlFor="course-duration">Duration</Label>
                        <Input
                          id="course-duration"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          required
                    />
                  </div>
                      <Button type="submit" disabled={createCourseMutation.isPending}>
                        {createCourseMutation.isPending ? "Creating..." : "Create Course"}
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
                            <p className="text-sm text-muted-foreground">{course.instructor}</p>
                            <p className="text-sm">{course.type}</p>
                            <Badge variant={course.isActive ? "default" : "secondary"}>
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                              </div>
                          <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                              onClick={() => deleteCourseMutation.mutate(course.id, {
                                onSuccess: () => toast({ title: "Success", description: "Course deleted successfully!" }),
                                onError: () => toast({ title: "Error", description: "Failed to delete course", variant: "destructive" })
                              })}
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
                          onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="benefit-description">Description</Label>
                        <Textarea
                          id="benefit-description"
                          value={benefitForm.description}
                          onChange={(e) => setBenefitForm({ ...benefitForm, description: e.target.value })}
                          required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                          <Label htmlFor="benefit-business">Business Name</Label>
                      <Input
                            id="benefit-business"
                            value={benefitForm.businessName}
                            onChange={(e) => setBenefitForm({ ...benefitForm, businessName: e.target.value })}
                            required
                      />
                    </div>
                    <div>
                          <Label htmlFor="benefit-location">Location</Label>
                      <Input
                            id="benefit-location"
                            value={benefitForm.location}
                            onChange={(e) => setBenefitForm({ ...benefitForm, location: e.target.value })}
                            required
                      />
                    </div>
                  </div>
                      <div className="grid grid-cols-2 gap-4">
                  <div>
                          <Label htmlFor="benefit-discount">Discount Percentage</Label>
                    <Input
                            id="benefit-discount"
                            value={benefitForm.discountPercentage}
                            onChange={(e) => setBenefitForm({ ...benefitForm, discountPercentage: e.target.value })}
                            required
                    />
                  </div>
                  <div>
                          <Label htmlFor="benefit-category">Category</Label>
                          <Input
                            id="benefit-category"
                            value={benefitForm.category}
                            onChange={(e) => setBenefitForm({ ...benefitForm, category: e.target.value })}
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
                          onChange={(e) => setBenefitForm({ ...benefitForm, validUntil: e.target.value })}
                          required
                        />
                    </div>
                      <Button type="submit" disabled={createBenefitMutation.isPending}>
                        {createBenefitMutation.isPending ? "Creating..." : "Create Benefit"}
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
                            <p className="text-sm text-muted-foreground">{benefit.businessName}</p>
                            <p className="text-sm">{benefit.location}</p>
                            <Badge variant={getStatusBadge(benefit.status)}>{benefit.status}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteBenefitMutation.mutate(benefit.id, {
                                onSuccess: () => toast({ title: "Success", description: "Benefit deleted successfully!" }),
                                onError: () => toast({ title: "Error", description: "Failed to delete benefit", variant: "destructive" })
                              })}
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
                    <form onSubmit={handleWhitelistSubmit} className="space-y-4">
                <div>
                        <Label htmlFor="whitelist-email">Email</Label>
                  <Input
                          id="whitelist-email"
                    type="email"
                          value={whitelistForm.email}
                          onChange={(e) => setWhitelistForm({ ...whitelistForm, email: e.target.value })}
                          required
                  />
                </div>
                <div>
                        <Label htmlFor="whitelist-name">Name (Optional)</Label>
                  <Input
                          id="whitelist-name"
                          value={whitelistForm.name}
                          onChange={(e) => setWhitelistForm({ ...whitelistForm, name: e.target.value })}
                  />
                </div>
                      <div className="grid grid-cols-2 gap-4">
                <div>
                          <Label htmlFor="whitelist-unit">Unit (Optional)</Label>
                  <Input
                            id="whitelist-unit"
                            value={whitelistForm.unit}
                            onChange={(e) => setWhitelistForm({ ...whitelistForm, unit: e.target.value })}
                  />
                </div>
                <div>
                          <Label htmlFor="whitelist-phone">Phone (Optional)</Label>
                  <Input
                            id="whitelist-phone"
                            value={whitelistForm.phone}
                            onChange={(e) => setWhitelistForm({ ...whitelistForm, phone: e.target.value })}
                  />
                </div>
                </div>
                      <Button type="submit" disabled={addToWhitelistMutation.isPending}>
                        {addToWhitelistMutation.isPending ? "Adding..." : "Add to Whitelist"}
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
                            {item.name && <p className="text-sm text-muted-foreground">{item.name}</p>}
                            {item.unit && <p className="text-sm">{item.unit}</p>}
                            <Badge variant={item.isActive ? "active" : "draft"}>
                              {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                          <div className="flex gap-2">
                      <Button
                        variant="outline"
                              size="sm"
                              onClick={() => removeFromWhitelistMutation.mutate(item.id, {
                                onSuccess: () => toast({ title: "Success", description: "Email removed from whitelist successfully!" }),
                                onError: () => toast({ title: "Error", description: "Failed to remove email from whitelist", variant: "destructive" })
                              })}
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
                            <h3 className="font-semibold">{request.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            <p className="text-sm">Unit: {request.unitNumber}</p>
                            {request.mobile && <p className="text-sm">Mobile: {request.mobile}</p>}
                            <Badge variant={getStatusBadge(request.status)}>{request.status}</Badge>
                </div>
                          <div className="flex gap-2">
                            {request.status === "pending" && (
                              <>
                  <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAccessRequestStatusUpdate(request.id.toString(), "approved")}
                                  disabled={updateAccessRequestStatusMutation.isPending}
                                >
                                  <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                                  size="sm"
                                  onClick={() => handleAccessRequestStatusUpdate(request.id.toString(), "rejected")}
                                  disabled={updateAccessRequestStatusMutation.isPending}
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
                          <Card key={job._id} className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">{job.company}</p>
                                  <p className="text-sm">{job.location || "Remote"}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">{job.job_type || "Full-time"}</Badge>
                                    <Badge variant="secondary">{job.experience_level || "Any"}</Badge>
                                    {job.salary_range && (
                                      <Badge variant="outline">{job.salary_range}</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {job.description}
                                  </p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    <div>Posted by: {job.poster_email}</div>
                                    <div>Removed at: {new Date(job.removed_at || "").toLocaleDateString()}</div>
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
                                    onClick={() => handleDeleteRemovedJob(job._id)}
                                    disabled={deleteRemovedJobMutation.isPending}
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

                  <TabsContent value="removed-internships" className="space-y-4">
                    {removedInternships?.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>No removed internships found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {removedInternships?.map((internship) => (
                          <Card key={internship._id} className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{internship.title}</h3>
                                  <p className="text-sm text-muted-foreground">{internship.company}</p>
                                  <p className="text-sm">{internship.location || "Remote"}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">{internship.duration}</Badge>
                                    <Badge variant={internship.is_paid ? "default" : "secondary"}>
                                      {internship.is_paid ? "Paid" : "Unpaid"}
                                    </Badge>
                                    {internship.stipend && (
                                      <Badge variant="outline">{internship.stipend}</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {internship.description}
                                  </p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    <div>Posted by: {internship.poster_email}</div>
                                    <div>Removed at: {new Date(internship.removed_at || "").toLocaleDateString()}</div>
                                    {internship.removal_reason && (
                                      <div>Reason: {internship.removal_reason}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestoreInternship(internship._id)}
                                    disabled={restoreInternshipMutation.isPending}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Restore
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteRemovedInternship(internship._id)}
                                    disabled={deleteRemovedInternshipMutation.isPending}
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
                    <li>• <strong>Restore:</strong> Move the item back to the active jobs/internships list</li>
                    <li>• <strong>Delete:</strong> Permanently remove the item from the database (cannot be undone)</li>
                    <li>• Items are automatically moved here when they are removed from the main listings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}