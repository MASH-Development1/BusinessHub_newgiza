import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Briefcase, GraduationCap, BookOpen, Upload, Mail, Check, X, TrendingUp, FileText, UserPlus, Plus, Edit, Trash2, Eye, Clock, Gift, Image } from "lucide-react";
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
  const [newEmail, setNewEmail] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

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

  // Fetch data with proper error handling
  const { data: stats = {} } = useQuery({ 
    queryKey: ["/api/stats"],
    retry: false,
    enabled: false // Disable for now to avoid parsing issues
  });
  const jobsQuery = useQuery({ 
    queryKey: ["/api/jobs"],
    retry: false,
    staleTime: 0,
    queryFn: async () => {
      try {
        const response = await fetch('/api/jobs', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const text = await response.text();
        return JSON.parse(text);
      } catch (error) {
        console.error('Jobs fetch error:', error);
        return [];
      }
    }
  });
  const jobs = jobsQuery.data || [];
  const { data: internships = [] } = useQuery({ 
    queryKey: ["/api/internships"],
    retry: false,
    enabled: false // Disable for now
  });
  const { data: courses = [] } = useQuery({ 
    queryKey: ["/api/courses"],
    retry: false,
    enabled: false // Disable for now
  });
  const { data: cvShowcase = [] } = useQuery({ 
    queryKey: ["/api/cv-showcase"],
    retry: false,
    staleTime: 0
  });
  const { data: applications = [] } = useQuery({ 
    queryKey: ["/api/applications"],
    retry: false,
    staleTime: 0
  });
  const { data: whitelist = [] } = useQuery({ 
    queryKey: ["/api/whitelist"],
    retry: false,
    staleTime: 0
  });
  const { data: accessRequests = [] } = useQuery({ 
    queryKey: ["/api/access-requests"],
    retry: false,
    staleTime: 0
  });
  const { data: benefits = [] } = useQuery({ 
    queryKey: ["/api/admin/community-benefits"],
    retry: false,
    staleTime: 0
  });
  const { data: profiles = [] } = useQuery({ 
    queryKey: ["/api/profiles"],
    retry: false,
    staleTime: 0
  });

  // Job mutations
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
    }
  });

  // Approve access request mutation
  const approveAccessMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch(`/api/access-requests/${requestId}/approve`, {
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
      const response = await fetch(`/api/access-requests/${requestId}/reject`, {
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

  const approveJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', isApproved: true, isActive: true })
      });
      if (!response.ok) throw new Error('Failed to approve job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job approved and is now live!" });
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

  // Application mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (!response.ok) throw new Error('Failed to update application');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      toast({ title: "Success", description: "Application status updated!" });
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete application');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      toast({ title: "Success", description: "Application deleted successfully!" });
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

  // Whitelist mutations
  const addEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      if (!response.ok) throw new Error('Failed to add email');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      toast({ title: "Success", description: "Email added to whitelist!" });
      setNewEmail('');
    }
  });

  const removeEmailMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/whitelist/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove email');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      toast({ title: "Success", description: "Email removed from whitelist!" });
    }
  });

  const bulkUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('excel', file);
      const response = await fetch('/api/whitelist/import', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Excel upload error:', errorText);
        throw new Error('Failed to upload file');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      toast({ 
        title: "Success", 
        description: data.message || "Emails uploaded successfully!" 
      });
      setExcelFile(null);
    },
    onError: (error) => {
      console.error('Excel upload error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to upload Excel file. Please check the format and try again.",
        variant: "destructive"
      });
    }
  });

  // Community Benefits mutations with image upload
  const createBenefitMutation = useMutation({
    mutationFn: async (data: { benefitData: any; images: File[] }) => {
      const formData = new FormData();
      
      // Add benefit data
      Object.keys(data.benefitData).forEach(key => {
        const value = data.benefitData[key];
        formData.append(key, typeof value === 'boolean' ? value.toString() : value);
      });
      
      // Add images
      data.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch('/api/admin/community-benefits', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create benefit error:', errorText);
        throw new Error('Failed to create benefit');
      }
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
      setSelectedImages([]);
    },
    onError: (error) => {
      console.error('Create benefit error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to create community benefit. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteBenefitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/community-benefits/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error:', errorText);
        throw new Error('Failed to delete benefit');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community-benefits'] });
      toast({ title: "Success", description: "Community benefit deleted successfully!" });
    },
    onError: (error) => {
      console.error('Delete benefit error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete community benefit. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...filesArray].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleBenefitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBenefitMutation.mutate({
      benefitData: benefitForm,
      images: selectedImages
    });
  };

  const handleViewJobDetails = (job: any) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({ ...jobForm, status: 'approved', isActive: true });
  };

  const activateJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', isApproved: true, isActive: true })
      });
      if (!response.ok) throw new Error('Failed to activate job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Success", description: "Job approved and is now visible in careers section!" });
    }
  });

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInternshipMutation.mutate(internshipForm);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(courseForm);
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim()) {
      addEmailMutation.mutate(newEmail);
    }
  };

  const handleExcelUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (excelFile) {
      bulkUploadMutation.mutate(excelFile);
    }
  };

  const expertiseAreas = [
    "Technology/IT",
    "Software Development",
    "Data Science & Analytics",
    "Cybersecurity",
    "Digital Marketing",
    "Marketing & Advertising",
    "Social Media Management",
    "Content Creation",
    "Finance & Banking",
    "Accounting",
    "Investment & Trading",
    "Human Resources",
    "Recruitment & Talent Acquisition",
    "Sales & Business Development",
    "Customer Service",
    "Procurement & Supply Chain",
    "Operations & Logistics",
    "Project Management",
    "Legal & Compliance",
    "Healthcare & Medical",
    "Pharmaceuticals",
    "Education & Training",
    "Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Design & Creative",
    "UI/UX Design",
    "Graphic Design",
    "Architecture",
    "Consulting",
    "Management Consulting",
    "Business Strategy",
    "Real Estate",
    "Property Development",
    "Construction",
    "Manufacturing",
    "Automotive",
    "Telecommunications",
    "Media & Entertainment",
    "Tourism & Hospitality",
    "Food & Beverage",
    "Retail & E-commerce",
    "Transportation",
    "Energy & Utilities",
    "Non-Profit & NGO",
    "Government & Public Sector",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-orange-500">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(whitelist) ? whitelist.filter(email => email.isActive).length : 0}
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
                  <p className="text-sm text-muted-foreground">Jobs</p>
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
                  <p className="text-sm text-muted-foreground">Internships</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(internships) ? internships.length : 0}
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

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Access Requests</p>
                  <p className="text-2xl font-bold text-primary">
                    {Array.isArray(accessRequests) ? accessRequests.length : 0}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="matching">CV-Job Matching</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="cvs">CVs</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            <TabsTrigger value="users">Users/Directory</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Job Applications ({Array.isArray(applications) ? applications.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(applications) && applications.length > 0 ? (
                    applications.map((application: any) => (
                      <div key={application.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-semibold text-lg">{application.applicantName}</h4>
                              <Badge variant={
                                application.status === 'pending' ? "secondary" :
                                application.status === 'reviewed' ? "default" :
                                application.status === 'interview' ? "default" :
                                application.status === 'accepted' ? "default" :
                                "destructive"
                              }>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p><strong>Email:</strong> {application.applicantEmail}</p>
                                <p><strong>Phone:</strong> {application.applicantPhone || 'Not provided'}</p>
                              </div>
                              <div>
                                <p><strong>Applied:</strong> {formatDate(application.createdAt!)}</p>
                                <p><strong>Position:</strong> {application.jobTitle || 'Job ID: ' + application.jobId}</p>
                              </div>
                            </div>
                            
                            {application.coverLetter && (
                              <div className="mt-3">
                                <h5 className="font-medium text-sm mb-1">Cover Letter:</h5>
                                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded max-h-24 overflow-y-auto">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}
                            
                            {application.notes && (
                              <div className="mt-3">
                                <h5 className="font-medium text-sm mb-1">Admin Notes:</h5>
                                <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                                  {application.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            {application.cvFilePath && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const filePath = application.cvFilePath.startsWith('/uploads') 
                                    ? application.cvFilePath 
                                    : `/uploads/${application.cvFilePath}`;
                                  window.open(filePath, '_blank');
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View CV
                              </Button>
                            )}
                            
                            <div className="flex gap-1">
                              <Select
                                value={application.status}
                                onValueChange={(status) => {
                                  updateApplicationMutation.mutate({
                                    id: application.id,
                                    status: status
                                  });
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="reviewed">Reviewed</SelectItem>
                                  <SelectItem value="interview">Interview</SelectItem>
                                  <SelectItem value="accepted">Accepted</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Delete application from ${application.applicantName}?`)) {
                                    deleteApplicationMutation.mutate(application.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No applications received yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV-Job Matching Tab */}
          <TabsContent value="matching">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  CV-Job Matching ({Array.isArray(jobs) ? jobs.filter(job => job.isApproved).length : 0} Jobs • {Array.isArray(cvShowcase) ? cvShowcase.length : 0} CVs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Matching by Job */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Find Candidates for Jobs</h3>
                    <div className="space-y-4">
                      {Array.isArray(jobs) && jobs.filter(job => job.isApproved).map((job: any) => {
                        const matchingCVs = Array.isArray(cvShowcase) ? cvShowcase.filter((cv: any) => {
                          const jobSkills = job.skills ? JSON.parse(job.skills || '[]') : [];
                          const cvSkills = cv.skills ? JSON.parse(cv.skills || '[]') : [];
                          const sameIndustry = job.industry === cv.industry;
                          const skillMatch = jobSkills.some((skill: string) => 
                            cvSkills.some((cvSkill: string) => 
                              cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
                              skill.toLowerCase().includes(cvSkill.toLowerCase())
                            )
                          );
                          return sameIndustry || skillMatch;
                        }) : [];

                        return (
                          <div key={job.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{job.title}</h4>
                                <p className="text-muted-foreground">{job.company} • {job.industry}</p>
                                <p className="text-sm text-muted-foreground">Contact: {job.contactEmail}</p>
                              </div>
                              <Badge variant="secondary">
                                {matchingCVs.length} potential matches
                              </Badge>
                            </div>
                            
                            {matchingCVs.length > 0 ? (
                              <div className="space-y-2">
                                <h5 className="font-medium text-sm">Matching Candidates:</h5>
                                <div className="grid gap-2">
                                  {matchingCVs.slice(0, 3).map((cv: any) => (
                                    <div key={cv.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{cv.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {cv.currentRole} • {cv.industry} • {cv.experienceLevel}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        {cv.filePath && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(cv.filePath, '_blank')}
                                          >
                                            View CV
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          onClick={() => window.open(`mailto:${job.contactEmail}?subject=Potential Candidate: ${cv.name} for ${job.title}&body=Dear Hiring Manager,%0D%0A%0D%0AI found a potential candidate for your ${job.title} position:%0D%0A%0D%0ACandidate: ${cv.name}%0D%0ACurrent Role: ${cv.currentRole}%0D%0AIndustry: ${cv.industry}%0D%0AExperience: ${cv.experienceLevel}%0D%0A%0D%0APlease find their CV attached for your review.%0D%0A%0D%0ABest regards,%0D%0AHub Within Admin`, '_blank')}
                                        >
                                          Connect
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {matchingCVs.length > 3 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                      +{matchingCVs.length - 3} more potential matches
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                                No matching CVs found in the same industry or with related skills
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <hr />

                  {/* Matching by CV */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Find Jobs for CV Candidates</h3>
                    <div className="space-y-4">
                      {Array.isArray(cvShowcase) && cvShowcase.slice(0, 5).map((cv: any) => {
                        const matchingJobs = Array.isArray(jobs) ? jobs.filter((job: any) => {
                          if (!job.isApproved) return false;
                          const jobSkills = job.skills ? JSON.parse(job.skills || '[]') : [];
                          const cvSkills = cv.skills ? JSON.parse(cv.skills || '[]') : [];
                          const sameIndustry = job.industry === cv.industry;
                          const experienceMatch = job.experienceLevel === cv.experienceLevel;
                          const skillMatch = jobSkills.some((skill: string) => 
                            cvSkills.some((cvSkill: string) => 
                              cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
                              skill.toLowerCase().includes(cvSkill.toLowerCase())
                            )
                          );
                          return sameIndustry || experienceMatch || skillMatch;
                        }) : [];

                        return (
                          <div key={cv.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{cv.name}</h4>
                                <p className="text-muted-foreground">{cv.currentRole} • {cv.industry}</p>
                                <p className="text-sm text-muted-foreground">{cv.experienceLevel} Experience</p>
                              </div>
                              <Badge variant="secondary">
                                {matchingJobs.length} opportunities
                              </Badge>
                            </div>
                            
                            {matchingJobs.length > 0 ? (
                              <div className="space-y-2">
                                <h5 className="font-medium text-sm">Relevant Opportunities:</h5>
                                <div className="grid gap-2">
                                  {matchingJobs.slice(0, 3).map((job: any) => (
                                    <div key={job.id} className="flex justify-between items-center bg-blue-50 p-3 rounded">
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{job.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {job.company} • {job.industry} • {job.experienceLevel}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => window.open(`/careers#job-${job.id}`, '_blank')}
                                        >
                                          View Job
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => window.open(`mailto:${job.contactEmail}?subject=Interested Candidate: ${cv.name} for ${job.title}&body=Dear Hiring Manager,%0D%0A%0D%0AI have an interested candidate for your ${job.title} position:%0D%0A%0D%0ACandidate: ${cv.name}%0D%0ACurrent Role: ${cv.currentRole}%0D%0AIndustry: ${cv.industry}%0D%0AExperience: ${cv.experienceLevel}%0D%0A%0D%0AThey would be a great fit for this role. Please find their CV attached.%0D%0A%0D%0ABest regards,%0D%0AHub Within Admin`, '_blank')}
                                        >
                                          Recommend
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {matchingJobs.length > 3 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                      +{matchingJobs.length - 3} more opportunities
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                                No matching jobs found for this candidate's profile
                              </p>
                            )}
                          </div>
                        );
                      })}
                      {Array.isArray(cvShowcase) && cvShowcase.length > 5 && (
                        <p className="text-center text-muted-foreground text-sm">
                          Showing first 5 CVs. Total: {cvShowcase.length} CVs available for matching.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-primary" />
                  Pending Access Requests ({Array.isArray(accessRequests) ? accessRequests.filter((req: any) => req.status === 'pending').length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(accessRequests) && accessRequests.filter((req: any) => req.status === 'pending').length > 0 ? (
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
                                  if (confirm(`Approve access for ${request.fullName} (${request.email})?`)) {
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
                                  if (confirm(`Reject access request from ${request.fullName}?`)) {
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No pending access requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Whitelisted Users Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Whitelisted Users ({Array.isArray(whitelist) ? whitelist.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Array.isArray(whitelist) && whitelist.length > 0 ? (
                    whitelist.map((user: any) => (
                      <div key={user.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{user.name || 'Name not provided'}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.unit && (
                              <p className="text-sm text-muted-foreground">Unit: {user.unit}</p>
                            )}
                            {user.phone && (
                              <p className="text-sm text-muted-foreground">Phone: {user.phone}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Added by: {user.addedBy || 'System'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Registered: {formatDate(user.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No whitelisted users</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab with Photo Upload */}
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
                  <form onSubmit={handleBenefitSubmit} className="space-y-4">
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
                        <div className="relative">
                          <Input
                            id="discount"
                            placeholder="e.g. 20"
                            value={benefitForm.discountPercentage.replace('%', '')}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setBenefitForm(prev => ({ ...prev, discountPercentage: value ? `${value}%` : '' }));
                            }}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        </div>
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
                            <SelectItem value="Restaurants & Cafes">Restaurants & Cafes</SelectItem>
                            <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                            <SelectItem value="Medical & Healthcare">Medical & Healthcare</SelectItem>
                            <SelectItem value="Beauty & Spa">Beauty & Spa</SelectItem>
                            <SelectItem value="Shopping & Retail">Shopping & Retail</SelectItem>
                            <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                            <SelectItem value="Electronics & Technology">Electronics & Technology</SelectItem>
                            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                            <SelectItem value="Automotive">Automotive</SelectItem>
                            <SelectItem value="Professional Services">Professional Services</SelectItem>
                            <SelectItem value="Legal & Financial">Legal & Financial</SelectItem>
                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                            <SelectItem value="Education & Training">Education & Training</SelectItem>
                            <SelectItem value="Entertainment & Recreation">Entertainment & Recreation</SelectItem>
                            <SelectItem value="Sports & Activities">Sports & Activities</SelectItem>
                            <SelectItem value="Travel & Tourism">Travel & Tourism</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Childcare & Family">Childcare & Family</SelectItem>
                            <SelectItem value="Pet Services">Pet Services</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <Label htmlFor="images">Upload Images (Max 5)</Label>
                      <div className="mt-2">
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="mb-4"
                        />
                        
                        {selectedImages.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Selected Images:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {selectedImages.map((image, index) => (
                                <div key={index} className="relative">
                                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img 
                                      src={URL.createObjectURL(image)} 
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <p className="text-xs text-center mt-1 truncate">{image.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                            <div className="flex-1">
                              <h4 className="font-semibold">{benefit.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefit.businessName}</p>
                              <p className="text-xs text-muted-foreground">Added {formatDate(benefit.createdAt!)}</p>
                              
                              {/* Display images if available */}
                              {benefit.imageUrls && benefit.imageUrls.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground mb-1">Images:</p>
                                  <div className="flex gap-1">
                                    {benefit.imageUrls.slice(0, 3).map((url: string, index: number) => (
                                      <div key={index} className="w-8 h-8 rounded overflow-hidden">
                                        <img src={url} alt={`Benefit ${index + 1}`} className="w-full h-full object-cover" />
                                      </div>
                                    ))}
                                    {benefit.imageUrls.length > 3 && (
                                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-xs">+{benefit.imageUrls.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
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

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input
                          id="job-title"
                          placeholder="e.g. Software Engineer"
                          value={jobForm.title}
                          onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="job-company">Company</Label>
                        <Input
                          id="job-company"
                          placeholder="Company name"
                          value={jobForm.company}
                          onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="job-description">Description</Label>
                      <Textarea
                        id="job-description"
                        placeholder="Job description and requirements..."
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="job-location">Location</Label>
                        <Input
                          id="job-location"
                          placeholder="e.g. Cairo, Egypt"
                          value={jobForm.location}
                          onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="job-industry">Industry</Label>
                        <Select value={jobForm.industry} onValueChange={(value) => setJobForm(prev => ({ ...prev, industry: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.map(area => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="job-experience">Experience Level</Label>
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job-skills">Required Skills</Label>
                        <Input
                          id="job-skills"
                          placeholder="e.g. React, TypeScript, Node.js"
                          value={jobForm.skills}
                          onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="job-salary">Salary Range</Label>
                        <Input
                          id="job-salary"
                          placeholder="e.g. 15,000 - 25,000 EGP"
                          value={jobForm.salaryRange}
                          onChange={(e) => setJobForm(prev => ({ ...prev, salaryRange: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createJobMutation.isPending}>
                      {createJobMutation.isPending ? "Adding..." : "Add Job"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Current Jobs ({Array.isArray(jobs) ? jobs.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(jobs) && jobs.length > 0 ? (
                      jobs.map((job: any) => (
                        <div key={job.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                              <p className="text-xs text-muted-foreground">Posted {formatDate(job.createdAt!)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={job.status === 'pending' ? "secondary" : job.isActive ? "default" : "destructive"}>
                                {job.status || (job.isActive ? "Active" : "Inactive")}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                                onClick={() => handleViewJobDetails(job)}
                                title="View Full Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {job.status === 'pending' && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                                    onClick={() => approveJobMutation.mutate(job.id)}
                                    disabled={approveJobMutation.isPending}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => rejectJobMutation.mutate(job.id)}
                                    disabled={rejectJobMutation.isPending}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              {!job.isActive && job.status !== 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                                  onClick={() => activateJobMutation.mutate(job.id)}
                                  disabled={activateJobMutation.isPending}
                                  title="Activate Job"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                                onClick={() => {
                                  if (confirm(`Delete "${job.title}" job?`)) {
                                    deleteJobMutation.mutate(job.id);
                                  }
                                }}
                                disabled={deleteJobMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {job.location && (
                            <Badge variant="outline" className="text-xs">{job.location}</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No jobs posted yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Internship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInternshipSubmit} className="space-y-4">
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
                        placeholder="Internship description and requirements..."
                        value={internshipForm.description}
                        onChange={(e) => setInternshipForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="internship-department">Department</Label>
                        <Select value={internshipForm.department} onValueChange={(value) => setInternshipForm(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.map(area => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="internship-duration">Duration</Label>
                        <Input
                          id="internship-duration"
                          placeholder="e.g. 3 months"
                          value={internshipForm.duration}
                          onChange={(e) => setInternshipForm(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createInternshipMutation.isPending}>
                      {createInternshipMutation.isPending ? "Adding..." : "Add Internship"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

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
                      internships.map((internship: any) => (
                        <div key={internship.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{internship.title}</h4>
                              <p className="text-sm text-muted-foreground">{internship.company}</p>
                              <p className="text-xs text-muted-foreground">Posted {formatDate(internship.createdAt!)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={internship.isActive ? "default" : "secondary"}>
                                {internship.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
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
                          </div>
                          <div className="flex gap-2">
                            {internship.department && (
                              <Badge variant="outline" className="text-xs">{internship.department}</Badge>
                            )}
                            {internship.duration && (
                              <Badge variant="outline" className="text-xs">{internship.duration}</Badge>
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

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="course-title">Course Title</Label>
                        <Input
                          id="course-title"
                          placeholder="e.g. Digital Marketing Fundamentals"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-instructor">Instructor</Label>
                        <Input
                          id="course-instructor"
                          placeholder="Instructor name"
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="course-description">Description</Label>
                      <Textarea
                        id="course-description"
                        placeholder="Course description and what students will learn..."
                        value={courseForm.description}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="course-type">Course Type</Label>
                        <Select value={courseForm.type} onValueChange={(value) => setCourseForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="In-Person">In-Person</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course-duration">Duration</Label>
                        <Input
                          id="course-duration"
                          placeholder="e.g. 8 weeks"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createCourseMutation.isPending}>
                      {createCourseMutation.isPending ? "Adding..." : "Add Course"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

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
                      courses.map((course: any) => (
                        <div key={course.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                              <p className="text-xs text-muted-foreground">Added {formatDate(course.createdAt!)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={course.isActive ? "default" : "secondary"}>
                                {course.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
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
                          </div>
                          <div className="flex gap-2">
                            {course.type && (
                              <Badge variant="outline" className="text-xs">{course.type}</Badge>
                            )}
                            {course.duration && (
                              <Badge variant="outline" className="text-xs">{course.duration}</Badge>
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

          {/* CVs Tab */}
          <TabsContent value="cvs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  CV Showcase Management ({Array.isArray(cvShowcase) ? cvShowcase.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(cvShowcase) && cvShowcase.length > 0 ? (
                    cvShowcase.map((cv: any) => (
                      <div key={cv.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{cv.name}</h4>
                            <p className="text-sm text-muted-foreground">{cv.title}</p>
                            <p className="text-xs text-muted-foreground">Section: {cv.section}</p>
                            <p className="text-xs text-muted-foreground">Uploaded {formatDate(cv.createdAt!)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => window.open(cv.cvUrl, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                if (confirm(`Delete CV for "${cv.name}"?`)) {
                                  deleteCvMutation.mutate(cv.id);
                                }
                              }}
                              disabled={deleteCvMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          {cv.skills && (
                            <Badge variant="outline" className="text-xs">{cv.skills}</Badge>
                          )}
                          {cv.experienceLevel && (
                            <Badge variant="outline" className="text-xs">{cv.experienceLevel}</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No CVs uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Email Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add Email to Whitelist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddEmail} className="space-y-4">
                    <div>
                      <Label htmlFor="new-email">Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="user@example.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={addEmailMutation.isPending}>
                      {addEmailMutation.isPending ? "Adding..." : "Add Email"}
                    </Button>
                  </form>

                  {/* Excel Upload Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Bulk Upload from Excel</h4>
                    <form onSubmit={handleExcelUpload} className="space-y-4">
                      <div>
                        <Label htmlFor="excel-file">Upload Excel File</Label>
                        <Input
                          id="excel-file"
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: .xlsx, .xls, .csv. First column should contain email addresses.
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={!excelFile || bulkUploadMutation.isPending}
                      >
                        {bulkUploadMutation.isPending ? "Uploading..." : "Upload Excel File"}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>

              {/* Current Whitelist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Current Whitelist ({Array.isArray(whitelist) ? whitelist.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(whitelist) && whitelist.length > 0 ? (
                      whitelist.map((email: any) => (
                        <div key={email.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{email.email}</p>
                              <p className="text-xs text-muted-foreground">Added {formatDate(email.createdAt!)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={email.isActive ? "default" : "secondary"}>
                                {email.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                                onClick={() => {
                                  if (confirm(`Remove "${email.email}" from whitelist?`)) {
                                    removeEmailMutation.mutate(email.id);
                                  }
                                }}
                                disabled={removeEmailMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No emails in whitelist</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users/Directory Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Directory Management ({Array.isArray(profiles) ? profiles.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(profiles) && profiles.length > 0 ? (
                    profiles.map((profile: any) => (
                      <div key={profile.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{profile.name}</h4>
                            <p className="text-sm text-muted-foreground">{profile.title} at {profile.company}</p>
                            <p className="text-xs text-muted-foreground">{profile.email}</p>
                            <p className="text-xs text-muted-foreground">Joined {formatDate(profile.createdAt!)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{profile.sector}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                if (confirm(`Delete profile for "${profile.name}"?`)) {
                                  deleteProfileMutation.mutate(profile.id);
                                }
                              }}
                              disabled={deleteProfileMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No profiles in directory</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
              <DialogDescription>
                Complete job details for admin review
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <p><strong>Company:</strong> {selectedJob.company}</p>
                    <p><strong>Job Poster:</strong> {selectedJob.jobPoster || 'Not specified'}</p>
                    <p><strong>Location:</strong> {selectedJob.location || 'Not specified'}</p>
                    <p><strong>Industry:</strong> {selectedJob.industry || 'Not specified'}</p>
                    <p><strong>Experience Level:</strong> {selectedJob.experienceLevel || 'Not specified'}</p>
                    <p><strong>Job Type:</strong> {selectedJob.jobType || 'Not specified'}</p>
                    <p><strong>Salary Range:</strong> {selectedJob.salaryRange || 'Not specified'}</p>
                    <p><strong>Posted:</strong> {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {selectedJob.contactEmail || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {selectedJob.contactPhone || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Status</h3>
                  <div className="flex gap-2">
                    <Badge variant={selectedJob.status === 'pending' ? "secondary" : selectedJob.isActive ? "default" : "destructive"}>
                      {selectedJob.status || (selectedJob.isActive ? "Active" : "Inactive")}
                    </Badge>
                    {selectedJob.isApproved && <Badge variant="outline">Approved</Badge>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedJob.description || 'No description provided'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedJob.requirements || 'No requirements specified'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedJob.skills || 'No skills specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedJob.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    approveJobMutation.mutate(selectedJob.id);
                    setIsJobDetailOpen(false);
                  }}
                  disabled={approveJobMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Job
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm(`Are you sure you want to reject "${selectedJob.title}"?`)) {
                      rejectJobMutation.mutate(selectedJob.id);
                      setIsJobDetailOpen(false);
                    }
                  }}
                  disabled={rejectJobMutation.isPending}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Job
                </Button>
              </div>
            )}

            {!selectedJob.isActive && selectedJob.status !== 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    activateJobMutation.mutate(selectedJob.id);
                    setIsJobDetailOpen(false);
                  }}
                  disabled={activateJobMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Activate Job
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}