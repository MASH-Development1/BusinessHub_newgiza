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

    // For now, return empty array since we don't have a removed_jobs table
    // This would need to be implemented based on your schema
    return [];
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

    // For now, return empty array since we don't have a removed_internships table
    // This would need to be implemented based on your schema
    return [];
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