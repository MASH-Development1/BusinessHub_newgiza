import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query to get all removed jobs
export const getRemovedJobs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get all removed jobs
    const removedJobs = await ctx.db.query("removed_jobs").collect();
    return removedJobs;
  },
});

// Query to get all removed internships
export const getRemovedInternships = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get all removed internships
    const removedInternships = await ctx.db.query("removed_internships").collect();
    return removedInternships;
  },
});

// Mutation to restore a removed job
export const restoreRemovedJob = mutation({
  args: { id: v.id("removed_jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get the removed job
    const removedJob = await ctx.db.get(args.id);
    if (!removedJob) {
      throw new Error("Removed job not found");
    }

    // Create a new job from the removed job data
    const now = new Date().toISOString();
    const newJobId = await ctx.db.insert("jobs", {
      title: removedJob.title,
      company: removedJob.company,
      poster_email: removedJob.poster_email,
      poster_role: removedJob.poster_role,
      description: removedJob.description,
      requirements: removedJob.requirements,
      skills: removedJob.skills,
      industry: removedJob.industry,
      experience_level: removedJob.experience_level,
      job_type: removedJob.job_type,
      location: removedJob.location,
      salary_range: removedJob.salary_range,
      contact_email: removedJob.contact_email,
      contact_phone: removedJob.contact_phone,
      is_active: true,
      is_approved: true,
      status: "active",
      posted_by: removedJob.posted_by,
      created_at: removedJob.original_created_at || now,
      updated_at: now,
    });

    // Delete the removed job record
    await ctx.db.delete(args.id);

    return { success: true, restoredJobId: newJobId };
  },
});

// Mutation to restore a removed internship
export const restoreRemovedInternship = mutation({
  args: { id: v.id("removed_internships") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get the removed internship
    const removedInternship = await ctx.db.get(args.id);
    if (!removedInternship) {
      throw new Error("Removed internship not found");
    }

    // Create a new internship from the removed internship data
    const now = new Date().toISOString();
    const newInternshipId = await ctx.db.insert("internships", {
      title: removedInternship.title,
      company: removedInternship.company,
      poster_email: removedInternship.poster_email,
      poster_role: removedInternship.poster_role,
      description: removedInternship.description,
      requirements: removedInternship.requirements,
      skills: removedInternship.skills,
      department: removedInternship.department,
      duration: removedInternship.duration,
      is_paid: removedInternship.is_paid ?? false,
      stipend: removedInternship.stipend,
      location: removedInternship.location,
      positions: removedInternship.positions,
      contact_email: removedInternship.contact_email,
      contact_phone: removedInternship.contact_phone,
      start_date: removedInternship.start_date,
      application_deadline: removedInternship.application_deadline,
      is_active: true,
      is_approved: true,
      status: "active",
      posted_by: removedInternship.posted_by,
      created_at: removedInternship.original_created_at || now,
      updated_at: now,
    });

    // Delete the removed internship record
    await ctx.db.delete(args.id);

    return { success: true, restoredInternshipId: newInternshipId };
  },
});

// Mutation to permanently delete a removed job
export const permanentlyDeleteRemovedJob = mutation({
  args: { id: v.id("removed_jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Delete the removed job record
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation to permanently delete a removed internship
export const permanentlyDeleteRemovedInternship = mutation({
  args: { id: v.id("removed_internships") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Delete the removed internship record
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation to approve a job
export const approveJob = mutation({
  args: {
    id: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.id, {
      is_approved: true,
      status: "approved",
      updated_at: new Date().toISOString(),
    });
  },
});

// Mutation to approve an internship
export const approveInternship = mutation({
  args: {
    id: v.id("internships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.id, {
      is_approved: true,
      status: "approved",
      updated_at: new Date().toISOString(),
    });
  },
});

// Mutation to reject an internship
export const rejectInternship = mutation({
  args: {
    id: v.id("internships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.id, {
      status: "rejected",
      updated_at: new Date().toISOString(),
    });
  },
});

// Mutation to approve access request and add to whitelist
export const approveAccessRequest = mutation({
  args: {
    id: v.id("access_requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get the access request
    const request = await ctx.db.get(args.id);
    if (!request) {
      throw new Error("Access request not found");
    }

    // Update request status
    await ctx.db.patch(args.id, {
      status: "approved",
      updated_at: new Date().toISOString(),
    });

    // Add email to whitelist
    const existingEmail = await ctx.db
      .query("email_whitelist")
      .withIndex("email", (q) => q.eq("email", request.email))
      .first();

    if (!existingEmail) {
      await ctx.db.insert("email_whitelist", {
        email: request.email,
        name: request.full_name,
        unit: request.unit_number,
        phone: request.mobile,
        is_active: true,
        added_by: identity.email!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  },
});

// Mutation to reject access request
export const rejectAccessRequest = mutation({
  args: {
    id: v.id("access_requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.id, {
      status: "rejected",
      updated_at: new Date().toISOString(),
    });
  },
}); 