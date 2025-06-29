import { queryClient } from "./queryClient";

export const api = {
  // Job operations
  async getJobs(filters?: Record<string, string>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await fetch(`/api/jobs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  async getJob(id: number) {
    const response = await fetch(`/api/jobs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch job');
    return response.json();
  },

  async createJob(data: any) {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },

  async updateJob(id: number, data: any) {
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update job');
    return response.json();
  },

  async deleteJob(id: number) {
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete job');
  },

  // Internship operations
  async getInternships(filters?: Record<string, string>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await fetch(`/api/internships?${params}`);
    if (!response.ok) throw new Error('Failed to fetch internships');
    return response.json();
  },

  async getInternship(id: number) {
    const response = await fetch(`/api/internships/${id}`);
    if (!response.ok) throw new Error('Failed to fetch internship');
    return response.json();
  },

  async createInternship(data: any) {
    const response = await fetch('/api/internships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create internship');
    return response.json();
  },

  async updateInternship(id: number, data: any) {
    const response = await fetch(`/api/internships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update internship');
    return response.json();
  },

  async deleteInternship(id: number) {
    const response = await fetch(`/api/internships/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete internship');
  },

  // Course operations
  async getCourses(filters?: Record<string, string>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await fetch(`/api/courses?${params}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getCourse(id: number) {
    const response = await fetch(`/api/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  async createCourse(data: any) {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  async updateCourse(id: number, data: any) {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  async deleteCourse(id: number) {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
  },

  // Profile operations
  async getProfiles(filters?: Record<string, string>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await fetch(`/api/profiles?${params}`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  },

  async getProfile(id: number) {
    const response = await fetch(`/api/profiles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async createProfile(data: any) {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
  },

  async updateProfile(id: number, data: any) {
    const response = await fetch(`/api/profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Application operations
  async submitJobApplication(jobId: number, formData: FormData) {
    const response = await fetch(`/api/applications/job/${jobId}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to submit job application');
    return response.json();
  },

  async submitInternshipApplication(internshipId: number, formData: FormData) {
    const response = await fetch(`/api/applications/internship/${internshipId}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to submit internship application');
    return response.json();
  },

  async getApplications() {
    const response = await fetch('/api/applications');
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async updateApplicationStatus(id: number, status: string, notes?: string) {
    const response = await fetch(`/api/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (!response.ok) throw new Error('Failed to update application status');
    return response.json();
  },

  // Stats
  async getStats() {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // CV Showcase operations
  async getCvShowcase(filters?: Record<string, string>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await fetch(`/api/cv-showcase?${params}`);
    if (!response.ok) throw new Error('Failed to fetch CV showcase');
    return response.json();
  },

  async getCv(id: number) {
    const response = await fetch(`/api/cv-showcase/${id}`);
    if (!response.ok) throw new Error('Failed to fetch CV');
    return response.json();
  },

  async createCvShowcase(formData: FormData) {
    const response = await fetch('/api/cv-showcase', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create CV showcase');
    return response.json();
  },

  async updateCvShowcase(id: number, data: any) {
    const response = await fetch(`/api/cv-showcase/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update CV showcase');
    return response.json();
  },

  async deleteCvShowcase(id: number) {
    const response = await fetch(`/api/cv-showcase/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete CV showcase');
    return response.json();
  },

  // Utility functions for cache invalidation
  invalidateQueries: {
    jobs: () => queryClient.invalidateQueries({ queryKey: ["/api/jobs"] }),
    internships: () => queryClient.invalidateQueries({ queryKey: ["/api/internships"] }),
    courses: () => queryClient.invalidateQueries({ queryKey: ["/api/courses"] }),
    profiles: () => queryClient.invalidateQueries({ queryKey: ["/api/profiles"] }),
    applications: () => queryClient.invalidateQueries({ queryKey: ["/api/applications"] }),
    cvShowcase: () => queryClient.invalidateQueries({ queryKey: ["/api/cv-showcase"] }),
    stats: () => queryClient.invalidateQueries({ queryKey: ["/api/stats"] }),
  },
};

export default api;
