import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Briefcase, GraduationCap, BookOpen, Upload, Mail, Check, X, TrendingUp, FileText, UserPlus, Plus, Edit, Trash2, Eye, Clock, Gift } from "lucide-react";
import type { Job, Internship, Course } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form states
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    industry: '',
    experienceLevel: '',
    skills: '',
    salaryRange: ''
  });

  const [internshipForm, setInternshipForm] = useState({
    title: '',
    company: '',
    description: '',
    department: '',
    duration: ''
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    type: '',
    duration: ''
  });

  const [benefitForm, setBenefitForm] = useState({
    title: '',
    description: '',
    businessName: '',
    location: '',
    discountPercentage: '',
    category: '',
    validUntil: '',
    isActive: true,
    showOnHomepage: false
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Fetch data
  const { data: stats = {} } = useQuery({ queryKey: ["/api/stats"] });
  const { data: jobs = [] } = useQuery({ queryKey: ["/api/jobs"] });
  const { data: internships = [] } = useQuery({ queryKey: ["/api/internships"] });
  const { data: courses = [] } = useQuery({ queryKey: ["/api/courses"] });
  const { data: cvShowcase = [] } = useQuery({ queryKey: ["/api/cv-showcase"] });
  const { data: applications = [] } = useQuery({ queryKey: ["/api/applications"] });
  const { data: whitelist = [] } = useQuery({ queryKey: ["/api/whitelist"] });
  const { data: accessRequests = [] } = useQuery({ queryKey: ["/api/access-requests"] });
  const { data: benefits = [] } = useQuery({ queryKey: ["/api/admin/community-benefits"] });
  const { data: profiles = [] } = useQuery({ queryKey: ["/api/profiles"] });

  // Mutations
  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) throw new Error('Failed to create job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job posted successfully!" });
      setJobForm({
        title: '',
        company: '',
        description: '',
        location: '',
        industry: '',
        experienceLevel: '',
        skills: '',
        salaryRange: ''
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
    }
  });

  const approveJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active', isActive: true })
      });
      if (!response.ok) throw new Error('Failed to approve job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job approved successfully!" });
    }
  });

  const rejectJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', isActive: false })
      });
      if (!response.ok) throw new Error('Failed to reject job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job rejected successfully!" });
    }
  });

  // Internship mutations
  const createInternshipMutation = useMutation({
    mutationFn: async (internshipData: any) => {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...internshipData, status: 'active', isActive: true })
      });
      if (!response.ok) throw new Error('Failed to create internship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/internships'] });
      toast({ title: "Success", description: "Internship posted successfully!" });
      setInternshipForm({ title: '', company: '', description: '', department: '', duration: '' });
    }
  });

  const deleteInternshipMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete internship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/internships'] });
      toast({ title: "Success", description: "Internship deleted successfully!" });
    }
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseData, status: 'active', isActive: true })
      });
      if (!response.ok) throw new Error('Failed to create course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: "Success", description: "Course posted successfully!" });
      setCourseForm({ title: '', description: '', instructor: '', type: '', duration: '' });
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: "Success", description: "Course deleted successfully!" });
    }
  });

  // CV mutations
  const deleteCvMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cv-showcase/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete CV');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cv-showcase'] });
      toast({ title: "Success", description: "CV deleted successfully!" });
    }
  });

  // Profile mutations
  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      toast({ title: "Success", description: "Profile deleted successfully!" });
    }
  });

  // Community Benefits mutations
  const createBenefitMutation = useMutation({
    mutationFn: async (benefitData: any) => {
      const response = await fetch('/api/admin/community-benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(benefitData)
      });
      if (!response.ok) throw new Error('Failed to create benefit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community-benefits'] });
      toast({ title: "Success", description: "Community benefit added successfully!" });
      setBenefitForm({
        title: '',
        description: '',
        businessName: '',
        location: '',
        discountPercentage: '',
        category: '',
        validUntil: '',
        isActive: true,
        showOnHomepage: false
      });
    }
  });

  const deleteBenefitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/community-benefits/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete benefit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community-benefits'] });
      toast({ title: "Success", description: "Community benefit deleted successfully!" });
    }
  });

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'accepted': return 'active';
      case 'rejected': return 'draft';
      default: return 'draft';
    }
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({
      ...jobForm,
      status: 'active',
      isActive: true
    });
  };

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
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(whitelist) ? whitelist.length : 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jobs Posted</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(jobs) ? jobs.length : 0}
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
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(courses) ? courses.length : 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CV Showcase</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(cvShowcase) ? cvShowcase.length : 0}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="cvs">CVs</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            <TabsTrigger value="users">Users/Directory</TabsTrigger>
          </TabsList>

          {/* Access Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Access Requests ({Array.isArray(accessRequests) ? accessRequests.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(accessRequests) && accessRequests.length > 0 ? (
                    accessRequests.map((request: any) => (
                      <div key={request.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{request.fullName}</h4>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            <p className="text-sm">Unit: {request.unitNumber}</p>
                            {request.mobile && <p className="text-sm">Mobile: {request.mobile}</p>}
                            <p className="text-xs text-muted-foreground">
                              Requested: {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600">
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No pending access requests</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Job Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Post New Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Senior Developer"
                          value={jobForm.title}
                          onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Company name"
                          value={jobForm.company}
                          onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the role, responsibilities, and requirements..."
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g. NewGiza, Remote"
                          value={jobForm.location}
                          onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input
                          id="salary"
                          placeholder="e.g. 15,000 - 25,000 EGP"
                          value={jobForm.salaryRange}
                          onChange={(e) => setJobForm(prev => ({ ...prev, salaryRange: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={jobForm.industry} onValueChange={(value) => setJobForm(prev => ({ ...prev, industry: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select value={jobForm.experienceLevel} onValueChange={(value) => setJobForm(prev => ({ ...prev, experienceLevel: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Entry Level">Entry Level</SelectItem>
                            <SelectItem value="Mid Level">Mid Level</SelectItem>
                            <SelectItem value="Senior Level">Senior Level</SelectItem>
                            <SelectItem value="Executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="skills">Required Skills</Label>
                      <Input
                        id="skills"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={jobForm.skills}
                        onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={createJobMutation.isPending}>
                      {createJobMutation.isPending ? "Posting..." : "Post Job"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Pending Jobs for Approval */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Jobs Pending Approval ({Array.isArray(jobs) ? jobs.filter((job: Job) => job.status === 'pending').length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(jobs) && jobs.filter((job: Job) => job.status === 'pending').length > 0 ? (
                      jobs.filter((job: Job) => job.status === 'pending').map((job: Job) => (
                        <div key={job.id} className="border border-yellow-200 rounded-lg p-4 space-y-2 bg-yellow-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                              <p className="text-xs text-muted-foreground">Submitted {formatDate(job.createdAt!)}</p>
                              {job.description && (
                                <p className="text-sm mt-2 text-gray-600 line-clamp-2">{job.description.substring(0, 150)}...</p>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => {
                                  if (confirm(`Approve "${job.title}" from ${job.company}?`)) {
                                    approveJobMutation.mutate(job.id);
                                  }
                                }}
                                disabled={approveJobMutation.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
                                onClick={() => {
                                  if (confirm(`Reject "${job.title}" job posting?`)) {
                                    rejectJobMutation.mutate(job.id);
                                  }
                                }}
                                disabled={rejectJobMutation.isPending}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700">
                              Pending Review
                            </Badge>
                            {job.industry && (
                              <Badge variant="outline" className="text-xs">
                                {job.industry}
                              </Badge>
                            )}
                            {job.experienceLevel && (
                              <Badge variant="outline" className="text-xs">
                                {job.experienceLevel}
                              </Badge>
                            )}
                            {job.location && (
                              <Badge variant="outline" className="text-xs">
                                {job.location}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No jobs pending approval</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Active Jobs Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Active Jobs ({Array.isArray(jobs) ? jobs.filter((job: Job) => job.status === 'active').length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Array.isArray(jobs) && jobs.filter((job: Job) => job.status === 'active').length > 0 ? (
                    jobs.filter((job: Job) => job.status === 'active').map((job: Job) => (
                      <div key={job.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <p className="text-xs text-muted-foreground">Posted {formatDate(job.createdAt!)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm(`Delete "${job.title}" job posting?`)) {
                                deleteJobMutation.mutate(job.id);
                              }
                            }}
                            disabled={deleteJobMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                            Active
                          </Badge>
                          {job.industry && (
                            <Badge variant="outline" className="text-xs">
                              {job.industry}
                            </Badge>
                          )}
                          {job.experienceLevel && (
                            <Badge variant="outline" className="text-xs">
                              {job.experienceLevel}
                            </Badge>
                          )}
                          {job.location && (
                            <Badge variant="outline" className="text-xs">
                              {job.location}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No active jobs</p>
                  )}
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          <TabsContent value="internships" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Internship Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Post New Internship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createInternshipMutation.mutate(internshipForm);
                  }} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="internship-title">Internship Title</Label>
                        <Input
                          id="internship-title"
                          placeholder="e.g. Marketing Intern"
                          value={internshipForm.title}
                          onChange={(e) => setInternshipForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="internship-company">Company</Label>
                        <Input
                          id="internship-company"
                          placeholder="Company name"
                          value={internshipForm.company}
                          onChange={(e) => setInternshipForm(prev => ({ ...prev, company: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="internship-description">Description</Label>
                      <Textarea
                        id="internship-description"
                        placeholder="Describe the internship responsibilities and requirements..."
                        value={internshipForm.description}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select value={internshipForm.department} onValueChange={(value) => setInternshipForm(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g. 3 months"
                          value={internshipForm.duration}
                          onChange={(e) => setInternshipForm(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={createInternshipMutation.isPending}>
                      {createInternshipMutation.isPending ? "Posting..." : "Post Internship"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Internships List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Current Internships ({Array.isArray(internships) ? internships.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(internships) && internships.length > 0 ? (
                      internships.map((internship: Internship) => (
                        <div key={internship.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{internship.title}</h4>
                              <p className="text-sm text-muted-foreground">{internship.company}</p>
                              <p className="text-xs text-muted-foreground">Posted {formatDate(internship.createdAt!)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                if (confirm(`Delete "${internship.title}" internship?`)) {
                                  deleteInternshipMutation.mutate(internship.id);
                                }
                              }}
                              disabled={deleteInternshipMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {internship.department && (
                              <Badge variant="outline" className="text-xs">
                                {internship.department}
                              </Badge>
                            )}
                            {internship.duration && (
                              <Badge variant="outline" className="text-xs">
                                {internship.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No internships posted yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Course Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createCourseMutation.mutate(courseForm);
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="course-title">Course Title</Label>
                      <Input
                        id="course-title"
                        placeholder="e.g. Introduction to Digital Marketing"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="course-description">Course Description</Label>
                      <Textarea
                        id="course-description"
                        placeholder="Describe what students will learn..."
                        value={courseForm.description}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                          id="instructor"
                          placeholder="Instructor name"
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-duration">Duration</Label>
                        <Input
                          id="course-duration"
                          placeholder="e.g. 6 weeks"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="course-type">Course Type</Label>
                      <Select value={courseForm.type} onValueChange={(value) => setCourseForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="In-Person">In-Person</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={createCourseMutation.isPending}>
                      {createCourseMutation.isPending ? "Adding..." : "Add Course"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Courses List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Current Courses ({Array.isArray(courses) ? courses.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(courses) && courses.length > 0 ? (
                      courses.map((course: Course) => (
                        <div key={course.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">{course.instructor}</p>
                              <p className="text-xs text-muted-foreground">Added {formatDate(course.createdAt!)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                if (confirm(`Delete "${course.title}" course?`)) {
                                  deleteCourseMutation.mutate(course.id);
                                }
                              }}
                              disabled={deleteCourseMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {course.type && (
                              <Badge variant="outline" className="text-xs">
                                {course.type}
                              </Badge>
                            )}
                            {course.duration && (
                              <Badge variant="outline" className="text-xs">
                                {course.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No courses added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cvs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  CV Showcase Management ({Array.isArray(cvShowcase) ? cvShowcase.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Array.isArray(cvShowcase) && cvShowcase.length > 0 ? (
                    cvShowcase.map((cv: any) => (
                      <div key={cv.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{cv.name}</h4>
                            <p className="text-sm text-muted-foreground">{cv.title}</p>
                            <p className="text-xs text-muted-foreground">Uploaded {formatDate(cv.createdAt!)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm(`Delete "${cv.name}"'s CV?`)) {
                                deleteCvMutation.mutate(cv.id);
                              }
                            }}
                            disabled={deleteCvMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {cv.section && (
                            <Badge variant="outline" className="text-xs">
                              {cv.section}
                            </Badge>
                          )}
                          {cv.cvFile && (
                            <Badge variant="outline" className="text-xs">
                              Has File
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No CVs uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Benefit Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Community Benefit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createBenefitMutation.mutate(benefitForm);
                  }} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="benefit-title">Benefit Title</Label>
                        <Input
                          id="benefit-title"
                          placeholder="e.g. 20% Off Restaurant Menu"
                          value={benefitForm.title}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          placeholder="Business or service name"
                          value={benefitForm.businessName}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, businessName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="benefit-description">Description</Label>
                      <Textarea
                        id="benefit-description"
                        placeholder="Describe the benefit and how to claim it..."
                        value={benefitForm.description}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="discount">Discount Percentage</Label>
                        <Input
                          id="discount"
                          placeholder="e.g. 20%"
                          value={benefitForm.discountPercentage}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="benefit-location">Location</Label>
                        <Input
                          id="benefit-location"
                          placeholder="e.g. NewGiza"
                          value={benefitForm.location}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={benefitForm.category} onValueChange={(value) => setBenefitForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                            <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="valid-until">Valid Until (Optional)</Label>
                      <Input
                        id="valid-until"
                        type="date"
                        value={benefitForm.validUntil}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, validUntil: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is-active"
                          checked={benefitForm.isActive}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="is-active">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="show-homepage"
                          checked={benefitForm.showOnHomepage}
                          onChange={(e) => setBenefitForm(prev => ({ ...prev, showOnHomepage: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="show-homepage">Show on Homepage</Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={createBenefitMutation.isPending}>
                      {createBenefitMutation.isPending ? "Adding..." : "Add Benefit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Benefits List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Community Benefits ({Array.isArray(benefits) ? benefits.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(benefits) && benefits.length > 0 ? (
                      benefits.map((benefit: any) => (
                        <div key={benefit.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{benefit.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefit.businessName}</p>
                              <p className="text-xs text-muted-foreground">Added {formatDate(benefit.createdAt!)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-1">
                                <Badge variant={benefit.isActive ? "default" : "secondary"} className="text-xs">
                                  {benefit.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {benefit.showOnHomepage && (
                                  <Badge variant="outline" className="text-xs">
                                    On Homepage
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  if (confirm(`Delete "${benefit.title}" benefit?`)) {
                                    deleteBenefitMutation.mutate(benefit.id);
                                  }
                                }}
                                disabled={deleteBenefitMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {benefit.discountPercentage && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                {benefit.discountPercentage} off
                              </Badge>
                            )}
                            {benefit.category && (
                              <Badge variant="outline" className="text-xs">
                                {benefit.category}
                              </Badge>
                            )}
                            {benefit.location && (
                              <Badge variant="outline" className="text-xs">
                                {benefit.location}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No community benefits added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="whitelist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Whitelist ({Array.isArray(whitelist) ? whitelist.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Array.isArray(whitelist) && whitelist.length > 0 ? (
                    whitelist.map((email: any) => (
                      <div key={email.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{email.email}</h4>
                            {email.name && (
                              <p className="text-sm text-muted-foreground">{email.name}</p>
                            )}
                            {email.unit && (
                              <p className="text-xs text-muted-foreground">Unit: {email.unit}</p>
                            )}
                          </div>
                          <Badge variant={email.isActive ? "default" : "secondary"} className="text-xs">
                            {email.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No whitelisted emails yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Users & Directory ({Array.isArray(profiles) ? profiles.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Array.isArray(profiles) && profiles.length > 0 ? (
                    profiles.map((profile: any) => (
                      <div key={profile.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{profile.name}</h4>
                            <p className="text-sm text-muted-foreground">{profile.title}</p>
                            {profile.company && (
                              <p className="text-xs text-muted-foreground">{profile.company}</p>
                            )}
                            <p className="text-xs text-muted-foreground">Joined {formatDate(profile.createdAt!)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm(`Delete "${profile.name}"'s profile?`)) {
                                deleteProfileMutation.mutate(profile.id);
                              }
                            }}
                            disabled={deleteProfileMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profile.industry && (
                            <Badge variant="outline" className="text-xs">
                              {profile.industry}
                            </Badge>
                          )}
                          {profile.contact && (
                            <Badge variant="outline" className="text-xs">
                              Has Contact
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No user profiles yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}