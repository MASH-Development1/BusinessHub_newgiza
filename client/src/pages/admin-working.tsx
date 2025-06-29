import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Trash2, Check, X, Upload, Download, Eye, Plus, Users, FileText, 
  Target, BookOpen, Mail, Settings, Building, Calendar, MapPin,
  DollarSign, Phone, User, Briefcase, GraduationCap
} from "lucide-react";

export default function AdminWorking() {
  // Fetch data using individual state management to avoid parsing conflicts
  const [jobs, setJobs] = useState<any[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [whitelist, setWhitelist] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [jobForm, setJobForm] = useState({
    title: '', company: '', description: '', requirements: '', skills: '',
    industry: '', experienceLevel: '', jobType: '', location: '', salaryRange: '',
    contactEmail: '', contactPhone: ''
  });

  const [benefitForm, setBenefitForm] = useState({
    title: '', description: '', businessName: '', location: '', discountPercentage: '',
    category: '', validUntil: '', isActive: true, showOnHomepage: false
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newEmail, setNewEmail] = useState('');

  // Fetch all data with proper error handling
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs
      try {
        const jobsRes = await fetch('/api/jobs', { credentials: 'include' });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        }
      } catch (e) {
        console.error('Jobs fetch error:', e);
        setJobs([]);
      }

      // Fetch CVs
      try {
        const cvsRes = await fetch('/api/cv-showcase', { credentials: 'include' });
        if (cvsRes.ok) {
          const cvsData = await cvsRes.json();
          setCvs(Array.isArray(cvsData) ? cvsData : []);
        }
      } catch (e) {
        console.error('CVs fetch error:', e);
        setCvs([]);
      }

      // Fetch other data
      const endpoints = [
        { url: '/api/applications', setter: setApplications },
        { url: '/api/whitelist', setter: setWhitelist },
        { url: '/api/access-requests', setter: setAccessRequests },
        { url: '/api/admin/community-benefits', setter: setBenefits },
        { url: '/api/profiles', setter: setProfiles }
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint.url, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            endpoint.setter(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error(`${endpoint.url} fetch error:`, e);
          endpoint.setter([]);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Job management functions
  const approveJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job approved successfully" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve job", variant: "destructive" });
    }
  };

  const rejectJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job rejected successfully" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject job", variant: "destructive" });
    }
  };

  const createJob = async () => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      });
      if (response.ok) {
        toast({ title: "Success", description: "Job created successfully" });
        setJobForm({
          title: '', company: '', description: '', requirements: '', skills: '',
          industry: '', experienceLevel: '', jobType: '', location: '', salaryRange: '',
          contactEmail: '', contactPhone: ''
        });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
    }
  };

  // Whitelist management
  const addToWhitelist = async () => {
    if (!newEmail) return;
    try {
      const response = await fetch('/api/whitelist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });
      if (response.ok) {
        toast({ title: "Success", description: "Email added to whitelist" });
        setNewEmail('');
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add email", variant: "destructive" });
    }
  };

  const removeFromWhitelist = async (id: number) => {
    try {
      const response = await fetch(`/api/whitelist/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Email removed from whitelist" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove email", variant: "destructive" });
    }
  };

  // Access request management
  const approveAccess = async (id: number) => {
    try {
      const response = await fetch(`/api/access-requests/${id}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Access request approved" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve access", variant: "destructive" });
    }
  };

  const rejectAccess = async (id: number) => {
    try {
      const response = await fetch(`/api/access-requests/${id}/reject`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Access request rejected" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject access", variant: "destructive" });
    }
  };

  // Community benefits management
  const createBenefit = async () => {
    try {
      const formData = new FormData();
      Object.keys(benefitForm).forEach(key => {
        const value = benefitForm[key as keyof typeof benefitForm];
        formData.append(key, typeof value === 'boolean' ? value.toString() : value);
      });
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch('/api/admin/community-benefits', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (response.ok) {
        toast({ title: "Success", description: "Community benefit created successfully" });
        setBenefitForm({
          title: '', description: '', businessName: '', location: '', discountPercentage: '',
          category: '', validUntil: '', isActive: true, showOnHomepage: false
        });
        setSelectedImages([]);
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create benefit", variant: "destructive" });
    }
  };

  const deleteBenefit = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/community-benefits/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        toast({ title: "Success", description: "Benefit deleted successfully" });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete benefit", variant: "destructive" });
    }
  };

  const pendingJobs = jobs.filter(job => job.status === 'pending' || !job.isApproved);
  const pendingRequests = accessRequests.filter(req => req.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={fetchAllData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CVs Uploaded</p>
                  <p className="text-2xl font-bold text-gray-900">{cvs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Directory Profiles</p>
                  <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="jobs">Jobs ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="cvs">CVs ({cvs.length})</TabsTrigger>
            <TabsTrigger value="directory">Directory ({profiles.length})</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist ({whitelist.length})</TabsTrigger>
            <TabsTrigger value="access">Access ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="benefits">Benefits ({benefits.length})</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Jobs ({pendingJobs.length})</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Job</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            value={jobForm.title}
                            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={jobForm.company}
                            onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={jobForm.description}
                            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="requirements">Requirements</Label>
                          <Textarea
                            id="requirements"
                            value={jobForm.requirements}
                            onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select value={jobForm.industry} onValueChange={(value) => setJobForm({ ...jobForm, industry: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experienceLevel">Experience Level</Label>
                          <Select value={jobForm.experienceLevel} onValueChange={(value) => setJobForm({ ...jobForm, experienceLevel: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Entry Level">Entry Level</SelectItem>
                              <SelectItem value="Mid Level">Mid Level</SelectItem>
                              <SelectItem value="Senior Level">Senior Level</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={jobForm.contactEmail}
                            onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={createJob} className="w-full">
                        Create Job
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending jobs</p>
                ) : (
                  <div className="space-y-4">
                    {pendingJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{job.status || 'pending'}</Badge>
                              {job.industry && <Badge variant="outline">{job.industry}</Badge>}
                              {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => approveJob(job.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => rejectJob(job.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {job.description}
                        </p>
                        {job.location && (
                          <p className="text-xs text-gray-500 mt-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {job.location}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CVs Tab */}
          <TabsContent value="cvs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CV Showcase ({cvs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {cvs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No CVs uploaded</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cvs.map((cv) => (
                      <div key={cv.id} className="border rounded-lg p-4 bg-white">
                        <h3 className="font-semibold text-gray-900">{cv.name}</h3>
                        <p className="text-sm text-gray-600">{cv.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{cv.section}</p>
                        <p className="text-sm text-gray-500">{cv.experience}</p>
                        {cv.skills && (
                          <p className="text-xs text-gray-400 mt-2">Skills: {cv.skills}</p>
                        )}
                        {cv.cvFileName && (
                          <div className="mt-3">
                            <a
                              href={`/api/cv-showcase/${cv.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View CV
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Directory Profiles ({profiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {profiles.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No profiles in directory</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="border rounded-lg p-4 bg-white">
                        <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                        {profile.company && <p className="text-sm text-gray-500">{profile.company}</p>}
                        {profile.position && <p className="text-sm text-gray-500">{profile.position}</p>}
                        {profile.industry && (
                          <Badge variant="outline" className="mt-2">{profile.industry}</Badge>
                        )}
                        {profile.cvFileName && (
                          <div className="mt-2">
                            <a
                              href={`/api/profiles/${profile.id}/download-cv`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View CV
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Whitelist Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToWhitelist()}
                  />
                  <Button onClick={addToWhitelist}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                {whitelist.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No emails in whitelist</p>
                ) : (
                  <div className="space-y-2">
                    {whitelist.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                        <div>
                          <p className="font-medium">{item.email}</p>
                          <p className="text-sm text-gray-500">
                            Added: {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeFromWhitelist(item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Requests ({pendingRequests.length} pending)</CardTitle>
              </CardHeader>
              <CardContent>
                {accessRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No access requests</p>
                ) : (
                  <div className="space-y-4">
                    {accessRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{request.fullName}</h3>
                            <p className="text-sm text-gray-600">{request.email}</p>
                            <p className="text-sm text-gray-500">Unit: {request.unitNumber}</p>
                            {request.mobile && <p className="text-sm text-gray-500">Mobile: {request.mobile}</p>}
                            <p className="text-xs text-gray-400 mt-2">
                              Requested: {new Date(request.requestedAt).toLocaleString()}
                            </p>
                            <Badge variant={request.status === 'pending' ? 'secondary' : 'outline'} className="mt-2">
                              {request.status}
                            </Badge>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => approveAccess(request.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Community Benefits ({benefits.length})</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Benefit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Community Benefit</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="benefitTitle">Title</Label>
                          <Input
                            id="benefitTitle"
                            value={benefitForm.title}
                            onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            value={benefitForm.businessName}
                            onChange={(e) => setBenefitForm({ ...benefitForm, businessName: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="benefitDescription">Description</Label>
                          <Textarea
                            id="benefitDescription"
                            value={benefitForm.description}
                            onChange={(e) => setBenefitForm({ ...benefitForm, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="discount">Discount Percentage</Label>
                          <Input
                            id="discount"
                            value={benefitForm.discountPercentage}
                            onChange={(e) => setBenefitForm({ ...benefitForm, discountPercentage: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="benefitLocation">Location</Label>
                          <Input
                            id="benefitLocation"
                            value={benefitForm.location}
                            onChange={(e) => setBenefitForm({ ...benefitForm, location: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="images">Images</Label>
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files) {
                                setSelectedImages(Array.from(e.target.files));
                              }
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isActive"
                            checked={benefitForm.isActive}
                            onCheckedChange={(checked) => setBenefitForm({ ...benefitForm, isActive: !!checked })}
                          />
                          <Label htmlFor="isActive">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showOnHomepage"
                            checked={benefitForm.showOnHomepage}
                            onCheckedChange={(checked) => setBenefitForm({ ...benefitForm, showOnHomepage: !!checked })}
                          />
                          <Label htmlFor="showOnHomepage">Show on Homepage</Label>
                        </div>
                      </div>
                      <Button onClick={createBenefit} className="w-full">
                        Create Benefit
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {benefits.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No community benefits</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {benefits.map((benefit) => (
                      <div key={benefit.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                          <Button
                            onClick={() => deleteBenefit(benefit.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">{benefit.businessName}</p>
                        {benefit.discountPercentage && (
                          <p className="text-sm text-green-600 font-medium">{benefit.discountPercentage}% discount</p>
                        )}
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{benefit.description}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant={benefit.isActive ? 'default' : 'secondary'}>
                            {benefit.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {benefit.showOnHomepage && (
                            <Badge variant="outline">Homepage</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}