import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Edit,
  Eye,
  Mail,
  Phone,
  ExternalLink,
  Lock,
  LogIn,
  Briefcase,
} from "lucide-react";
import { Link } from "wouter";
import { CvShowcase } from "@/lib/typeAdapter";
import { useCvFileUrl } from "@/lib/convexApi";

interface CVCardProps {
  cv: CvShowcase;
  currentUser: any;
  canEditCv: (cv: CvShowcase) => boolean;
  setSelectedCv: (cv: CvShowcase) => void;
  setEditingCv: (cv: CvShowcase) => void;
}

export function CVCard({
  cv,
  currentUser,
  canEditCv,
  setSelectedCv,
  setEditingCv,
}: CVCardProps) {
  const { data: cvFileUrl } = useCvFileUrl(cv.id as any);

  return (
    <Card
      key={cv.id}
      className="bg-card border-border hover:shadow-lg transition-shadow"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{cv.name}</h3>
            <p className="text-primary font-semibold">{cv.title}</p>
            <Badge variant="secondary" className="mt-2">
              {cv.section}
            </Badge>
          </div>
        </div>

        {cv.bio && cv.bio.trim() ? (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {cv.bio}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm mb-4 italic">
            Professional summary not available
          </p>
        )}

        {cv.skills && cv.skills.trim() ? (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {cv.skills
                .split(",")
                .slice(0, 3)
                .map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill.trim()}
                  </Badge>
                ))}
              {cv.skills.split(",").length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{cv.skills.split(",").length - 3} more
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Skills:</p>
            <p className="text-muted-foreground text-xs italic">
              Skills not specified
            </p>
          </div>
        )}

        {cv.yearsOfExperience && (
          <p className="text-sm text-muted-foreground mb-4">
            <Briefcase className="inline h-4 w-4 mr-1" />
            {cv.yearsOfExperience} years experience
          </p>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex flex-col gap-2">
            {/* Main action buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedCv(cv)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              {cvFileUrl || cv.cvFileName ? (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => cvFileUrl && window.open(cvFileUrl, "_blank")}
                  disabled={!cvFileUrl}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View CV
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground italic border border-dashed border-border rounded-md py-2">
                  No CV added
                </div>
              )}
            </div>

            {/* Contact and edit buttons */}
            <div className="flex gap-1 items-center justify-between">
              <div className="flex gap-1">
                {cv.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${cv.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {cv.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${cv.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {cv.linkedinUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={cv.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              {canEditCv(cv) ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCv(cv)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : currentUser && !currentUser.isAdmin ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled
                  className="text-muted-foreground"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login to Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
