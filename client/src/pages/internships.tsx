import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
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
  X,
} from "lucide-react";
import {
  useInternships,
  useCreateInternshipApplication,
} from "@/lib/convexApi";
import type { Internship } from "@/lib/typeAdapter";

export default function Internships() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  // Fetch internships
  const { data: internships = [], isLoading } = useInternships();

  // Filter approved and active internships
  const approvedInternships = internships.filter((internship: Internship) => {
    return internship.isApproved && internship.isActive;
  });

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
    "Other",
  ];

  const dynamicSectors = Array.from(
    new Set(
      approvedInternships
        .map((internship: Internship) => internship.department)
        .filter(
          (dept: any): dept is string =>
            Boolean(dept) && typeof dept === "string" && dept.trim() !== ""
        )
    )
  );

  const sectors = Array.from(
    new Set([...predefinedSectors, ...dynamicSectors])
  ).sort();

  // Apply search and sector filters
  const filteredInternships = approvedInternships.filter(
    (internship: Internship) => {
      const matchesSearch =
        searchTerm === "" ||
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector =
        sectorFilter === "" ||
        sectorFilter === "all" ||
        internship.department === sectorFilter;

      return matchesSearch && matchesSector;
    }
  );

  const applyMutation = useCreateInternshipApplication();

  const handleApply = (internship: Internship) => {
    setSelectedInternship(internship);
    setShowApplication(true);
    setShowDetails(false);
    // Reset form and errors when opening application modal
    // setApplicationData({ // This line is removed as per the edit hint
    //   applicantName: "",
    //   applicantEmail: "",
    //   applicantPhone: "",
    //   coverLetter: "",
    // });
    // setCvFile(null); // This line is removed as per the edit hint
    // setApplicationErrors({ // This line is removed as per the edit hint
    //   applicantName: "",
    //   applicantEmail: "",
    //   applicantPhone: "",
    //   cv: "",
    // });
  };

  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship);
    setShowDetails(true);
    setShowApplication(false);
  };

  const handleCloseApplication = () => {
    setShowApplication(false);
    setSelectedInternship(null);
    // setApplicationData({ // This line is removed as per the edit hint
    //   applicantName: "",
    //   applicantEmail: "",
    //   applicantPhone: "",
    //   coverLetter: "",
    // });
    // setCvFile(null); // This line is removed as per the edit hint
    // setApplicationErrors({ // This line is removed as per the edit hint
    //   applicantName: "",
    //   applicantEmail: "",
    //   applicantPhone: "",
    //   cv: "",
    // });
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    // setApplicationErrors({ // This line is removed as per the edit hint
    //   applicantName: "",
    //   applicantEmail: "",
    //   applicantPhone: "",
    //   cv: "",
    // });

    // Validation
    let hasErrors = false;
    const newErrors = {
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      cv: "",
    };

    if (!applicationData.applicantName.trim()) {
      newErrors.applicantName = "Full name is required";
      hasErrors = true;
    }

    if (!applicationData.applicantEmail.trim()) {
      newErrors.applicantEmail = "Email is required";
      hasErrors = true;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.applicantEmail)
    ) {
      newErrors.applicantEmail = "Please enter a valid email address";
      hasErrors = true;
    }

    if (!applicationData.applicantPhone.trim()) {
      newErrors.applicantPhone = "Phone number is required";
      hasErrors = true;
    }

    if (!selectedInternship) {
      toast({
        title: "Error",
        description: "No internship selected.",
        variant: "destructive",
      });
      return;
    }

    if (!cvFile) {
      newErrors.cv = "CV is required";
      hasErrors = true;
    }

    if (hasErrors) {
      // setApplicationErrors(newErrors); // This line is removed as per the edit hint
      return;
    }

    const formData = new FormData();
    formData.append("internshipId", selectedInternship.id.toString());
    formData.append("applicantName", applicationData.applicantName);
    formData.append("applicantEmail", applicationData.applicantEmail);
    formData.append("applicantPhone", applicationData.applicantPhone);
    formData.append("coverLetter", applicationData.coverLetter);
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    applyMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully!",
        });
        setShowApplication(false);
        setSelectedInternship(null);
        // setApplicationData({ // This line is removed as per the edit hint
        //   applicantName: "",
        //   applicantEmail: "",
        //   applicantPhone: "",
        //   coverLetter: "",
        // });
        // setCvFile(null); // This line is removed as per the edit hint
        // setApplicationErrors({ // This line is removed as per the edit hint
        //   applicantName: "",
        //   applicantEmail: "",
        //   applicantPhone: "",
        //   cv: "",
        // });
      },
      onError: (error: any) => {
        toast({
          title: "Application Failed",
          description:
            error?.message || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const DetailedViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {selectedInternship?.title}
              </h2>
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
                <h3 className="text-lg font-semibold text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-300">
                  {selectedInternship?.description}
                </p>
              </div>

              {selectedInternship?.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Requirements
                  </h3>
                  <p className="text-gray-300">
                    {selectedInternship.requirements}
                  </p>
                </div>
              )}

              {selectedInternship?.skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Skills
                  </h3>
                  <p className="text-gray-300">{selectedInternship.skills}</p>
                </div>
              )}
            </div>

            {/* Details & Contact */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Details
                </h3>
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
                      {selectedInternship.stipend && (
                        <span> - {selectedInternship.stipend}</span>
                      )}
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
                      <span>
                        Deadline: {selectedInternship.applicationDeadline}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin-only Contact Information */}
              {isAdmin && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Contact Information{" "}
                    <span className="text-sm text-orange-500">
                      (Admin Only)
                    </span>
                  </h3>
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
            <CardTitle className="text-lg mb-2 text-white">
              {internship.title}
            </CardTitle>
            <p className="text-gray-300 font-medium mb-2">
              {internship.company}
            </p>
            {internship.department && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-700 text-gray-300"
              >
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
        <p className="text-gray-400 text-sm line-clamp-3">
          {internship.description}
        </p>

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
            <span>
              {internship.positions} position
              {internship.positions !== 1 ? "s" : ""}
            </span>
          </div>
          {internship.isPaid && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>
                Paid{internship.stipend ? ` - ${internship.stipend}` : ""}
              </span>
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

  // Move ApplicationModal outside the main component
  function ApplicationModal({
    handleCloseApplication,
    selectedInternship,
    applyMutation,
  }: {
    handleCloseApplication: () => void;
    selectedInternship: Internship | null;
    applyMutation: any;
  }) {
    const [applicationData, setApplicationData] = useState({
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      coverLetter: "",
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [applicationErrors, setApplicationErrors] = useState({
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      cv: "",
    });

    // Optionally reset state when modal is opened/closed
    useEffect(() => {
      setApplicationData({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        coverLetter: "",
      });
      setCvFile(null);
      setApplicationErrors({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        cv: "",
      });
    }, [selectedInternship]);

    const handleSubmitApplication = async (e: React.FormEvent) => {
      e.preventDefault();
      setApplicationErrors({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        cv: "",
      });
      let hasErrors = false;
      const newErrors = {
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        cv: "",
      };
      if (!applicationData.applicantName.trim()) {
        newErrors.applicantName = "Full name is required";
        hasErrors = true;
      }
      if (!applicationData.applicantEmail.trim()) {
        newErrors.applicantEmail = "Email is required";
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.applicantEmail)) {
        newErrors.applicantEmail = "Please enter a valid email address";
        hasErrors = true;
      }
      if (!applicationData.applicantPhone.trim()) {
        newErrors.applicantPhone = "Phone number is required";
        hasErrors = true;
      }
      if (!selectedInternship) {
        // toast error if needed
        return;
      }
      if (!cvFile) {
        newErrors.cv = "CV is required";
        hasErrors = true;
      }
      if (hasErrors) {
        setApplicationErrors(newErrors);
        return;
      }
      const formData = new FormData();
      formData.append("internshipId", selectedInternship.id.toString());
      formData.append("applicantName", applicationData.applicantName);
      formData.append("applicantEmail", applicationData.applicantEmail);
      formData.append("applicantPhone", applicationData.applicantPhone);
      formData.append("coverLetter", applicationData.coverLetter);
      if (cvFile) {
        formData.append("cv", cvFile);
      }
      applyMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseApplication();
        },
        onError: (error: any) => {
          // toast error if needed
        },
      });
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Apply for {selectedInternship?.title}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseApplication}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <Label htmlFor="applicantName" className="text-white">
                  Full Name *
                </Label>
                <Input
                  id="applicantName"
                  value={applicationData.applicantName}
                  onChange={(e) => {
                    setApplicationData((prev) => ({
                      ...prev,
                      applicantName: e.target.value,
                    }));
                    if (applicationErrors.applicantName) {
                      setApplicationErrors((prev) => ({
                        ...prev,
                        applicantName: "",
                      }));
                    }
                  }}
                  required
                  className={`bg-gray-800 border-gray-600 text-white ${
                    applicationErrors.applicantName ? "border-red-500" : ""
                  }`}
                />
                {applicationErrors.applicantName && (
                  <p className="text-red-400 text-sm mt-1">
                    {applicationErrors.applicantName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="applicantEmail" className="text-white">
                  Email *
                </Label>
                <Input
                  id="applicantEmail"
                  type="email"
                  value={applicationData.applicantEmail}
                  onChange={(e) => {
                    setApplicationData((prev) => ({
                      ...prev,
                      applicantEmail: e.target.value,
                    }));
                    if (applicationErrors.applicantEmail) {
                      setApplicationErrors((prev) => ({
                        ...prev,
                        applicantEmail: "",
                      }));
                    }
                  }}
                  required
                  className={`bg-gray-800 border-gray-600 text-white ${
                    applicationErrors.applicantEmail ? "border-red-500" : ""
                  }`}
                />
                {applicationErrors.applicantEmail && (
                  <p className="text-red-400 text-sm mt-1">
                    {applicationErrors.applicantEmail}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="applicantPhone" className="text-white">
                  Phone Number *
                </Label>
                <Input
                  id="applicantPhone"
                  value={applicationData.applicantPhone}
                  onChange={(e) => {
                    setApplicationData((prev) => ({
                      ...prev,
                      applicantPhone: e.target.value,
                    }));
                    if (applicationErrors.applicantPhone) {
                      setApplicationErrors((prev) => ({
                        ...prev,
                        applicantPhone: "",
                      }));
                    }
                  }}
                  required
                  className={`bg-gray-800 border-gray-600 text-white ${
                    applicationErrors.applicantPhone ? "border-red-500" : ""
                  }`}
                />
                {applicationErrors.applicantPhone && (
                  <p className="text-red-400 text-sm mt-1">
                    {applicationErrors.applicantPhone}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cv" className="text-white">
                  Upload CV *
                </Label>
                <div className="mt-1">
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      setCvFile(e.target.files?.[0] || null);
                      if (applicationErrors.cv) {
                        setApplicationErrors((prev) => ({ ...prev, cv: "" }));
                      }
                    }}
                    className={`block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 ${
                      applicationErrors.cv ? "border border-red-500 rounded" : ""
                    }`}
                  />
                </div>
                {applicationErrors.cv && (
                  <p className="text-red-400 text-sm mt-1">
                    {applicationErrors.cv}
                  </p>
                )}
                {cvFile && (
                  <p className="text-sm text-green-400 mt-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {cvFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="coverLetter" className="text-white">
                  Cover Letter
                </Label>
                <Textarea
                  id="coverLetter"
                  rows={4}
                  placeholder="Tell us why you're interested in this internship..."
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData((prev) => ({
                      ...prev,
                      coverLetter: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {applyMutation.isPending
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseApplication}
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
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Internship Opportunities
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Launch your career with internships from the NewGiza community
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => navigate("/submit-internship")}
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
                  <SelectItem value="all" className="text-white">
                    All Sectors
                  </SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem
                      key={sector}
                      value={sector}
                      className="text-white"
                    >
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No internships found
            </h3>
            <p className="text-gray-400">
              {searchTerm || (sectorFilter !== "all" && sectorFilter !== "")
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
        {showApplication && (
          <ApplicationModal
            handleCloseApplication={handleCloseApplication}
            selectedInternship={selectedInternship}
            applyMutation={applyMutation}
          />
        )}
        {showDetails && <DetailedViewModal />}
      </div>
    </div>
  );
}
