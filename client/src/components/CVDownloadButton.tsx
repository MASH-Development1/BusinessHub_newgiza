import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useCvFileUrl } from "@/lib/convexApi";
import { CvShowcase } from "@/lib/typeAdapter";

interface CVDownloadButtonProps {
  cv: CvShowcase;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function CVDownloadButton({
  cv,
  variant = "outline",
  size = "default",
}: CVDownloadButtonProps) {
  const { data: fileUrl, isLoading } = useCvFileUrl(cv.id as any);

  if (!fileUrl && !isLoading) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || !fileUrl}
      onClick={() => fileUrl && window.open(fileUrl, "_blank")}
    >
      <FileText className="h-4 w-4 mr-2" />
      {isLoading ? "Loading..." : "View CV"}
    </Button>
  );
}
