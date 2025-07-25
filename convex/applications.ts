import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all applications
export const getApplications = query({
  handler: async (ctx) => {
    return (await ctx.db.query("applications").collect()).reverse();
  },
});

// Query to get applications by email
export const getApplicationsByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("applicant_email", (q) => q.eq("applicant_email", args.email))
      .collect();
  },
});

// Mutation to create a job application
export const createJobApplication = mutation({
  args: {
    applicant_email: v.string(),
    applicant_name: v.string(),
    applicant_phone: v.string(),
    cover_letter: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    cv_storage_id: v.optional(v.id("_storage")),
    job_id: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const applicationId = await ctx.db.insert("applications", {
      ...args,
      internship_id: null,
      status: "pending",
      notes: null,
      created_at: now,
      updated_at: now,
    });
    return await ctx.db.get(applicationId);
  },
});

// Mutation to create an internship application
export const createInternshipApplication = mutation({
  args: {
    applicant_email: v.string(),
    applicant_name: v.string(),
    applicant_phone: v.string(),
    cover_letter: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    cv_storage_id: v.optional(v.id("_storage")),
    internship_id: v.id("internships"),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const applicationId = await ctx.db.insert("applications", {
      ...args,
      job_id: null,
      status: "pending",
      notes: null,
      created_at: now,
      updated_at: now,
    });
    return await ctx.db.get(applicationId);
  },
});

// Mutation to update application status
export const updateApplicationStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    await ctx.db.patch(args.id, {
      status: args.status,
      notes: args.notes,
      updated_at: now,
    });

    return await ctx.db.get(args.id);
  },
});

// Mutation to delete an application
export const deleteApplication = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.id);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
