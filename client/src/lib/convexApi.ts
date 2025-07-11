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
  numberToConvexId,
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.jobs.updateJob, { id: numberToConvexId(id), ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", numberToConvexId(id)] });
    },
  });
};

// Hook to delete a job
export const useDeleteJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => convex.mutation(api.jobs.deleteJob, { id: numberToConvexId(id) }),
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
      const convexInternships = await convex.query(api.internships.getInternships, { filters });
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
      const convexInternship = await convex.query(api.internships.getInternship, { id });
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
    mutationFn: (data: any) => convex.mutation(api.internships.createInternship, data),
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.internships.updateInternship, { id: numberToConvexId(id), ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
      queryClient.invalidateQueries({ queryKey: ["internship", numberToConvexId(id)] });
    },
  });
};

// Hook to delete an internship
export const useDeleteInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => convex.mutation(api.internships.deleteInternship, { id: numberToConvexId(id) }),
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
      const convexCourses = await convex.query(api.courses.getCourses, { filters });
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.courses.updateCourse, { id: numberToConvexId(id), ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", numberToConvexId(id)] });
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => convex.mutation(api.courses.deleteCourse, { id: numberToConvexId(id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Hook to get applications
export const useApplications = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const convexApplications = await convex.query(api.applications.getApplications);
      return convexApplications.map(adaptApplication);
    },
  });
};

// Hook to create a job application
export const useCreateJobApplication = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => convex.mutation(api.applications.createJobApplication, data),
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
    mutationFn: (data: any) => convex.mutation(api.applications.createInternshipApplication, data),
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
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      convex.mutation(api.applications.updateApplicationStatus, { id: numberToConvexId(id), status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Hook to get CV showcase
export const useCvShowcase = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["cvShowcase", filters],
    queryFn: async () => {
      const convexCvs = await convex.query(api.cvShowcase.getCvShowcase, { filters });
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

// Hook to create CV showcase
export const useCreateCvShowcase = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => convex.mutation(api.cvShowcase.createCvShowcase, data),
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.cvShowcase.updateCvShowcase, { id: numberToConvexId(id), ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["cvShowcase"] });
      queryClient.invalidateQueries({ queryKey: ["cv", numberToConvexId(id)] });
    },
  });
};

// Hook to delete CV showcase
export const useDeleteCvShowcase = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => convex.mutation(api.cvShowcase.deleteCvShowcase, { id: numberToConvexId(id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvShowcase"] });
    },
  });
};

// Hook to get profiles
export const useProfiles = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["profiles", filters],
    queryFn: async () => {
      const convexProfiles = await convex.query(api.profiles.getProfiles, { filters });
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
    mutationFn: (data: any) => convex.mutation(api.profiles.createProfile, data),
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.profiles.updateProfile, { id: numberToConvexId(id), ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile", numberToConvexId(id)] });
    },
  });
};

// Hook to delete a profile
export const useDeleteProfile = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => convex.mutation(api.profiles.deleteProfile, { id: numberToConvexId(id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

// Hook to get community benefits
export const useCommunityBenefits = (filters?: Record<string, string>) => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["communityBenefits", filters],
    queryFn: async () => {
      const convexBenefits = await convex.query(api.communityBenefits.getCommunityBenefits, { filters });
      return convexBenefits.map(adaptCommunityBenefit);
    },
  });
};

// Hook to get homepage community benefits
export const useHomepageBenefits = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["homepageBenefits"],
    queryFn: async () => {
      const convexBenefits = await convex.query(api.communityBenefits.getHomepageBenefits);
      return convexBenefits.map(adaptCommunityBenefit);
    },
  });
};

// Hook to create a community benefit
export const useCreateCommunityBenefit = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => convex.mutation(api.communityBenefits.createCommunityBenefit, data),
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
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      convex.mutation(api.communityBenefits.updateCommunityBenefit, { id: numberToConvexId(id), ...data }),
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
    mutationFn: (id: number) => convex.mutation(api.communityBenefits.deleteCommunityBenefit, { id: numberToConvexId(id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityBenefits"] });
      queryClient.invalidateQueries({ queryKey: ["homepageBenefits"] });
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
    mutationFn: (data: { email: string; name?: string; unit?: string; phone?: string }) =>
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
    mutationFn: (id: Id<"email_whitelist">) => convex.mutation(api.whitelist.removeFromWhitelist, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};

// Hook to update whitelist entry
export const useUpdateWhitelistEntry = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: Id<"email_whitelist">; name?: string; unit?: string; phone?: string; is_active?: boolean }) =>
      convex.mutation(api.whitelist.updateWhitelistEntry, { id, ...data }),
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
      const convexRequests = await convex.query(api.accessRequests.getAll);
      return convexRequests.map(adaptAccessRequest);
    },
  });
};

// Hook to update access request status
export const useUpdateAccessRequestStatus = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: Id<"access_requests">; status: "pending" | "approved" | "rejected" }) =>
      convex.mutation(api.accessRequests.updateStatus, { id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    },
  });
};

// Hook to get removed jobs
export const useRemovedJobs = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["removedJobs"],
    queryFn: () => convex.query(api.admin.getRemovedJobs),
  });
};

// Hook to get removed internships
export const useRemovedInternships = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["removedInternships"],
    queryFn: () => convex.query(api.admin.getRemovedInternships),
  });
};

// Hook to approve job
export const useApproveJob = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: Id<"jobs">) => convex.mutation(api.admin.approveJob, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

// Hook to approve internship
export const useApproveInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: Id<"internships">) => convex.mutation(api.admin.approveInternship, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

// Hook to reject internship
export const useRejectInternship = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: Id<"internships">) => convex.mutation(api.admin.rejectInternship, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

// Hook to approve access request
export const useApproveAccessRequest = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: Id<"access_requests">) => convex.mutation(api.admin.approveAccessRequest, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};

// Hook to reject access request
export const useRejectAccessRequest = () => {
  const convex = useConvex();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: Id<"access_requests">) => convex.mutation(api.admin.rejectAccessRequest, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    },
  });
};

// Hook to get stats
export const useStats = () => {
  const convex = useConvex();
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => convex.query(api.stats.getStats),
  });
}; 