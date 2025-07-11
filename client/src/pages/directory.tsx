
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useProfiles, useDeleteProfile, useUpdateProfile } from "@/lib/convexApi";
import { Users, Search, Mail, Briefcase, ExternalLink, Plus, Phone, Trash2, Eye, Edit, Upload, FileText } from "lucide-react";
import type { Profile } from "@shared/schema";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const expertiseAreas = [
  "All",
  "Technology/IT",
  "Marketing", 
  "Finance",
  "Human Resources",
  "Sales",
  "Procurement",
  "Operations",
  "Legal",
  "Healthcare",
  "Education",
  "Engineering",
  "Design",
  "Consulting",
  "Real Estate",
  "Other"
];

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editCvFile, setEditCvFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    company: "",
    bio: "",
    industry: "",
    skills: "",
    contact: "",
    phone: "",
    linkedinUrl: "",
    howCanYouSupport: "",
    experienceLevel: ""
  });
  const { toast } = useToast();

  const { data: profiles = [], isLoading } = useProfiles();

  const { data: authUser } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const deleteProfileMutation = useDeleteProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditCvFile(null); // Clear any previously selected CV file
    setEditForm({
      name: profile.name || "",
      title: profile.title || "",
      company: profile.company || "",
      bio: profile.bio || "",
      industry: profile.industry || "",
      skills: profile.skills || "",
      contact: profile.contact || "",
      phone: profile.phone || "",
      linkedinUrl: profile.linkedinUrl || "",
      howCanYouSupport: profile.howCanYouSupport || "",
      experienceLevel: profile.experienceLevel || ""
    });
  };

  const handleSaveProfile = () => {
    if (!editingProfile) return;
    updateProfileMutation.mutate({
      id: editingProfile.id,
      profileData: editForm,
      cvFile: editCvFile
    });
  };

  const filteredProfiles = (profiles || []).filter((profile: Profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (profile.company && profile.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === "All" || profile.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-primary">Directory</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow NewGiza professionals across various industries and expertise areas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {expertiseAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Profile Button */}
        <div className="text-center mb-8">
          <Link href="/join-community">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Join Professional Community
            </Button>
          </Link>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
            <p className="text-muted-foreground mb-6">
              {!profiles || profiles.length === 0 
                ? "Be the first to join our professional community!" 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link href="/join-community">
              <Button>Join Professional Community</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile: Profile) => (
                <Card key={profile.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <p className="text-primary font-medium">{profile.title}</p>
                        {profile.company && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Briefcase className="h-3 w-3" />
                            {profile.company}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {/* Show edit button for profile creator or admin */}
                        {(authUser?.isAdmin || (authUser?.email && profile.contact === authUser.email)) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Show delete button only for admin */}
                        {authUser?.isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (confirm(`Delete ${profile.name}'s profile?`)) {
                                deleteProfileMutation.mutate(profile.id);
                              }
                            }}
                            disabled={deleteProfileMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.industry && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {profile.industry}
                        </div>
                      )}
                      
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {profile.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedProfile(profile)}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        
                        {profile.contact && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${profile.contact}`} className="gap-1">
                              <Mail className="h-3 w-3" />
                              Email
                            </a>
                          </Button>
                        )}
                        
                        {profile.linkedinUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                              <ExternalLink className="h-3 w-3" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profile Detail Modal */}
            {selectedProfile && (
              <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedProfile.name}</DialogTitle>
                    <p className="text-primary font-medium text-lg">{selectedProfile.title}</p>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {selectedProfile.company && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedProfile.company}</span>
                      </div>
                    )}
                    
                    {selectedProfile.industry && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {selectedProfile.industry}
                      </div>
                    )}

                    {selectedProfile.bio && (
                      <div>
                        <h3 className="font-semibold mb-2">Bio</h3>
                        <p className="text-muted-foreground">{selectedProfile.bio}</p>
                      </div>
                    )}

                    {selectedProfile.skills && (
                      <div>
                        <h3 className="font-semibold mb-2">Skills</h3>
                        <p className="text-muted-foreground">{selectedProfile.skills}</p>
                      </div>
                    )}

                    {selectedProfile.howCanYouSupport && (
                      <div>
                        <h3 className="font-semibold mb-2">How I can support</h3>
                        <p className="text-muted-foreground">{selectedProfile.howCanYouSupport}</p>
                      </div>
                    )}

                    {selectedProfile.experienceLevel && (
                      <div>
                        <h3 className="font-semibold mb-2">Experience Level</h3>
                        <p className="text-muted-foreground">{selectedProfile.experienceLevel}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {selectedProfile.contact && (
                        <Button asChild>
                          <a href={`mailto:${selectedProfile.contact}`} className="gap-2">
                            <Mail className="h-4 w-4" />
                            Email {selectedProfile.name}
                          </a>
                        </Button>
                      )}
                      
                      {selectedProfile.phone && (
                        <Button variant="outline" asChild>
                          <a href={`tel:${selectedProfile.phone}`} className="gap-2">
                            <Phone className="h-4 w-4" />
                            Call
                          </a>
                        </Button>
                      )}
                      
                      {selectedProfile.linkedinUrl && (
                        <Button variant="outline" asChild>
                          <a href={selectedProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            LinkedIn Profile
                          </a>
                        </Button>
                      )}

                      {selectedProfile.cvFilePath && (
                        <Button variant="outline" asChild>
                          <a href={selectedProfile.cvFilePath} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <FileText className="h-4 w-4" />
                            View CV
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Edit Profile Modal */}
            {editingProfile && (
              <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Name *</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Full name"
                          className="text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Title *</label>
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="Professional title"
                          className="text-foreground bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Company</label>
                        <Input
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                          placeholder="Company name"
                          className="text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Industry</label>
                        <Select value={editForm.industry} onValueChange={(value) => setEditForm({ ...editForm, industry: value })}>
                          <SelectTrigger className="text-foreground bg-background">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.filter(area => area !== "All").map((area) => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Bio</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none text-foreground bg-background"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself and your professional background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Skills</label>
                      <Input
                        value={editForm.skills}
                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                        placeholder="List your key skills (comma separated)"
                        className="text-foreground bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">How Can You Support</label>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-input rounded-md resize-none text-foreground bg-background"
                        value={editForm.howCanYouSupport}
                        onChange={(e) => setEditForm({ ...editForm, howCanYouSupport: e.target.value })}
                        placeholder="How can you help other community members?"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                        <Input
                          value={editForm.contact}
                          onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                          placeholder="Professional email"
                          type="email"
                          className="text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Phone</label>
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Phone number"
                          className="text-foreground bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">CV/Resume Upload</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        <div className="text-center">
                          {editCvFile ? (
                            <div className="flex items-center justify-center space-x-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium">{editCvFile.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditCvFile(null)}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <label
                                htmlFor="edit-cv-upload"
                                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                              >
                                Click to upload CV/Resume (PDF, DOC, DOCX)
                              </label>
                            </div>
                          )}
                          <input
                            id="edit-cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setEditCvFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">LinkedIn URL</label>
                      <Input
                        value={editForm.linkedinUrl}
                        onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="text-foreground bg-background"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingProfile(null);
                          setEditCvFile(null);
                        }}
                        disabled={updateProfileMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending || !editForm.name || !editForm.title}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </div>
    </div>
  );
}
