import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Check, X, Eye, Clock, Users, DollarSign, Calendar, MapPin, Edit, Trash2 } from "lucide-react";

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
  postedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInternships() {
  const { toast } = useToast();
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Internship>>({});

  const { data: allInternships = [], isLoading: loadingAll } = useQuery({
    queryKey: ["/api/admin/internships"],
  });

  const { data: pendingInternships = [], isLoading: loadingPending } = useQuery({
    queryKey: ["/api/admin/internships/pending"],
  });

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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship approved successfully",
      });
      setSelectedInternship(null);
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship rejected",
      });
      setSelectedInternship(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject internship",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Internship> }) => {
      const response = await fetch(`/api/admin/internships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update internship");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship updated successfully",
      });
      setShowEdit(false);
      setEditFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update internship",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (internshipId: number) => {
      const response = await fetch(`/api/admin/internships/${internshipId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete internship");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/internships/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      toast({
        title: "Success",
        description: "Internship deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete internship",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (status === "pending") return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    if (status === "approved" || isApproved) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
    if (status === "rejected") return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
    return <Badge variant="outline">Unknown</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InternshipCard = ({ internship, showActions = false }: { internship: Internship; showActions?: boolean }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{internship.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{internship.company}</p>
          </div>
          {getStatusBadge(internship.status, internship.isApproved)}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {internship.posterRole}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {internship.duration}
          </span>
          {internship.isPaid && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {internship.stipend || "Paid"}
            </span>
          )}
          {internship.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {internship.location}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3 line-clamp-3">{internship.description}</p>
        
        {internship.department && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Industry:</strong> {internship.department}
          </p>
        )}
        
        {internship.skills && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Skills:</strong> {internship.skills}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <p>Posted by: {internship.posterEmail}</p>
            <p>{formatDate(internship.createdAt)}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedInternship(internship)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            
            {showActions && internship.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => approveMutation.mutate(internship.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectMutation.mutate(internship.id)}
                  disabled={rejectMutation.isPending}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {/* Edit and Delete buttons for all internships */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditFormData(internship);
                setShowEdit(true);
              }}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to delete this internship?")) {
                  deleteMutation.mutate(internship.id);
                }
              }}
              disabled={deleteMutation.isPending}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const InternshipDetails = ({ internship }: { internship: Internship }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
              <p className="text-lg text-gray-600">{internship.company}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(internship.status, internship.isApproved)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInternship(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{internship.description}</p>
            </div>

            {internship.requirements && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{internship.requirements}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-gray-900">{internship.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Positions Available</p>
                <p className="text-gray-900">{internship.positions}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compensation</p>
                <p className="text-gray-900">{internship.isPaid ? (internship.stipend || "Paid") : "Unpaid"}</p>
              </div>
              {internship.department && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Industry</p>
                  <p className="text-gray-900">{internship.department}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
              <div className="space-y-1">
                <p className="text-sm"><strong>Poster:</strong> {internship.posterEmail} ({internship.posterRole})</p>
                <p className="text-sm"><strong>Contact:</strong> {internship.contactEmail}</p>
                {internship.contactPhone && (
                  <p className="text-sm"><strong>Phone:</strong> {internship.contactPhone}</p>
                )}
              </div>
            </div>

            {internship.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => approveMutation.mutate(internship.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Internship
                </Button>
                <Button
                  variant="outline"
                  onClick={() => rejectMutation.mutate(internship.id)}
                  disabled={rejectMutation.isPending}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Internship
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Internship Management</h1>
        <p className="text-gray-600">Review and manage internship submissions from community members</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Review ({pendingInternships.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Internships ({allInternships.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loadingPending ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading pending internships...</p>
            </div>
          ) : pendingInternships.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Internships</h3>
                <p className="text-gray-600">All internship submissions have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingInternships.map((internship: Internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loadingAll ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading all internships...</p>
            </div>
          ) : allInternships.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internships Found</h3>
                <p className="text-gray-600">No internship submissions have been received yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allInternships.map((internship: Internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedInternship && (
        <InternshipDetails internship={selectedInternship} />
      )}
    </div>
  );
}