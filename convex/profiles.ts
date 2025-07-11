import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all profiles with optional filters
export const getProfiles = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let profiles = await ctx.db.query("profiles").collect();

    // Apply filters if provided
    if (args.filters) {
      profiles = profiles.filter((profile) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && profile[key as keyof typeof profile] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return profiles;
  },
});

// Query to get a single profile by ID
export const getProfile = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile;
  },
});

// Mutation to create a new profile
export const createProfile = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    company: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience_level: v.optional(v.string()),
    contact: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    portfolio_url: v.optional(v.string()),
    phone: v.optional(v.string()),
    how_can_you_support: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    const profileId = await ctx.db.insert("profiles", {
      ...args,
      user_id: null,
      is_visible: true,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(profileId);
  },
});

// Mutation to update a profile
export const updateProfile = mutation({
  args: {
    id: v.id("profiles"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience_level: v.optional(v.string()),
    contact: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    portfolio_url: v.optional(v.string()),
    is_visible: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    how_can_you_support: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
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

// Mutation to delete a profile
export const deleteProfile = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
}); 