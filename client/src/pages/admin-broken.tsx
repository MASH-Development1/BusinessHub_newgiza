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
import type { Job, Internship, Course, Application } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  });

  const [internshipForm, setInternshipForm] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    skills: "",
    department: "",
    duration: "",
    isPaid: false,
    stipend: "",
    location: "",
    positions: 1,
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    type: "course",
    instructor: "",
    duration: "",
    price: "",
    startDate: "",
    endDate: "",
    maxAttendees: "",
    location: "",
    isOnline: false,
    registrationUrl: "",
    skills: "",
    isFeatured: false,
  });

  const [cvForm, setCvForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    section: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    yearsOfExperience: "",
    linkedinUrl: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);

  // Email whitelist state
  const [emailForm, setEmailForm] = useState({
    email: "",
    name: "",
    notes: "",
  });

  const [benefitForm, setBenefitForm] = useState({
    title: "",
    businessName: "",
    description: "",
    discountPercentage: "",
    location: "",
    category: "",
    validUntil: "",
    showOnHomepage: false,
  });

  const [benefitImage, setBenefitImage] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // Fetch whitelist
  const { data: whitelist = [], refetch: refetchWhitelist } = useQuery({
    queryKey: ["/api/whitelist"],
  });

  // Fetch access requests
  const { data: accessRequests = [] } = useQuery({
    queryKey: ["/api/access-requests"],
  });

  // Email whitelist mutations
  const addEmailMutation = useMutation({
    mutationFn: async (data: typeof emailForm) => {
      const response = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add email');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whitelist"] });
      setEmailForm({ email: "", name: "", notes: "" });
      toast({ title: "Success", description: "Email added to whitelist successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add email to whitelist", variant: "destructive" });
    },
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
  });

  // Fetch internships
  const { data: internships = [] } = useQuery({
    queryKey: ["/api/internships"],
  });

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });

  // Fetch applications
  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
  });

  // Fetch CV showcase
  const { data: cvShowcase = [] } = useQuery({
    queryKey: ["/api/cv-showcase"],
  });

  // Fetch community benefits
  const { data: benefits = [] } = useQuery({
    queryKey: ["/api/admin/community-benefits"],
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: JSON.stringify(data.skills.split(',').map((s: string) => s.trim())),
          postedBy: 1, // Default admin user
        }),
      });
      if (!response.ok) throw new Error('Failed to create job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
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
      });
      toast({ title: "Success", description: "Job created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
    },
  });

  // Create internship mutation
  const createInternshipMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: JSON.stringify(data.skills.split(',').map((s: string) => s.trim())),
          postedBy: 1, // Default admin user
        }),
      });
      if (!response.ok) throw new Error('Failed to create internship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setInternshipForm({
        title: "",
        company: "",
        description: "",
        requirements: "",
        skills: "",
        department: "",
        duration: "",
        isPaid: false,
        stipend: "",
        location: "",
        positions: 1,
      });
      toast({ title: "Success", description: "Internship created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create internship", variant: "destructive" });
    },
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: data.skills ? JSON.stringify(data.skills.split(',').map((s: string) => s.trim())) : null,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
          postedBy: 1, // Default admin user
        }),
      });
      if (!response.ok) throw new Error('Failed to create course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setCourseForm({
        title: "",
        description: "",
        type: "course",
        instructor: "",
        duration: "",
        price: "",
        startDate: "",
        endDate: "",
        maxAttendees: "",
        location: "",
        isOnline: false,
        registrationUrl: "",
        skills: "",
        isFeatured: false,
      });
      toast({ title: "Success", description: "Course created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create course", variant: "destructive" });
    },
  });

  // CV Upload mutation
  const createCvMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'cv' && cvFile) {
          formData.append('cv', cvFile);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch('/api/cv-showcase', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create CV');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-showcase"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setCvForm({
        name: "",
        email: "",
        phone: "",
        title: "",
        section: "",
        bio: "",
        skills: "",
        experience: "",
        education: "",
        yearsOfExperience: "",
        linkedinUrl: "",
      });
      setCvFile(null);
      toast({ title: "Success", description: "CV uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload CV", variant: "destructive" });
    },
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const response = await fetch('/api/applications/' + id + '/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error('Failed to update application');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Success", description: "Application status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update application", variant: "destructive" });
    },
  });

  // Delete CV mutation
  const deleteCvMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/cv-showcase/' + id, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete CV');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-showcase"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Success", description: "CV deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete CV", variant: "destructive" });
    },
  });

  // Job approval mutations
  const approveJobMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/admin/jobs/' + id + '/approve', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Success", description: "Job approved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve job", variant: "destructive" });
    },
  });

  const rejectJobMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/admin/jobs/' + id + '/reject', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reject job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Success", description: "Job rejected successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject job", variant: "destructive" });
    },
  });

  // Community Benefits mutations
  const createBenefitMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });
      if (benefitImage) {
        formData.append('image', benefitImage);
      }

      const response = await fetch('/api/admin/community-benefits', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create benefit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community-benefits"] });
      setBenefitForm({
        title: "",
        businessName: "",
        description: "",
        discountPercentage: "",
        location: "",
        category: "",
        validUntil: "",
        showOnHomepage: false,
      });
      setBenefitImage(null);
      toast({ title: "Success", description: "Community benefit added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add community benefit", variant: "destructive" });
    },
  });

  // Delete benefit mutation
  const deleteBenefitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/admin/community-benefits/' + id, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete benefit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community-benefits"] });
      toast({ title: "Success", description: "Community benefit deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete community benefit", variant: "destructive" });
    },
  });

  // Delete email from whitelist mutation
  const deleteEmailMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/whitelist/' + id, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove email');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whitelist"] });
      toast({ title: "Success", description: "Email removed from whitelist" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove email", variant: "destructive" });
    },
  });

  // Approve access request mutation
  const approveAccessMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch('/api/access-requests/' + requestId + '/approve', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whitelist"] });
      toast({ title: "Success", description: "Access request approved and email added to whitelist" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve access request", variant: "destructive" });
    },
  });

  // Reject access request mutation
  const rejectAccessMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch('/api/access-requests/' + requestId + '/reject', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-requests"] });
      toast({ title: "Success", description: "Access request rejected" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject access request", variant: "destructive" });
    },
  });

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(jobForm);
  };

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInternshipMutation.mutate(internshipForm);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(courseForm);
  };

  const handleCvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast({ title: "Error", description: "Please select a CV file", variant: "destructive" });
      return;
    }
    createCvMutation.mutate(cvForm);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmailMutation.mutate(emailForm);
  };

  const handleBenefitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBenefitMutation.mutate(benefitForm);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      reviewed: "bg-blue-500/20 text-blue-400",
      interview: "bg-purple-500/20 text-purple-400",
      accepted: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="page-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage jobs, internships, courses, and community content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Jobs</p>
                  <p className="text-3xl font-bold text-primary">{stats?.totalJobs || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Internships</p>
                  <p className="text-3xl font-bold text-primary">{stats?.totalInternships || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Courses</p>
                  <p className="text-3xl font-bold text-primary">{stats?.totalCourses || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="access-requests" className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-muted">
            <TabsTrigger value="access-requests">Access Requests</TabsTrigger>
            <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
            <TabsTrigger value="internships">Manage Internships</TabsTrigger>
            <TabsTrigger value="courses">Manage Courses</TabsTrigger>
            <TabsTrigger value="cv-showcase">CV Showcase</TabsTrigger>
            <TabsTrigger value="benefits">Community Benefits</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Access Requests Tab */}
          <TabsContent value="access-requests" className="space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-primary" />
                  Pending Access Requests ({accessRequests.filter((req: any) => req.status === 'pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessRequests.filter((req: any) => req.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No pending access requests</p>
                    </div>
                  ) : (
                    accessRequests
                      .filter((req: any) => req.status === 'pending')
                      .map((request: any) => (
                        <div key={request.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold">{request.fullName}</h4>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              <p className="text-sm text-muted-foreground">Unit: {request.unitNumber}</p>
                              {request.mobile && (
                                <p className="text-sm text-muted-foreground">Mobile: {request.mobile}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Requested {formatDate(request.createdAt)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => {
                                  if (confirm('Approve access for ' + request.fullName + ' (' + request.email + ')?')) {
                                    approveAccessMutation.mutate(request.id);
                                  }
                                }}
                                disabled={approveAccessMutation.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
                                onClick={() => {
                                  if (confirm('Reject access request from ' + request.fullName + '?')) {
                                    rejectAccessMutation.mutate(request.id);
                                  }
                                }}
                                disabled={rejectAccessMutation.isPending}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Access Request History */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Recent Access Request History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessRequests
                    .filter((req: any) => req.status !== 'pending')
                    .slice(0, 10)
                    .map((request: any) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{request.fullName}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <Badge className={request.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New Job Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add New Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <Input
                      placeholder="Job Title"
                      value={jobForm.title}
                      onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Company"
                      value={jobForm.company}
                      onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Select value={jobForm.industry} onValueChange={(value) => setJobForm(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={jobForm.experienceLevel} onValueChange={(value) => setJobForm(prev => ({ ...prev, experienceLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry Level">Entry Level</SelectItem>
                          <SelectItem value="Mid Level">Mid Level</SelectItem>
                          <SelectItem value="Senior Level">Senior Level</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Location"
                        value={jobForm.location}
                        onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                      <Input
                        placeholder="Salary Range"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm(prev => ({ ...prev, salaryRange: e.target.value }))}
                      />
                    </div>
                    <Textarea
                      placeholder="Job Description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                    <Input
                      placeholder="Skills (comma-separated)"
                      value={jobForm.skills}
                      onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={createJobMutation.isPending}
                    >
                      {createJobMutation.isPending ? "Creating..." : "Publish Job"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Pending Jobs for Approval */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Jobs Pending Approval
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs
                      .filter((job: Job) => job.status === 'pending')
                      .slice(0, 10)
                      .map((job: Job) => (
                      <div key={job.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-muted-foreground text-sm">{job.company} • Posted {formatDate(job.createdAt!)}</p>
                            <p className="text-sm text-muted-foreground mt-1">{job.description?.substring(0, 100)}...</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => {
                                if (confirm('Approve job "' + job.title + '" from ' + job.company + '?')) {
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
                                if (confirm('Reject job "' + job.title + '"?')) {
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
                        <Badge className="bg-yellow-500/20 text-yellow-500">Pending Review</Badge>
                      </div>
                    ))}
                    {jobs.filter((job: Job) => job.status === 'pending').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No jobs pending approval</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New Internship Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add New Internship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInternshipSubmit} className="space-y-4">
                    <Input
                      placeholder="Internship Title"
                      value={internshipForm.title}
                      onChange={(e) => setInternshipForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Company"
                      value={internshipForm.company}
                      onChange={(e) => setInternshipForm(prev => ({ ...prev, company: e.target.value }))}
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Department"
                        value={internshipForm.department}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, department: e.target.value }))}
                      />
                      <Input
                        placeholder="Duration"
                        value={internshipForm.duration}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Location"
                        value={internshipForm.location}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                      <Input
                        placeholder="Number of Positions"
                        type="number"
                        value={internshipForm.positions}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, positions: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <Textarea
                      placeholder="Internship Description"
                      value={internshipForm.description}
                      onChange={(e) => setInternshipForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                    <Input
                      placeholder="Skills (comma-separated)"
                      value={internshipForm.skills}
                      onChange={(e) => setInternshipForm(prev => ({ ...prev, skills: e.target.value }))}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={internshipForm.isPaid}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, isPaid: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <label htmlFor="isPaid" className="text-sm">Paid Internship</label>
                    </div>
                    {internshipForm.isPaid && (
                      <Input
                        placeholder="Stipend Amount"
                        value={internshipForm.stipend}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, stipend: e.target.value }))}
                      />
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={createInternshipMutation.isPending}
                    >
                      {createInternshipMutation.isPending ? "Creating..." : "Publish Internship"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Internships List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                    Recent Internships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {internships.slice(0, 5).map((internship: Internship) => (
                      <div key={internship.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{internship.title}</h4>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{internship.company} • Posted {formatDate(internship.createdAt!)}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className="status-badge active">Active</Badge>
                          <Badge className={internship.isPaid ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"}>
                            {internship.isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New Course Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add New Course/Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <Input
                      placeholder="Title"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                    <Select value={courseForm.type} onValueChange={(value) => setCourseForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Instructor"
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                      />
                      <Input
                        placeholder="Duration"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Price"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                      <Input
                        placeholder="Max Attendees"
                        type="number"
                        value={courseForm.maxAttendees}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Start Date"
                        type="datetime-local"
                        value={courseForm.startDate}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                      <Input
                        placeholder="End Date"
                        type="datetime-local"
                        value={courseForm.endDate}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Location"
                      value={courseForm.location}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Input
                      placeholder="Registration URL"
                      type="url"
                      value={courseForm.registrationUrl}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, registrationUrl: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                    <Input
                      placeholder="Skills/Topics (comma-separated)"
                      value={courseForm.skills}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, skills: e.target.value }))}
                    />
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isOnline"
                          checked={courseForm.isOnline}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, isOnline: e.target.checked }))}
                          className="rounded border-border"
                        />
                        <label htmlFor="isOnline" className="text-sm">Online</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={courseForm.isFeatured}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="rounded border-border"/>
                        <label htmlFor="isFeatured" className="text-sm">Featured</label>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={createCourseMutation.isPending}
                    >
                      {createCourseMutation.isPending ? "Creating..." : "Publish Course"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Courses List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Recent Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course: Course) => (
                      <div key={course.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{course.title}</h4>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {course.type.charAt(0).toUpperCase() + course.type.slice(1)} • Posted {formatDate(course.createdAt!)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className="status-badge active">Active</Badge>
                          {course.isFeatured && (
                            <Badge className="bg-primary/20 text-primary">Featured</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CV Showcase Tab */}
          <TabsContent value="cv-showcase" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New CV Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Upload Resident CV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCvSubmit} className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={cvForm.name}
                      onChange={(e) => setCvForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={cvForm.email}
                      onChange={(e) => setCvForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Phone Number"
                        value={cvForm.phone}
                        onChange={(e) => setCvForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        placeholder="Professional Title"
                        value={cvForm.title}
                        onChange={(e) => setCvForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <Select value={cvForm.section} onValueChange={(value) => setCvForm(prev => ({ ...prev, section: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Professional Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Professional Bio"
                      value={cvForm.bio}
                      onChange={(e) => setCvForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                    <Input
                      placeholder="Skills (comma-separated)"
                      value={cvForm.skills}
                      onChange={(e) => setCvForm(prev => ({ ...prev, skills: e.target.value }))}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Years of Experience"
                        value={cvForm.yearsOfExperience}
                        onChange={(e) => setCvForm(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                      />
                      <Input
                        placeholder="LinkedIn URL (optional)"
                        value={cvForm.linkedinUrl}
                        onChange={(e) => setCvForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      />
                    </div>
                    <Textarea
                      placeholder="Work Experience"
                      value={cvForm.experience}
                      onChange={(e) => setCvForm(prev => ({ ...prev, experience: e.target.value }))}
                      rows={3}
                    />
                    <Textarea
                      placeholder="Education"
                      value={cvForm.education}
                      onChange={(e) => setCvForm(prev => ({ ...prev, education: e.target.value }))}
                      rows={2}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">CV File (PDF/Word)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={createCvMutation.isPending}
                    >
                      {createCvMutation.isPending ? "Uploading..." : "Upload CV"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CV Management */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Uploaded CVs ({cvShowcase.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cvShowcase.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No CVs uploaded yet</h3>
                        <p className="text-muted-foreground">
                          CVs uploaded by residents will appear here
                        </p>
                      </div>
                    ) : (
                      cvShowcase.map((cv: any) => (
                        <div key={cv.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{cv.name}</h4>
                              <p className="text-sm text-muted-foreground">{cv.title}</p>
                              <p className="text-xs text-muted-foreground">{cv.email}</p>
                            </div>
                            <div className="flex space-x-2">
                              {cv.cvFilePath && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-muted-foreground hover:text-primary"
                                  title="View CV"
                                  onClick={() => {
                                    if (cv.cvFilePath) {
                                      const cvUrl = cv.cvFilePath.startsWith('/uploads') 
                                        ? cv.cvFilePath 
                                        : '/uploads/' + cv.cvFilePath;
                                      window.open(cvUrl, '_blank');
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-muted-foreground hover:text-red-500"
                                title="Delete CV"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this CV?')) {
                                    deleteCvMutation.mutate(cv.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-primary/20 text-primary">{cv.section}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Uploaded {formatDate(cv.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Benefits Tab */}
          <TabsContent value="benefits" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New Benefit Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add Community Benefit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBenefitSubmit} className="space-y-4">
                    <Input 
                      placeholder="Benefit Title" 
                      value={benefitForm.title}
                      onChange={(e) => setBenefitForm(prev => ({ ...prev, title: e.target.value }))}
                      required 
                    />
                    <Input 
                      placeholder="Business Name" 
                      value={benefitForm.businessName}
                      onChange={(e) => setBenefitForm(prev => ({ ...prev, businessName: e.target.value }))}
                      required 
                    />
                    <Textarea 
                      placeholder="Description" 
                      value={benefitForm.description}
                      onChange={(e) => setBenefitForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3} 
                      required 
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Discount Percentage" 
                        value={benefitForm.discountPercentage}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                      />
                      <Input 
                        placeholder="Location" 
                        value={benefitForm.location}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Select value={benefitForm.category} onValueChange={(value) => setBenefitForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dining">Dining</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="beverages">Beverages</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        placeholder="Valid Until" 
                        type="date" 
                        value={benefitForm.validUntil}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, validUntil: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Benefit Image</Label>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setBenefitImage(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="showOnHomepage" 
                        checked={benefitForm.showOnHomepage}
                        onChange={(e) => setBenefitForm(prev => ({ ...prev, showOnHomepage: e.target.checked }))}
                      />
                      <Label htmlFor="showOnHomepage">Show on Homepage</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createBenefitMutation.isPending}
                    >
                      {createBenefitMutation.isPending ? "Adding..." : "Add Benefit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Benefits List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5 text-primary" />
                    Current Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {benefits.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No benefits added yet</p>
                    ) : (
                      benefits.map((benefit: any) => (
                        <div key={benefit.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{benefit.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={benefit.showOnHomepage ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                                {benefit.showOnHomepage ? 'On Homepage' : 'Not on Homepage'}
                              </Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteBenefitMutation.mutate(benefit.id)}
                                disabled={deleteBenefitMutation.isPending}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{benefit.businessName} • {benefit.category}</p>
                          <p className="text-sm">{benefit.description}</p>
                          {benefit.discountPercentage && (
                            <p className="text-orange-500 font-semibold mt-2">{benefit.discountPercentage} off</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add Single Email */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add Resident Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <Input
                      placeholder="Resident Email Address"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Full Name (optional)"
                      value={emailForm.name}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Notes (optional)"
                      value={emailForm.notes}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={addEmailMutation.isPending}
                    >
                      {addEmailMutation.isPending ? "Adding..." : "Add to Whitelist"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Upload Excel File */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Import Email List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6">
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <label className="block text-sm font-medium mb-2">
                          Upload Excel File (.xlsx, .csv)
                        </label>
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          className="w-full p-2 border border-border rounded-md bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Excel format: Column A = Email, Column B = Name (optional)
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">
                      Import Email List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Whitelist */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Whitelisted Residents
                  </span>
                  <Button size="sm" variant="outline">
                    Export List
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {whitelist.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No emails whitelisted yet. Add resident emails above to get started.</p>
                    </div>
                  ) : (
                    whitelist.map((email: any) => (
                      <div key={email.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-semibold">{email.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {email.name || 'No name'} • Added {new Date(email.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            if (confirm('Are you sure you want to remove ' + email.email + ' from the whitelist?')) {
                              deleteEmailMutation.mutate(email.id);
                            }
                          }}
                          disabled={deleteEmailMutation.isPending}
                        >
                          {deleteEmailMutation.isPending ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Position</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Date Applied</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application: Application) => (
                        <tr key={application.id} className="border-b border-border/50">
                          <td className="py-3 px-4">{application.applicantName}</td>
                          <td className="py-3 px-4">
                            {application.jobId ? 'Job Application' : 'Internship Application'}
                          </td>
                          <td className="py-3 px-4">
                            {application.jobId ? 'Career' : 'Internship'}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {formatDate(application.createdAt!)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={'status-badge ' + getStatusBadge(application.status)}>
                              {application.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-primary hover:text-primary/80"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-green-500 hover:text-green-400"
                                title="Accept"
                                onClick={() => updateApplicationMutation.mutate({ 
                                  id: application.id, 
                                  status: 'accepted' 
                                })}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-400"
                                title="Reject"
                                onClick={() => updateApplicationMutation.mutate({ 
                                  id: application.id, 
                                  status: 'rejected' 
                                })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}