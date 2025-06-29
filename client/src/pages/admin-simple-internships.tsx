import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Check, X, Clock, Calendar, MapPin, DollarSign, Phone, Mail } from "lucide-react";

interface Internship {
  id: number;
  title: string;
  company: string;
  posterEmail: string;
  posterRole: string;
  description: string;
  requirements?: string;
  skills?: string;
  department?: string;
  duration: string;
  isPaid: boolean;
  stipend?: string;
  location?: string;
  positions: number;
  contactEmail: string;
  contactPhone?: string;
  startDate?: string;
  applicationDeadline?: string;
  isActive: boolean;
  isApproved: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSimpleInternships() {
  const { toast } = useToast();
  const [manualData, setManualData] = useState<Internship[]>([]);
  const [manualLoading, setManualLoading] = useState(true);

  // Manual fetch to bypass React Query issues
  const fetchPendingInternships = async () => {
    try {
      setManualLoading(true);
      console.log('Fetching pending internships manually...');
      const response = await fetch('/api/admin/internships/pending', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Manual fetch result:', data);
      setManualData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Manual fetch error:', error);
      setManualData([]);
    } finally {
      setManualLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingInternships();
  }, []);

  const { data: pendingInternships = [], isLoading, refetch } = useQuery<Internship[]>({
    queryKey: ["/api/admin/internships/pending"],
  });

  // Use manual data if React Query fails
  const finalData = pendingInternships.length > 0 ? pendingInternships : manualData;
  const finalLoading = isLoading && manualLoading;

  const approveMutation = useMutation({
    mutationFn: async (internshipId: number) => {
      const response = await fetch(`/api/admin/internships/${internshipId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to approve internship");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship approved successfully",
      });
      refetch();
      fetchPendingInternships(); // Refresh manual data
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve internship",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (internshipId: number) => {
      const response = await fetch(`/api/admin/internships/${internshipId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to reject internship");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship rejected",
      });
      refetch();
      fetchPendingInternships(); // Refresh manual data
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject internship",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (finalLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading pending internships...</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Final data to render:', finalData);
  console.log('Final data length:', finalData.length);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pending Internships Review</h1>
          <p className="text-gray-300">Review and approve internship submissions from community members</p>
          <div className="mt-4">
            <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-600">
              <Clock className="w-4 h-4 mr-1" />
              {finalData.length} Pending Review
            </Badge>
          </div>
        </div>

        {finalData.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700 text-center py-12">
            <CardContent>
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Pending Internships</h3>
              <p className="text-gray-400">All internship submissions have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {finalData.map((internship: Internship) => (
              <Card key={internship.id} className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">{internship.title}</CardTitle>
                      <p className="text-orange-400 text-lg mt-1">{internship.company}</p>
                      <p className="text-gray-400 text-sm mt-1">Posted by: {internship.posterRole} ({internship.posterEmail})</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <p className="text-xs text-gray-500">Submitted: {formatDate(internship.createdAt)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Description</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{internship.description}</p>
                  </div>

                  {internship.requirements && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Requirements</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{internship.requirements}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>{internship.duration}</span>
                    </div>
                    {internship.department && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="w-4 h-4 text-orange-400">🏢</span>
                        <span>{internship.department}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4 text-orange-400" />
                      <span>{internship.isPaid ? (internship.stipend || 'Paid') : 'Unpaid'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-4 h-4 text-orange-400">👥</span>
                      <span>{internship.positions} position{internship.positions !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-orange-400" />
                      <span>{internship.contactEmail}</span>
                    </div>
                    {internship.contactPhone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-orange-400" />
                        <span>{internship.contactPhone}</span>
                      </div>
                    )}
                  </div>

                  {internship.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span>{internship.location}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => approveMutation.mutate(internship.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rejectMutation.mutate(internship.id)}
                      disabled={rejectMutation.isPending}
                      className="border-red-500 text-red-400 hover:bg-red-900 flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-900"
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}