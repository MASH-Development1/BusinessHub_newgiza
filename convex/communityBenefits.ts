import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all community benefits with optional filters
export const getCommunityBenefits = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let benefits = await ctx.db.query("community_benefits").collect();

    // Apply filters if provided
    if (args.filters) {
      benefits = benefits.filter((benefit) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && benefit[key as keyof typeof benefit] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return benefits.reverse();
  },
});

// Query to get community benefits for homepage
export const getHomepageBenefits = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("community_benefits")
      .filter((q) => q.eq(q.field("show_on_homepage"), true))
      .filter((q) => q.eq(q.field("is_active"), true))
      .collect();
  },
});

// Query to get a single community benefit by ID
export const getCommunityBenefit = query({
  args: { id: v.id("community_benefits") },
  handler: async (ctx, args) => {
    const benefit = await ctx.db.get(args.id);
    if (!benefit) {
      throw new Error("Community benefit not found");
    }
    return benefit;
  },
});

// Mutation to create a new community benefit
export const createCommunityBenefit = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    discount_percentage: v.optional(v.string()),
    business_name: v.string(),
    location: v.optional(v.string()),
    image_url: v.optional(v.string()),
    valid_until: v.optional(v.string()),
    category: v.optional(v.string()),
    image_urls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const benefitId = await ctx.db.insert("community_benefits", {
      ...args,
      is_active: true,
      show_on_homepage: false,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(benefitId);
  },
});

// Mutation to update a community benefit
export const updateCommunityBenefit = mutation({
  args: {
    id: v.id("community_benefits"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    discount_percentage: v.optional(v.string()),
    business_name: v.optional(v.string()),
    location: v.optional(v.string()),
    image_url: v.optional(v.string()),
    valid_until: v.optional(v.string()),
    category: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    show_on_homepage: v.optional(v.boolean()),
    image_urls: v.optional(v.array(v.string())),
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

// Mutation to delete a community benefit
export const deleteCommunityBenefit = mutation({
  args: { id: v.id("community_benefits") },
  handler: async (ctx, args) => {
    const benefit = await ctx.db.get(args.id);
    if (!benefit) {
      throw new Error("Community benefit not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
