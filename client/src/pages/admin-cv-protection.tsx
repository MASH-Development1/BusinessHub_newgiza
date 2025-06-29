import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  RefreshCw, 
  Download,
  Database,
  HardDrive,
  Clock
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProtectionStatus {
  totalFiles: number;
  protectedFiles: number;
  missingFiles: number;
  integrityScore: number;
  lastCheck: string;
  storageUsed: string;
  availableSpace: string;
}

interface FileProtectionInfo {
  cvId: number;
  userEmail: string;
  originalFilename: string;
  protectedPaths: string[];
  protectedAt: string;
  status: 'protected' | 'missing' | 'corrupted';
}

export default function AdminCVProtection() {
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  // Fetch protection status
  const { data: protectionStatus, isLoading: statusLoading } = useQuery<ProtectionStatus>({
    queryKey: ['/api/admin/cv-protection/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch protected files list
  const { data: protectedFiles, isLoading: filesLoading } = useQuery<FileProtectionInfo[]>({
    queryKey: ['/api/admin/cv-protection/files'],
  });

  // Run integrity check mutation
  const integrityCheckMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/cv-protection/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Integrity check failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cv-protection/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cv-protection/files'] });
      setIsRunningCheck(false);
    },
    onError: () => {
      setIsRunningCheck(false);
    }
  });

  // Create emergency backup mutation
  const emergencyBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/cv-protection/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Emergency backup failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cv-protection/status'] });
    }
  });

  const handleIntegrityCheck = () => {
    setIsRunningCheck(true);
    integrityCheckMutation.mutate();
  };

  const handleEmergencyBackup = () => {
    emergencyBackupMutation.mutate();
  };

  const getStatusColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Critical";
  };

  return (
    <div className="page-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CV File Protection System</h1>
              <p className="text-muted-foreground">Monitor and manage CV file integrity to prevent data loss</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleIntegrityCheck}
              disabled={isRunningCheck || integrityCheckMutation.isPending}
              className="flex items-center gap-2"
            >
              {isRunningCheck ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileCheck className="h-4 w-4" />
              )}
              {isRunningCheck ? "Checking..." : "Run Integrity Check"}
            </Button>

            <Button 
              variant="outline"
              onClick={handleEmergencyBackup}
              disabled={emergencyBackupMutation.isPending}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {emergencyBackupMutation.isPending ? "Creating..." : "Emergency Backup"}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        {statusLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Integrity Score</p>
                    <p className={`text-2xl font-bold ${getStatusColor(protectionStatus?.integrityScore || 0)}`}>
                      {protectionStatus?.integrityScore || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getStatusText(protectionStatus?.integrityScore || 0)}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <Progress 
                  value={protectionStatus?.integrityScore || 0} 
                  className="mt-3" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Protected Files</p>
                    <p className="text-2xl font-bold">{protectionStatus?.protectedFiles || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      of {protectionStatus?.totalFiles || 0} total
                    </p>
                  </div>
                  <FileCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                    <p className="text-2xl font-bold">{protectionStatus?.storageUsed || "0 MB"}</p>
                    <p className="text-xs text-muted-foreground">
                      {protectionStatus?.availableSpace || "0 GB"} available
                    </p>
                  </div>
                  <HardDrive className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Check</p>
                    <p className="text-sm font-bold">
                      {protectionStatus?.lastCheck ? 
                        new Date(protectionStatus.lastCheck).toLocaleString() : 
                        "Never"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Auto every 10min</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerts */}
        {protectionStatus && protectionStatus.missingFiles > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> {protectionStatus.missingFiles} CV files are missing protection. 
              Run an integrity check to identify and restore them.
            </AlertDescription>
          </Alert>
        )}

        {/* Protected Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Protected CV Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-4 bg-muted rounded w-8"></div>
                    <div className="h-4 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : !protectedFiles || protectedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No protected CV files found</p>
                <p className="text-sm">Upload CV files to see protection status here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {protectedFiles.map((file) => (
                  <div key={file.cvId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Badge variant={file.status === 'protected' ? 'default' : 'destructive'}>
                        CV #{file.cvId}
                      </Badge>
                      <div>
                        <p className="font-medium">{file.originalFilename}</p>
                        <p className="text-sm text-muted-foreground">{file.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={file.status === 'protected' ? 'secondary' : 'destructive'}
                        className="mb-1"
                      >
                        {file.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {file.protectedPaths.length} backup copies
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Protected: {new Date(file.protectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Protection Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Multiple backup copies per CV file
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Automatic integrity monitoring every 10 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Emergency backup creation every hour
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Automatic file recovery on download
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Storage Locations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <code>/protected-cvs/</code> - Primary protection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <code>/cv-backups/</code> - Secondary backups
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <code>/cv-backups/versions/</code> - Versioned copies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <code>/cv-backups/emergency/</code> - Emergency backups
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}