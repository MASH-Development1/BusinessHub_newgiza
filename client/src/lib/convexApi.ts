import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Job,
  Internship,
  Course,
  Profile,
  CvShowcase,
  CommunityBenefit,
  Application,
  User,
  EmailWhitelist,
  AccessRequest,
  adaptJob,
  adaptInternship,
  adaptCourse,
  adaptProfile,
  adaptCvShowcase,
  adaptCommunityBenefit,
  adaptApplication,
  adaptUser,
  adaptEmailWhitelist,
  adaptAccessRequest,
} from "./typeAdapter";

// Hook to get jobs
export const useJobs = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const convexJobs = await convex.query(api.jobs.getJobs, { filters });
      return convexJobs.map(adaptJob);
    },
  });
};

// Hook to get a single job
export const useJob = (id: Id<"jobs">) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const convexJob = await convex.query(api.jobs.getJob, { id });
      return convexJob ? adaptJob(convexJob) : null;
    },
    enabled: !!id,
  });
};

// Hook to create a job
export const useCreateJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => convex.mutation(api.jobs.createJob, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

// Hook to update a job
export const useUpdateJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      convex.mutation(api.jobs.updateJob, {
        id: id as any,
        ...data,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({
        queryKey: ["job", id],
      });
    },
  });
};

// Hook to delete a job
export const useDeleteJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.jobs.deleteJob, { id: id as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

// Hook to get internships
export const useInternships = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["internships", filters],
    queryFn: async () => {
      const convexInternships = await convex.query(
        api.internships.getInternships,
        { filters }
      );
      return convexInternships.map(adaptInternship);
    },
  });
};

// Hook to get a single internship
export const useInternship = (id: Id<"internships">) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["internship", id],
    queryFn: async () => {
      const convexInternship = await convex.query(
        api.internships.getInternship,
        { id }
      );
      return convexInternship ? adaptInternship(convexInternship) : null;
    },
    enabled: !!id,
  });
};

// Hook to create an internship
export const useCreateInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.internships.createInternship, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

// Hook to update an internship
export const useUpdateInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      convex.mutation(api.internships.updateInternship, {
        id: id as any,
        ...data,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
      queryClient.invalidateQueries({
        queryKey: ["internship", id],
      });
    },
  });
};

// Hook to delete an internship
export const useDeleteInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.internships.deleteInternship, { id: id as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

// Hook to get courses
export const useCourses = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: async () => {
      const convexCourses = await convex.query(api.courses.getCourses, {
        filters,
      });
      return convexCourses.map(adaptCourse);
    },
  });
};

// Hook to get a single course
export const useCourse = (id: Id<"courses">) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const convexCourse = await convex.query(api.courses.getCourse, { id });
      return convexCourse ? adaptCourse(convexCourse) : null;
    },
    enabled: !!id,
  });
};

// Hook to create a course
export const useCreateCourse = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => convex.mutation(api.courses.createCourse, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Hook to update a course
export const useUpdateCourse = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      convex.mutation(api.courses.updateCourse, {
        id: id as any,
        ...data,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["course", id],
      });
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.courses.deleteCourse, { id: id as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Hook to get profiles
export const useProfiles = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["profiles", filters],
    queryFn: async () => {
      const convexProfiles = await convex.query(api.profiles.getProfiles, {
        filters,
      });
      return convexProfiles.map(adaptProfile);
    },
  });
};

// Hook to get a single profile
export const useProfile = (id: Id<"profiles">) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const convexProfile = await convex.query(api.profiles.getProfile, { id });
      return convexProfile ? adaptProfile(convexProfile) : null;
    },
    enabled: !!id,
  });
};

// Hook to create a profile
export const useCreateProfile = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.profiles.createProfile, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

// Hook to update a profile
export const useUpdateProfile = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      convex.mutation(api.profiles.updateProfile, {
        id: id as any,
        ...data,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", id],
      });
    },
  });
};

// Hook to delete a profile
export const useDeleteProfile = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.profiles.deleteProfile, { id: id as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

// Hook to get CV showcase
export const useCvShowcase = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["cvShowcase", filters],
    queryFn: async () => {
      const convexCvs = await convex.query(api.cvShowcase.getCvShowcase, {
        filters,
      });
      return convexCvs.map(adaptCvShowcase);
    },
  });
};

// Hook to get a single CV
export const useCv = (id: Id<"cv_showcase">) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["cv", id],
    queryFn: async () => {
      const convexCv = await convex.query(api.cvShowcase.getCv, { id });
      return convexCv ? adaptCvShowcase(convexCv) : null;
    },
    enabled: !!id,
  });
};

// Helper function to map camelCase to snake_case for CV showcase fields
const mapCvFieldNames = (data: any) => {
  const fieldMapping: Record<string, string> = {
    linkedinUrl: "linkedin_url",
    yearsOfExperience: "years_of_experience",
    cvFileName: "cv_file_name",
    cvFilePath: "cv_file_path",
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  const mappedData: any = {};
  Object.entries(data).forEach(([key, value]) => {
    const mappedKey = fieldMapping[key] || key;
    mappedData[mappedKey] = value;
  });

  return mappedData;
};

// Hook to create CV showcase
export const useCreateCvShowcase = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      if (data instanceof FormData) {
        // Handle file upload with FormData
        const file = data.get("cv") as File;
        let cvStorageId = null;

        if (file) {
          // Generate upload URL
          const uploadUrl = await convex.action(
            api.files.generateUploadUrl,
            {}
          );

          // Upload file to Convex storage
          const result = await fetch(uploadUrl, {
            method: "POST",
            body: file,
          });

          if (!result.ok) {
            throw new Error("Failed to upload file");
          }

          const { storageId } = await result.json();
          cvStorageId = storageId;
        }

        // Prepare data object from FormData
        const cvData: any = {};
        Array.from(data.entries()).forEach(([key, value]) => {
          if (key !== "cv" && value) {
            cvData[key] = value;
          }
        });

        if (cvStorageId) {
          cvData.cv_storage_id = cvStorageId;
          cvData.cv_file_name = file?.name;
        }

        // Map camelCase field names to snake_case
        const mappedData = mapCvFieldNames(cvData);

        return convex.mutation(api.cvShowcase.createCvShowcase, mappedData);
      } else {
        // Handle regular data object
        const mappedData = mapCvFieldNames(data);
        return convex.mutation(api.cvShowcase.createCvShowcase, mappedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvShowcase"] });
    },
  });
};

// Hook to update CV showcase
export const useUpdateCvShowcase = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      if (data instanceof FormData) {
        // Handle file upload with FormData
        const file = data.get("cv") as File;
        let cvStorageId = null;

        if (file) {
          // Generate upload URL
          const uploadUrl = await convex.action(
            api.files.generateUploadUrl,
            {}
          );

          // Upload file to Convex storage
          const result = await fetch(uploadUrl, {
            method: "POST",
            body: file,
          });

          if (!result.ok) {
            throw new Error("Failed to upload file");
          }

          const { storageId } = await result.json();
          cvStorageId = storageId;
        }

        // Prepare data object from FormData
        const cvData: any = { id: id as any };
        Array.from(data.entries()).forEach(([key, value]) => {
          if (key !== "cv" && value) {
            cvData[key] = value;
          }
        });

        if (cvStorageId) {
          cvData.cv_storage_id = cvStorageId;
          cvData.cv_file_name = file?.name;
        }

        // Map camelCase field names to snake_case
        const mappedData = mapCvFieldNames(cvData);

        return convex.mutation(api.cvShowcase.updateCvShowcase, mappedData);
      } else {
        // Handle regular data object
        const mappedData = mapCvFieldNames(data);
        return convex.mutation(api.cvShowcase.updateCvShowcase, {
          id: id as any,
          ...mappedData,
        });
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["cvShowcase"] });
      queryClient.invalidateQueries({ queryKey: ["cv", id] });
    },
  });
};

// Hook to delete CV showcase
export const useDeleteCvShowcase = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.cvShowcase.deleteCvShowcase, {
        id: id as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvShowcase"] });
    },
  });
};

// Hook to get applications
export const useApplications = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const convexApplications = await convex.query(
        api.applications.getApplications
      );
      return convexApplications.map(adaptApplication);
    },
  });
};

// Hook to create a job application
export const useCreateJobApplication = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.applications.createJobApplication, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Hook to create an internship application
export const useCreateInternshipApplication = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.applications.createInternshipApplication, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Hook to update application status
export const useUpdateApplicationStatus = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      convex.mutation(api.applications.updateApplicationStatus, {
        id: id as any,
        status,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({
        queryKey: ["application", id],
      });
    },
  });
};

// Hook to get community benefits
export const useCommunityBenefits = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["communityBenefits", filters],
    queryFn: async () => {
      const convexBenefits = await convex.query(
        api.communityBenefits.getCommunityBenefits,
        { filters }
      );
      return convexBenefits.map(adaptCommunityBenefit);
    },
  });
};

// Hook to get homepage benefits
export const useHomepageBenefits = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["homepageBenefits"],
    queryFn: async () => {
      const convexBenefits = await convex.query(
        api.communityBenefits.getHomepageBenefits
      );
      return convexBenefits.map(adaptCommunityBenefit);
    },
  });
};

// Hook to create a community benefit
export const useCreateCommunityBenefit = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.communityBenefits.createCommunityBenefit, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityBenefits"] });
      queryClient.invalidateQueries({ queryKey: ["homepageBenefits"] });
    },
  });
};

// Hook to update a community benefit
export const useUpdateCommunityBenefit = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      convex.mutation(api.communityBenefits.updateCommunityBenefit, {
        id: id as any,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityBenefits"] });
      queryClient.invalidateQueries({ queryKey: ["homepageBenefits"] });
    },
  });
};

// Hook to delete a community benefit
export const useDeleteCommunityBenefit = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.communityBenefits.deleteCommunityBenefit, {
        id: id as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityBenefits"] });
      queryClient.invalidateQueries({ queryKey: ["homepageBenefits"] });
    },
  });
};

// Hook to get stats
export const useStats = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      return await convex.query(api.stats.getStats);
    },
  });
};

// Hook to get whitelist
export const useWhitelist = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["whitelist"],
    queryFn: async () => {
      const convexWhitelist = await convex.query(api.whitelist.getWhitelist);
      return convexWhitelist.map(adaptEmailWhitelist);
    },
  });
};

// Hook to add to whitelist
export const useAddToWhitelist = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      convex.mutation(api.whitelist.addToWhitelist, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};

// Hook to remove from whitelist
export const useRemoveFromWhitelist = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      convex.mutation(api.whitelist.removeFromWhitelist, { id: id as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};

// Hook to get access requests
export const useAccessRequests = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["accessRequests"],
    queryFn: async () => {
      const convexRequests = await convex.query(api.accessRequests.getAll, {
        filters: { status: "pending" },
      });
      return convexRequests.map(adaptAccessRequest);
    },
  });
};

// Hook to update access request status
export const useUpdateAccessRequestStatus = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminEmail,
    }: {
      id: string;
      status: "pending" | "approved" | "rejected";
      adminEmail?: string;
    }) =>
      convex.mutation(api.accessRequests.updateStatus, {
        id: id as any,
        status,
        adminEmail,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["accessRequest", id],
      });
    },
  });
};

// Admin hooks for removed jobs/internships
export const useRemovedJobs = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["removedJobs"],
    queryFn: async () => {
      return await convex.query(api.admin.getRemovedJobs);
    },
  });
};

export const useRemovedInternships = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["removedInternships"],
    queryFn: async () => {
      return await convex.query(api.admin.getRemovedInternships);
    },
  });
};

export const useRestoreRemovedJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"removed_jobs">) =>
      convex.mutation(api.admin.restoreRemovedJob, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useRestoreRemovedInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"removed_internships">) =>
      convex.mutation(api.admin.restoreRemovedInternship, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedInternships"] });
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

export const usePermanentlyDeleteRemovedJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"removed_jobs">) =>
      convex.mutation(api.admin.permanentlyDeleteRemovedJob, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedJobs"] });
    },
  });
};

export const usePermanentlyDeleteRemovedInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"removed_internships">) =>
      convex.mutation(api.admin.permanentlyDeleteRemovedInternship, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedInternships"] });
    },
  });
};

// Hook to get matching CVs for a job
export const useMatchingCVsForJob = (jobId: Id<"jobs"> | null) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["matchingCVsForJob", jobId],
    queryFn: async () => {
      if (!jobId) return [];
      return await convex.query(api.jobs.getMatchingCVsForJob, { jobId });
    },
    enabled: !!jobId,
  });
};

// Hook to get matching jobs for a CV
export const useMatchingJobsForCV = (cvId: Id<"cv_showcase"> | null) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["matchingJobsForCV", cvId],
    queryFn: async () => {
      if (!cvId) return [];
      return await convex.query(api.cvShowcase.getMatchingJobsForCV, { cvId });
    },
    enabled: !!cvId,
  });
};

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
