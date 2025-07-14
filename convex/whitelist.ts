import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all whitelisted emails
export const getWhitelist = query({
  handler: async (ctx) => {
    return await ctx.db.query("email_whitelist").collect();
  },
});

// Mutation to add email to whitelist
export const addToWhitelist = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    phone: v.optional(v.string()),
    addedBy: v.optional(v.string()), // Add this parameter
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query("email_whitelist")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existingEmail) {
      throw new Error("Email already whitelisted");
    }

    const emailId = await ctx.db.insert("email_whitelist", {
      email: args.email.toLowerCase(),
      name: args.name || null,
      unit: args.unit || null,
      phone: args.phone || null,
      is_active: true,
      added_by: args.addedBy || "anonymous",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return await ctx.db.get(emailId);
  },
});

// Mutation to remove email from whitelist
export const removeFromWhitelist = mutation({
  args: {
    id: v.id("email_whitelist"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation to update whitelist entry
export const updateWhitelistEntry = mutation({
  args: {
    id: v.id("email_whitelist"),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    phone: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});
