import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all internships with optional filters
export const getInternships = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let internships = await ctx.db.query("internships").collect();

    // Apply filters if provided
    if (args.filters) {
      internships = internships.filter((internship) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && internship[key as keyof typeof internship] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return internships;
  },
});

// Query to get a single internship by ID
export const getInternship = query({
  args: { id: v.id("internships") },
  handler: async (ctx, args) => {
    const internship = await ctx.db.get(args.id);
    if (!internship) {
      throw new Error("Internship not found");
    }
    return internship;
  },
});

// Mutation to create a new internship
export const createInternship = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    department: v.optional(v.string()),
    duration: v.string(),
    is_paid: v.boolean(),
    stipend: v.optional(v.string()),
    location: v.optional(v.string()),
    positions: v.optional(v.number()),
    poster_email: v.string(),
    poster_role: v.string(),
    contact_email: v.string(),
    contact_phone: v.optional(v.string()),
    start_date: v.optional(v.string()),
    application_deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    const internshipId = await ctx.db.insert("internships", {
      ...args,
      is_active: true,
      is_approved: false,
      status: "pending",
      posted_by: null,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(internshipId);
  },
});

// Mutation to update an internship
export const updateInternship = mutation({
  args: {
    id: v.id("internships"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    department: v.optional(v.string()),
    duration: v.optional(v.string()),
    is_paid: v.optional(v.boolean()),
    stipend: v.optional(v.string()),
    location: v.optional(v.string()),
    positions: v.optional(v.number()),
    poster_email: v.optional(v.string()),
    poster_role: v.optional(v.string()),
    contact_email: v.optional(v.string()),
    contact_phone: v.optional(v.string()),
    start_date: v.optional(v.string()),
    application_deadline: v.optional(v.string()),
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

// Mutation to delete an internship
export const deleteInternship = mutation({
  args: { id: v.id("internships") },
  handler: async (ctx, args) => {
    const internship = await ctx.db.get(args.id);
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Move to removed_internships table before deleting
    const now = new Date().toISOString();
    await ctx.db.insert("removed_internships", {
      title: internship.title,
      company: internship.company,
      poster_email: internship.poster_email,
      poster_role: internship.poster_role,
      description: internship.description,
      requirements: internship.requirements,
      skills: internship.skills,
      department: internship.department,
      duration: internship.duration,
      is_paid: internship.is_paid,
      stipend: internship.stipend,
      location: internship.location,
      positions: internship.positions,
      contact_email: internship.contact_email,
      contact_phone: internship.contact_phone,
      start_date: internship.start_date,
      application_deadline: internship.application_deadline,
      is_active: internship.is_active,
      is_approved: internship.is_approved,
      status: internship.status,
      posted_by: internship.posted_by,
      original_created_at: internship.created_at,
      original_updated_at: internship.updated_at,
      removed_at: now,
      removed_by: null,
      removal_reason: "Deleted by user",
    });

    await ctx.db.delete(args.id);
    return { success: true };
  },
}); 