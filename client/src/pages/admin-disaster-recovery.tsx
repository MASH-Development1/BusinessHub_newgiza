import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Download, 
  Upload, 
  AlertTriangle, 
  Database,
  Files,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DisasterRecoveryBackup {
  id: string;
  timestamp: string;
  description: string;
  metadata: {
    totalRecords: number;
    totalFiles: number;
    backupSize: string;
    version: string;
  };
}

export default function AdminDisasterRecovery() {
  const [backupDescription, setBackupDescription] = useState("");
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  // Fetch all disaster recovery backups
  const { data: backups, isLoading: backupsLoading } = useQuery<DisasterRecoveryBackup[]>({
    queryKey: ['/api/admin/disaster-recovery/backups'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await fetch('/api/admin/disaster-recovery/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      if (!response.ok) throw new Error('Failed to create backup');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/disaster-recovery/backups'] });
      setBackupDescription("");
      toast({
        title: "Backup Created",
        description: `Complete system backup created successfully: ${data.backup.metadata.totalRecords} records, ${data.backup.metadata.totalFiles} files`,
      });
    },
    onError: () => {
      toast({
        title: "Backup Failed",
        description: "Failed to create complete system backup",
        variant: "destructive",
      });
    }
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const response = await fetch(`/api/admin/disaster-recovery/restore/${backupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to restore backup');
      return response.json();
    },
    onSuccess: () => {
      setIsRestoring(false);
      setSelectedBackupId(null);
      queryClient.invalidateQueries(); // Refresh all data
      toast({
        title: "System Restored",
        description: "Complete system has been restored from backup successfully",
      });
    },
    onError: () => {
      setIsRestoring(false);
      toast({
        title: "Restore Failed",
        description: "Failed to restore system from backup",
        variant: "destructive",
      });
    }
  });

  const handleCreateBackup = () => {
    createBackupMutation.mutate(backupDescription || 'Manual backup');
  };

  const handleRestoreBackup = (backupId: string) => {
    setSelectedBackupId(backupId);
    setIsRestoring(true);
    restoreBackupMutation.mutate(backupId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBackupAge = (dateString: string) => {
    const now = new Date();
    const backupDate = new Date(dateString);
    const diffMs = now.getTime() - backupDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than 1 hour ago';
    }
  };

  return (
    <div className="page-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Disaster Recovery System</h1>
              <p className="text-muted-foreground">Complete backup and restoration for catastrophic data loss scenarios</p>
            </div>
          </div>

          {/* Critical Warning */}
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>WARNING:</strong> The restore function will completely replace all current data with the backup. 
              Only use this in case of catastrophic data loss. Always create a backup before restoring.
            </AlertDescription>
          </Alert>
        </div>

        {/* Create Backup Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Create Complete System Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="backup-description">Backup Description</Label>
                <Input
                  id="backup-description"
                  placeholder="e.g., Before major update, Weekly backup, etc."
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleCreateBackup}
                  disabled={createBackupMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createBackupMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {createBackupMutation.isPending ? "Creating Backup..." : "Create Complete Backup"}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>Includes: All database records, uploaded files, and system state</p>
                  <p>Automatic backups run every 6 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Available Disaster Recovery Backups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {backupsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : !backups || backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No disaster recovery backups found</p>
                <p className="text-sm">Create your first complete backup to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{backup.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(backup.timestamp)} • {getBackupAge(backup.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-4 mb-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              {backup.metadata.totalRecords} records
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Files className="h-3 w-3" />
                              {backup.metadata.totalFiles} files
                            </Badge>
                            <Badge variant="outline">
                              {backup.metadata.backupSize}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={isRestoring || restoreBackupMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          {(isRestoring && selectedBackupId === backup.id) ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Restore System
                            </>
                          )}
                        </Button>
                      </div>
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
            <CardTitle>Disaster Recovery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">What's Included in Backups</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Complete database with all records
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    All uploaded files (CVs, images, documents)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    System configuration and settings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    User profiles and access permissions
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Recovery Process</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Clears all existing data safely
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Restores database records in correct order
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Recreates all files with original content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Verifies system integrity after restore
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Automatic Backup Schedule</h4>
              <p className="text-sm text-muted-foreground">
                The system automatically creates complete backups every 6 hours to ensure you always have recent recovery points available. 
                Manual backups can be created anytime before making major changes to the system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}