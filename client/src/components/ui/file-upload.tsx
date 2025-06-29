import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number; // in bytes
  description?: string;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB default
  description = "Upload your file",
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
    
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`File type not supported. Please use: ${accept}`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          className={cn(
            "file-upload-area",
            isDragging && "border-primary bg-primary/5",
            error && "border-destructive"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={cn(
            "h-12 w-12 mx-auto mb-4",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
          <p className={cn(
            "font-medium mb-2",
            isDragging ? "text-primary" : "text-foreground"
          )}>
            {isDragging ? "Drop your file here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
