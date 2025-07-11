import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all courses with optional filters
export const getCourses = query({
  args: {
    filters: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    let courses = await ctx.db.query("courses").collect();

    // Apply filters if provided
    if (args.filters) {
      courses = courses.filter((course) => {
        for (const [key, value] of Object.entries(args.filters!)) {
          if (value && course[key as keyof typeof course] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return courses;
  },
});

// Query to get a single course by ID
export const getCourse = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  },
});

// Mutation to create a new course
export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    instructor: v.optional(v.string()),
    duration: v.optional(v.string()),
    price: v.optional(v.string()),
    start_date: v.optional(v.string()),
    end_date: v.optional(v.string()),
    max_attendees: v.optional(v.number()),
    location: v.optional(v.string()),
    is_online: v.boolean(),
    registration_url: v.optional(v.string()),
    skills: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    const courseId = await ctx.db.insert("courses", {
      ...args,
      current_attendees: 0,
      is_active: true,
      is_featured: false,
      is_approved: false,
      posted_by: null,
      created_at: now,
      updated_at: now,
    });

    return await ctx.db.get(courseId);
  },
});

// Mutation to update a course
export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    instructor: v.optional(v.string()),
    duration: v.optional(v.string()),
    price: v.optional(v.string()),
    start_date: v.optional(v.string()),
    end_date: v.optional(v.string()),
    max_attendees: v.optional(v.number()),
    current_attendees: v.optional(v.number()),
    location: v.optional(v.string()),
    is_online: v.optional(v.boolean()),
    registration_url: v.optional(v.string()),
    skills: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    is_featured: v.optional(v.boolean()),
    is_approved: v.optional(v.boolean()),
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

// Mutation to delete a course
export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Course not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
}); 