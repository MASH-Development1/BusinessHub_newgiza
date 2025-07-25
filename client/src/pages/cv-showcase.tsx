import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
  Edit,
  Save,
  Upload,
  Eye,
  Lock,
  LogIn,
} from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CvShowcase } from "@/lib/typeAdapter";
import { CV_SHOWCASE_SECTIONS } from "@shared/sections";
import {
  useCvShowcase,
  useUpdateCvShowcase,
  useCvFileUrl,
} from "@/lib/convexApi";
import { useToast } from "@/hooks/use-toast";
import { CVCard } from "@/components/CVCard";
import { CVDownloadButton } from "@/components/CVDownloadButton";
import { useAuth } from "@/contexts/AuthContext";

const editCvSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  section: z.string().min(1, "Section is required"),
  bio: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

type EditCvData = z.infer<typeof editCvSchema>;

export default function CvShowcase() {
  const [selectedSection, setSelectedSection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCv, setEditingCv] = useState<CvShowcase | null>(null);
  const [selectedCv, setSelectedCv] = useState<CvShowcase | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cvs = [], isLoading } = useCvShowcase();
  const { user: currentUser, isAdmin } = useAuth();

  const updateCvMutation = useUpdateCvShowcase();

  const canEditCv = (cv: CvShowcase) => {
    if (!currentUser) return false;
    return isAdmin || currentUser.email === cv.email;
  };

  // Calculate CV counts for each section
  const sectionCounts = CV_SHOWCASE_SECTIONS.reduce(
    (acc, section) => {
      if (section.value === "") {
        acc[section.value] = cvs.length;
      } else {
        acc[section.value] = cvs.filter(
          (cv) => cv.section === section.value
        ).length;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const filteredCvs = cvs.filter((cv) => {
    const matchesSection = !selectedSection || cv.section === selectedSection;
    const matchesSearch =
      !searchQuery ||
      cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="page-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            CV <span className="text-primary">Showcase</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover talented professionals within the NewGiza community
            organized by expertise areas.
          </p>
          <Link href="/cv-upload">
            <Button size="lg" className="text-lg px-8">
              Upload Your CV
            </Button>
          </Link>
        </div>

        {/* Section Filter */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Professional Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {CV_SHOWCASE_SECTIONS.map((section) => (
                <Button
                  key={section.value}
                  variant={
                    selectedSection === section.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSection(section.value)}
                  className="h-auto p-4 flex flex-col items-center text-center min-h-[80px]"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <span className="font-semibold text-sm leading-tight">
                      {section.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5 ml-1"
                    >
                      {sectionCounts[section.value] || 0}
                    </Badge>
                  </div>
                  <span className="text-xs opacity-70 leading-tight text-center">
                    {section.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading CVs...</p>
          </div>
        ) : filteredCvs.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedSection
                ? `No professionals found in ${selectedSection}`
                : "No CVs found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedSection
                ? "Try selecting a different section or clearing your search."
                : searchQuery
                  ? "Try adjusting your search terms or browse all sections."
                  : "Be the first to upload your CV to the community showcase!"}
            </p>
            <Link href="/cv-upload">
              <Button>Upload Your CV</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedSection || "All Professionals"}
                <span className="text-muted-foreground ml-2">
                  ({filteredCvs.length})
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCvs.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  currentUser={currentUser}
                  canEditCv={canEditCv}
                  setSelectedCv={setSelectedCv}
                  setEditingCv={setEditingCv}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit CV Dialog */}
      {editingCv && (
        <EditCvDialog
          cv={editingCv}
          isOpen={!!editingCv}
          onClose={() => setEditingCv(null)}
          onSave={(data) =>
            updateCvMutation.mutateAsync({ id: editingCv.id.toString(), data })
          }
          isLoading={updateCvMutation.isPending}
        />
      )}

      {selectedCv && (
        <Dialog open={!!selectedCv} onOpenChange={() => setSelectedCv(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedCv.name}</DialogTitle>
              {selectedCv.title && (
                <p className="text-primary font-semibold text-lg">
                  {selectedCv.title}
                </p>
              )}
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  {selectedCv.section}
                </Badge>
                {selectedCv.yearsOfExperience && (
                  <Badge variant="outline" className="text-sm">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {selectedCv.yearsOfExperience} years
                  </Badge>
                )}
              </div>

              {selectedCv.bio && selectedCv.bio.trim() && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedCv.bio}
                  </p>
                </div>
              )}

              {selectedCv.experience && selectedCv.experience.trim() && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Experience</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedCv.experience}
                  </p>
                </div>
              )}

              {selectedCv.skills && selectedCv.skills.trim() && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCv.skills.split(",").map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                <CVDownloadButton cv={selectedCv} />
                {selectedCv.email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${selectedCv.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {selectedCv.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedCv.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                {selectedCv.linkedinUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={selectedCv.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function EditCvDialog({
  cv,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: {
  cv: CvShowcase;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditCvData) => void;
  isLoading: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<EditCvData>({
    resolver: zodResolver(editCvSchema),
    defaultValues: {
      name: cv.name || "",
      title: cv.title || "",
      section: cv.section || "",
      bio: cv.bio || "",
      skills: cv.skills || "",
      experience: cv.experience || "",
      phone: cv.phone || "",
      linkedinUrl: cv.linkedinUrl || "",
    },
  });

  const updateWithFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("🔄 Attempting file upload CV update...");
      console.log("📋 Document cookies:", document.cookie);
      console.log("📝 FormData entries:");
      formData.forEach((value, key) => {
        console.log(`  ${key}:`, value);
      });

      const response = await fetch(`/api/cv-showcase/${cv.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include", // Include session cookies
      });

      console.log("📡 Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-showcase"] });
      onClose();
      setSelectedFile(null);
    },
    onError: (error: any) => {
      console.error("Error updating CV with file:", error);
      // Show detailed error to user
      alert(`Failed to update CV: ${error.message || "Unknown error"}`);
    },
  });

  const handleSubmit = (data: EditCvData) => {
    if (selectedFile) {
      // If a new file is selected, use multipart form data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("cv", selectedFile);
      updateWithFileMutation.mutate(formData);
    } else {
      // If no file, use regular JSON update
      onSave(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit CV Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Section</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">Select Section</option>
                        {CV_SHOWCASE_SECTIONS.slice(1).map((section) => (
                          <option key={section.value} value={section.value}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Comma-separated skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CV File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">CV File (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">
                      {cv.cvFileName ? (
                        <p>
                          Current: {cv.cvFileName}
                          <br />
                          Upload new CV to replace
                        </p>
                      ) : (
                        <p>
                          No CV uploaded yet
                          <br />
                          Upload your CV file
                        </p>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
