import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query to get all jobs with optional filters
export const getJobs = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db.query("jobs").collect();

    // Apply filters if provided
    if (args.filters) {
      jobs = jobs.filter((job) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && job[key as keyof typeof job] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return jobs.reverse();
  },
});

// Query to get a single job by ID
export const getJob = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  },
});

// Mutation to create a new job
export const createJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience_level: v.optional(v.string()),
    job_type: v.optional(v.string()),
    location: v.optional(v.string()),
    salary_range: v.optional(v.string()),
    contact_email: v.string(),
    contact_phone: v.string(),
    poster_email: v.string(),
    poster_role: v.string(),
    is_active: v.optional(v.boolean()),
    is_approved: v.optional(v.boolean()),
    status: v.optional(v.string()),
    sessionId: v.optional(v.string()), // Add sessionId to identify the current user
  },
  handler: async (ctx, args) => {
    let userId = null;

    // Get current user from session if sessionId provided
    if (args.sessionId) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("session_id", (q) => q.eq("session_id", args.sessionId!))
        .first();

      if (session && new Date(session.expires_at) > new Date()) {
        const user = await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", session.email))
          .first();

        if (user) {
          userId = user._id;
        }
      }
    }

    const now = new Date().toISOString();
    const { sessionId, ...jobData } = args; // Remove sessionId from job data

    const jobId = await ctx.db.insert("jobs", {
      ...jobData,
      is_active: args.is_active ?? true,
      is_approved: args.is_approved ?? false,
      status: args.status ?? "pending",
      posted_by: userId ? userId.toString() : null,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(jobId);
  },
});

// Mutation to update a job
export const updateJob = mutation({
  args: {
    id: v.id("jobs"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience_level: v.optional(v.string()),
    job_type: v.optional(v.string()),
    location: v.optional(v.string()),
    salary_range: v.optional(v.string()),
    contact_email: v.optional(v.string()),
    contact_phone: v.optional(v.string()),
    poster_email: v.optional(v.string()),
    poster_role: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    is_approved: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = new Date().toISOString();

    await ctx.db.patch(id, {
      ...updates,
      updated_at: now,
    });

    return await ctx.db.get(id);
  },
});

// Mutation to delete a job
export const deleteJob = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Move to removed_jobs table before deleting
    const now = new Date().toISOString();
    await ctx.db.insert("removed_jobs", {
      title: job.title,
      company: job.company,
      poster_email: job.poster_email,
      poster_role: job.poster_role,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      industry: job.industry,
      experience_level: job.experience_level,
      job_type: job.job_type,
      location: job.location,
      salary_range: job.salary_range,
      contact_email: job.contact_email,
      contact_phone: job.contact_phone,
      is_active: job.is_active,
      is_approved: job.is_approved,
      status: job.status,
      posted_by: job.posted_by,
      original_created_at: job.created_at,
      original_updated_at: job.updated_at,
      removed_at: now,
      removed_by: null,
      removal_reason: "Deleted by user",
    });

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Utility: extract keywords from text
function extractKeywords(text: string): string[] {
  const relevantSkills = [
    // Technical Skills
    "javascript", "typescript", "react", "node", "python", "java", "php", "sql", "mongodb", "mysql", "html", "css", "angular", "vue", "express", "django", "flask", "spring", "laravel", "aws", "azure", "docker", "kubernetes", "git", "linux", "windows", "oracle", "postgresql", "redis", "elasticsearch",
    // Business Skills
    "marketing", "sales", "finance", "accounting", "hr", "management", "consulting", "legal", "healthcare", "engineering", "design", "operations", "procurement", "real estate", "logistics", "manufacturing", "construction", "education", "retail", "hospitality", "telecommunications",
    // Professional Levels
    "senior", "junior", "lead", "head", "director", "coordinator", "assistant", "executive", "supervisor", "team", "project", "product", "strategy", "business", "technical",
    // Industry Terms
    "digital", "technology", "innovation", "automation", "communication", "customer", "service", "quality", "safety", "compliance", "audit", "risk", "planning", "analysis", "research",
  ];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  return words.filter(
    (word) =>
      relevantSkills.includes(word) ||
      word.includes("engineer") ||
      word.includes("manager") ||
      word.includes("developer") ||
      word.includes("analyst") ||
      word.includes("specialist") ||
      word.includes("coordinator") ||
      word.includes("assistant") ||
      word.includes("supervisor")
  );
}

function calculateMatchScore(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  const intersection = keywords1.filter((keyword) => keywords2.includes(keyword));
  return intersection.length / Math.max(keywords1.length, keywords2.length);
}

// Query: Find matching CVs for a job
export const getMatchingCVsForJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");
    const allCVs = await ctx.db.query("cv_showcase").collect();
    const jobKeywords = extractKeywords(
      (job.title || "") + " " + (job.industry || "") + " " + (job.skills || "")
    );
    return allCVs.filter((cv) => {
      const cvKeywords = extractKeywords(
        (cv.name || "") + " " + (cv.title || "") + " " + (cv.section || "") + " " + (cv.bio || "")
      );
      return calculateMatchScore(jobKeywords, cvKeywords) > 0.3;
    });
  },
});
