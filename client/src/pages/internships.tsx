import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Search, 
  Filter,
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Eye,
  Mail,
  Phone,
  FileText,
  X
} from "lucide-react";

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

export default function Internships() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const [applicationData, setApplicationData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: ""
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch internships
  const { data: internships = [], isLoading } = useQuery({
    queryKey: ["/api/internships"],
  });

  // Filter approved and active internships
  const approvedInternships = (internships as Internship[]).filter((internship: Internship) => 
    internship.isApproved && internship.isActive
  );

  // Get all sectors including predefined ones like jobs and CVs
  const predefinedSectors = [
    "Technology",
    "Finance", 
    "Marketing",
    "Healthcare",
    "Education",
    "Engineering",
    "Sales",
    "Human Resources",
    "Operations",
    "Consulting",
    "Media & Communications",
    "Real Estate",
    "Legal",
    "Design",
    "Other"
  ];
  
  const dynamicSectors = Array.from(new Set(
    approvedInternships
      .map((internship: Internship) => internship.department)
      .filter((dept: any): dept is string => Boolean(dept) && typeof dept === 'string' && dept.trim() !== '')
  ));
  
  const sectors = Array.from(new Set([...predefinedSectors, ...dynamicSectors])).sort();

  // Apply search and sector filters
  const filteredInternships = approvedInternships.filter((internship: Internship) => {
    const matchesSearch = searchTerm === "" || 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === "" || sectorFilter === "all" || internship.department === sectorFilter;
    
    return matchesSearch && matchesSector;
  });

  const applyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/applications/internship/${selectedInternship?.id}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your internship application has been sent successfully.",
      });
      setShowApplication(false);
      setSelectedInternship(null);
      setApplicationData({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        coverLetter: ""
      });
      setCvFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message || "There was an error submitting your application.",
        variant: "destructive",
      });
    },
  });

  const handleApply = (internship: Internship) => {
    setSelectedInternship(internship);
    setShowApplication(true);
    setShowDetails(false);
  };

  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship);
    setShowDetails(true);
    setShowApplication(false);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV to apply.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicationData.applicantName);
    formData.append("applicantEmail", applicationData.applicantEmail);
    formData.append("applicantPhone", applicationData.applicantPhone);
    formData.append("coverLetter", applicationData.coverLetter);
    formData.append("cv", cvFile);

    applyMutation.mutate(formData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const DetailedViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedInternship?.title}</h2>
              <p className="text-gray-300">{selectedInternship?.company}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowDetails(false);
                setSelectedInternship(null);
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Main Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300">{selectedInternship?.description}</p>
              </div>

              {selectedInternship?.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
                  <p className="text-gray-300">{selectedInternship.requirements}</p>
                </div>
              )}

              {selectedInternship?.skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
                  <p className="text-gray-300">{selectedInternship.skills}</p>
                </div>
              )}
            </div>

            {/* Details & Contact */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {selectedInternship?.duration}</span>
                  </div>
                  {selectedInternship?.department && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Industry: {selectedInternship.department}</span>
                    </div>
                  )}
                  {selectedInternship?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location: {selectedInternship.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Positions: {selectedInternship?.positions}</span>
                  </div>
                  {selectedInternship?.isPaid && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Paid Internship</span>
                      {selectedInternship.stipend && <span>- {selectedInternship.stipend}</span>}
                    </div>
                  )}
                  {selectedInternship?.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Start Date: {selectedInternship.startDate}</span>
                    </div>
                  )}
                  {selectedInternship?.applicationDeadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {selectedInternship.applicationDeadline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin-only Contact Information */}
              {(user as any)?.isAdmin && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Information <span className="text-sm text-orange-500">(Admin Only)</span></h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedInternship?.contactEmail}</span>
                    </div>
                    {selectedInternship?.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedInternship.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  onClick={() => {
                    setShowDetails(false);
                    handleApply(selectedInternship!);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                >
                  Apply for this Internship
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InternshipCard = ({ internship }: { internship: Internship }) => (
    <Card className="h-full hover:shadow-lg transition-shadow bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 text-white">{internship.title}</CardTitle>
            <p className="text-gray-300 font-medium mb-2">{internship.company}</p>
            {internship.department && (
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                {internship.department}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(internship)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-400 text-sm line-clamp-3">{internship.description}</p>
        
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{internship.duration}</span>
          </div>
          {internship.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{internship.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{internship.positions} position{internship.positions !== 1 ? 's' : ''}</span>
          </div>
          {internship.isPaid && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Paid{internship.stipend ? ` - ${internship.stipend}` : ''}</span>
            </div>
          )}
          {internship.applicationDeadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Apply by {formatDate(internship.applicationDeadline)}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={() => handleApply(internship)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );

  const ApplicationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Apply for {selectedInternship?.title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowApplication(false);
                setSelectedInternship(null);
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div>
              <Label htmlFor="applicantName" className="text-white">Full Name *</Label>
              <Input
                id="applicantName"
                value={applicationData.applicantName}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  applicantName: e.target.value
                }))}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="applicantEmail" className="text-white">Email *</Label>
              <Input
                id="applicantEmail"
                type="email"
                value={applicationData.applicantEmail}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  applicantEmail: e.target.value
                }))}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="applicantPhone" className="text-white">Phone Number *</Label>
              <Input
                id="applicantPhone"
                value={applicationData.applicantPhone}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  applicantPhone: e.target.value
                }))}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cv" className="text-white">Upload CV *</Label>
              <div className="mt-1">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
              </div>
              {cvFile && (
                <p className="text-sm text-green-400 mt-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  {cvFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="coverLetter" className="text-white">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                rows={4}
                placeholder="Tell us why you're interested in this internship..."
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  coverLetter: e.target.value
                }))}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={applyMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowApplication(false);
                  setSelectedInternship(null);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Internship Opportunities</h1>
          <p className="text-xl text-gray-300 mb-6">
            Launch your career with internships from the NewGiza community
          </p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => window.location.href = '/submit-internship'}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Submit Internship Opportunity
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by sector" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector} className="text-white">
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Internships Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading internships...</p>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No internships found</h3>
            <p className="text-gray-400">
              {searchTerm || sectorFilter !== "all" && sectorFilter !== "" 
                ? "Try adjusting your search or filter criteria." 
                : "Be the first to submit an internship opportunity!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship: Internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}

        {/* Modals */}
        {showApplication && <ApplicationModal />}
        {showDetails && <DetailedViewModal />}
      </div>
    </div>
  );
}