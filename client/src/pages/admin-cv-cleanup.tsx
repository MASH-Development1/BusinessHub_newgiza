import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CVIntegrityReport {
  totalCvs: number;
  missingFiles: Array<{
    id: number;
    name: string;
    email: string;
    fileName: string;
  }>;
  validFiles: Array<{
    id: number;
    name: string;
    email: string;
    fileName: string;
  }>;
  orphanedFiles: string[];
}

export default function AdminCVCleanup() {
  const [isRunningCleanup, setIsRunningCleanup] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrityReport, isLoading, refetch } = useQuery<CVIntegrityReport>({
    queryKey: ["/api/admin/cv-integrity"],
    refetchOnWindowFocus: false,
  });

  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/cv-cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to clean up CV references");
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Cleanup Complete",
        description: `Cleaned ${result.cleanedCvs.length} CV records with missing files`,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/cv-showcase"] });
    },
    onError: (error: any) => {
      toast({
        title: "Cleanup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCleanup = async () => {
    if (confirm(`This will clear file references for ${integrityReport?.missingFiles.length || 0} CVs with missing files. Continue?`)) {
      setIsRunningCleanup(true);
      try {
        await cleanupMutation.mutateAsync();
      } finally {
        setIsRunningCleanup(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading CV integrity report...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">CV File Integrity Management</h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Total CVs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{integrityReport?.totalCvs || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Valid Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{integrityReport?.validFiles.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Missing Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{integrityReport?.missingFiles.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Orphaned Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{integrityReport?.orphanedFiles.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Cleanup Actions */}
        {integrityReport && integrityReport.missingFiles.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Action Required: Missing Files Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                {integrityReport.missingFiles.length} CV records reference files that no longer exist on the server. 
                This causes "CV file not found or corrupted" errors when users try to download these CVs.
              </p>
              <Button
                onClick={handleCleanup}
                disabled={isRunningCleanup || cleanupMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isRunningCleanup ? "Cleaning up..." : `Clean Up ${integrityReport.missingFiles.length} Missing References`}
              </Button>
              <p className="text-xs text-gray-500">
                This will clear the file references for CVs with missing files and add admin notes to their profiles.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Valid Files List */}
        {integrityReport && integrityReport.validFiles.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                CVs with Valid Files ({integrityReport.validFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrityReport.validFiles.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{cv.name}</h4>
                      <p className="text-sm text-gray-400">{cv.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Available
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{cv.fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missing Files List */}
        {integrityReport && integrityReport.missingFiles.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                CVs with Missing Files ({integrityReport.missingFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {integrityReport.missingFiles.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{cv.name}</h4>
                      <p className="text-sm text-gray-400">{cv.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-red-500 text-red-400">
                        Missing
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{cv.fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orphaned Files */}
        {integrityReport && integrityReport.orphanedFiles.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Orphaned Files ({integrityReport.orphanedFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">
                Files in uploads directory that are not referenced by any CV record:
              </p>
              <div className="space-y-2">
                {integrityReport.orphanedFiles.map((fileName) => (
                  <div key={fileName} className="p-2 bg-gray-800 rounded text-sm text-gray-300">
                    {fileName}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {integrityReport && integrityReport.missingFiles.length === 0 && integrityReport.validFiles.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400 mb-2">All CV Files Are Valid</h3>
                <p className="text-gray-300">No missing files detected. All CV downloads should work properly.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}