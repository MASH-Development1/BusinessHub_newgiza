import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all CV showcase entries with optional filters
export const getCvShowcase = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let cvShowcase = await ctx.db.query("cv_showcase").collect();

    // Apply filters if provided
    if (args.filters) {
      cvShowcase = cvShowcase.filter((cv) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && cv[key as keyof typeof cv] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return cvShowcase;
  },
});

// Query to get a single CV by ID
export const getCv = query({
  args: { id: v.id("cv_showcase") },
  handler: async (ctx, args) => {
    const cv = await ctx.db.get(args.id);
    if (!cv) {
      throw new Error("CV not found");
    }
    return cv;
  },
});

// Mutation to create a new CV showcase entry
export const createCvShowcase = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    title: v.string(),
    section: v.string(),
    bio: v.optional(v.string()),
    skills: v.optional(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
    years_of_experience: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    const cvId = await ctx.db.insert("cv_showcase", {
      ...args,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(cvId);
  },
});

// Mutation to update a CV showcase entry
export const updateCvShowcase = mutation({
  args: {
    id: v.id("cv_showcase"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    title: v.optional(v.string()),
    section: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
    years_of_experience: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
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

// Mutation to delete a CV showcase entry
export const deleteCvShowcase = mutation({
  args: { id: v.id("cv_showcase") },
  handler: async (ctx, args) => {
    const cv = await ctx.db.get(args.id);
    if (!cv) {
      throw new Error("CV not found");
    }

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

// Query: Find matching jobs for a CV
export const getMatchingJobsForCV = query({
  args: { cvId: v.id("cv_showcase") },
  handler: async (ctx, args) => {
    const cv = await ctx.db.get(args.cvId);
    if (!cv) throw new Error("CV not found");
    const allJobs = await ctx.db.query("jobs").collect();
    const cvKeywords = extractKeywords(
      (cv.name || "") + " " + (cv.title || "") + " " + (cv.section || "") + " " + (cv.bio || "") + " " + (cv.skills || "")
    );
    const jobMatches = allJobs
      .map((job) => {
        const jobKeywords = extractKeywords(
          (job.title || "") + " " + (job.industry || "") + " " + (job.skills || "") + " " + (job.description || "") + " " + (job.requirements || "")
        );
        const score = calculateMatchScore(cvKeywords, jobKeywords);
        return { ...job, score: Math.round(score * 100) };
      })
      .filter((match) => match.score > 30)
      .sort((a, b) => b.score - a.score);
    return jobMatches;
  },
}); 