import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Trash2, Check, X, Eye, Plus, Users, FileText, 
  Mail, Briefcase, MapPin, Building
} from "lucide-react";

export default function AdminSimple() {
  const [jobs, setJobs] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');

  // Fetch all data safely without React Query to avoid parsing issues
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch each endpoint individually with error handling
      const endpoints = [
        { url: '/api/jobs', setter: setJobs },
        { url: '/api/cv-showcase', setter: setCvs },
        { url: '/api/whitelist', setter: setWhitelist },
        { url: '/api/access-requests', setter: setAccessRequests },
        { url: '/api/admin/community-benefits', setter: setBenefits },
        { url: '/api/profiles', setter: setProfiles }
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, { 
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            const text = await response.text();
            const data = JSON.parse(text);
            endpoint.setter(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint.url}:`, error);
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
  const approveJob = async (jobId) => {
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

  const rejectJob = async (jobId) => {
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

  const removeFromWhitelist = async (id) => {
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
  const approveAccess = async (id) => {
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

  const rejectAccess = async (id) => {
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
                  <p className="text-sm font-medium text-gray-600">Pending Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CVs</p>
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
                  <p className="text-sm font-medium text-gray-600">Directory</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Access</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">Jobs ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="cvs">CVs ({cvs.length})</TabsTrigger>
            <TabsTrigger value="directory">Directory ({profiles.length})</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist ({whitelist.length})</TabsTrigger>
            <TabsTrigger value="access">Access ({pendingRequests.length})</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Jobs ({pendingJobs.length})</CardTitle>
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
        </Tabs>
      </div>
    </div>
  );
}