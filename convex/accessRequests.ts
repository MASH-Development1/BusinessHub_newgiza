import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

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
    return await ctx.db.query("access_requests").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("access_requests"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    adminEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the access request details before updating
    const accessRequest = await ctx.db.get(args.id);

    if (!accessRequest) {
      throw new Error("Access request not found");
    }

    // Update the access request status
    await ctx.db.patch(args.id, {
      status: args.status,
      updated_at: new Date().toISOString(),
    });

    // If approved, add to email whitelist
    if (args.status === "approved") {
      try {
        await ctx.runMutation(api.whitelist.addToWhitelist, {
          email: accessRequest.email,
          name: accessRequest.full_name,
          unit: accessRequest.unit_number,
          phone: accessRequest.mobile || undefined,
          addedBy: args.adminEmail || "access_request_approval",
        });
      } catch (error) {
        // If email is already whitelisted, that's okay - just continue
        if (
          error instanceof Error &&
          error.message !== "Email already whitelisted"
        ) {
          throw error;
        }
      }
    }
  },
});

export const deleteRequest = mutation({
  args: {
    id: v.id("access_requests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
