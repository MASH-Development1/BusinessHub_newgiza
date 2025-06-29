import { useState, useEffect } from "react";
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
import { Trash2, Check, X, Upload, Download, Eye, Plus, Users, FileText, Target, BookOpen, Mail, Settings } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  status: string;
  isApproved: boolean;
  requirements?: string;
  skills?: string;
  industry?: string;
  experienceLevel?: string;
  jobType?: string;
  location?: string;
  salaryRange?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface CV {
  id: number;
  name: string;
  email: string;
  section: string;
  experience: string;
  cvFileName?: string;
  skills?: string;
  description?: string;
}

interface Internship {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string;
  skills: string;
  department: string;
  duration: string;
  location: string;
  isActive: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: string;
  type: string;
  isActive: boolean;
}

interface WhitelistEmail {
  id: number;
  email: string;
  addedAt: string;
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
  imageUrls?: string[];
}

interface Profile {
  id: number;
  name: string;
  email: string;
  company?: string;
  position?: string;
  industry?: string;
  experienceLevel?: string;
  skills?: string;
  cvFileName?: string;
}

export default function AdminClean() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data using basic fetch to avoid parsing issues
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs
      const jobsResponse = await fetch('/api/jobs', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (jobsResponse.ok) {
        const jobsText = await jobsResponse.text();
        try {
          const jobsData = JSON.parse(jobsText);
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        } catch (e) {
          console.error('Jobs parsing error:', e);
          setJobs([]);
        }
      }

      // Fetch CVs
      const cvsResponse = await fetch('/api/cv-showcase', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (cvsResponse.ok) {
        const cvsText = await cvsResponse.text();
        try {
          const cvsData = JSON.parse(cvsText);
          setCvs(Array.isArray(cvsData) ? cvsData : []);
        } catch (e) {
          console.error('CVs parsing error:', e);
          setCvs([]);
        }
      }

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve job
  const approveJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job approved successfully"
        });
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to approve job');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve job",
        variant: "destructive"
      });
    }
  };

  // Reject job
  const rejectJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job rejected successfully"
        });
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to reject job');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject job",
        variant: "destructive"
      });
    }
  };

  const pendingJobs = jobs.filter(job => job.status === 'pending' || !job.isApproved);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Pending Jobs Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Jobs ({pendingJobs.length})</span>
              <Button onClick={fetchData} variant="outline" size="sm">
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending jobs</p>
            ) : (
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <Badge variant="secondary" className="mt-1">
                          {job.status || 'pending'}
                        </Badge>
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CVs Section */}
        <Card>
          <CardHeader>
            <CardTitle>CV Showcase ({cvs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {cvs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No CVs uploaded</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvs.map((cv) => (
                  <div key={cv.id} className="border rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-gray-900">{cv.name}</h3>
                    <p className="text-sm text-gray-600">{cv.email}</p>
                    <p className="text-sm text-gray-500 mt-1">{cv.section}</p>
                    <p className="text-sm text-gray-500">{cv.experience}</p>
                    {cv.cvFileName && (
                      <div className="mt-2">
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
      </div>
    </div>
  );
}