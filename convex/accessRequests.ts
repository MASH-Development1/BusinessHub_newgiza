import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    full_name: v.string(),
    email: v.string(),
    unit_number: v.string(),
    mobile: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    // Check if email already exists in users table
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Check if there's already a pending request for this email
    const existingRequest = await ctx.db
      .query("access_requests")
      .withIndex("email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (existingRequest) {
      throw new Error("Access request already pending for this email");
    }

    const accessRequestId = await ctx.db.insert("access_requests", {
      full_name: args.full_name,
      email: args.email,
      unit_number: args.unit_number,
      mobile: args.mobile,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return accessRequestId;
  },
});

export const getAll = query({
  args: {},
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

    return await ctx.db.query("access_requests").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("access_requests"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
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
      status: args.status,
      updated_at: new Date().toISOString(),
    });
  },
});

export const deleteRequest = mutation({
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

    await ctx.db.delete(args.id);
  },
}); 