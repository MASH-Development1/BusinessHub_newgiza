import { useQuery, useMutation } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

// Hook to get CV file URL
export const useCvFileUrl = (cvId: Id<"cv_showcase"> | null) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["cvFileUrl", cvId],
    queryFn: async () => {
      if (!cvId) return null;
      return convex.query(api.cvShowcase.getCvFileUrl, { id: cvId });
    },
    enabled: !!cvId,
  });
};

// Hook to generate upload URL
export const useGenerateUploadUrl = () => {
  const convex = useConvex();
  return useMutation({
    mutationFn: () => convex.action(api.files.generateUploadUrl, {}),
  });
};

// Helper function to upload file to Convex storage
export const uploadFileToConvex = async (file: File, convex: any) => {
  // Generate upload URL
  const uploadUrl = await convex.action(api.files.generateUploadUrl, {});

  // Upload file to Convex storage
  const result = await fetch(uploadUrl, {
    method: "POST",
    body: file,
  });

  if (!result.ok) {
    throw new Error("Failed to upload file");
  }

  const { storageId } = await result.json();
  return storageId;
};
