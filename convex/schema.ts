import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  access_requests: defineTable({
    full_name: v.string(),
    email: v.string(),
    unit_number: v.string(),
    mobile: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ), // Set default in mutation logic
    created_at: v.number(), // Store as timestamp (ms since epoch)
    updated_at: v.number(), // Store as timestamp (ms since epoch)
  }).index("email", ["email"]),

  applications: defineTable({
    applicant_name: v.string(),
    applicant_email: v.string(),
    applicant_phone: v.string(),
    cover_letter: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    job_id: v.optional(v.id("jobs")),
    internship_id: v.optional(v.id("internships")),
    status: v.string(), // Set default in mutation logic
    notes: v.optional(v.string()),
    created_at: v.number(), // Store as timestamp (ms since epoch)
    updated_at: v.number(), // Store as timestamp (ms since epoch)
  }).index("applicant_email", ["applicant_email"]),

  community_benefits: defineTable({
    title: v.string(),
    description: v.string(),
    discount_percentage: v.optional(v.string()),
    business_name: v.string(),
    location: v.optional(v.string()),
    image_url: v.optional(v.string()),
    valid_until: v.optional(v.string()),
    category: v.optional(v.string()),
    is_active: v.boolean(), // Set default in mutation logic
    show_on_homepage: v.boolean(), // Set default in mutation logic
    created_at: v.number(), // Store as timestamp (ms since epoch)
    updated_at: v.number(), // Store as timestamp (ms since epoch)
    image_urls: v.optional(v.array(v.string())),
  }),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    instructor: v.optional(v.string()),
    duration: v.optional(v.string()),
    price: v.optional(v.string()),
    start_date: v.optional(v.number()), // store as timestamp (ms since epoch)
    end_date: v.optional(v.number()), // store as timestamp (ms since epoch)
    max_attendees: v.optional(v.number()),
    current_attendees: v.optional(v.number()), // set default in mutation logic
    location: v.optional(v.string()),
    is_online: v.boolean(), // set default in mutation logic
    registration_url: v.optional(v.string()),
    skills: v.optional(v.string()),
    is_active: v.boolean(), // set default in mutation logic
    is_featured: v.boolean(), // set default in mutation logic
    posted_by: v.optional(v.number()),
    created_at: v.number(), // set in mutation logic
    updated_at: v.number(), // set in mutation logic
    is_approved: v.boolean(), // set default in mutation logic
  }),

  cv_showcase: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    title: v.string(),
    section: v.string(),
    bio: v.optional(v.string()),
    skills: v.optional(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
    years_of_experience: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    created_at: v.number(), // set in mutation logic
    updated_at: v.number(), // set in mutation logic
  }),

  email_whitelist: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    phone: v.optional(v.string()),
    is_active: v.boolean(), // Set default in mutation logic
    added_by: v.optional(v.string()),
    created_at: v.number(), // Set in mutation logic
    updated_at: v.number(), // Set in mutation logic
  }).index("email", ["email"]), // Index for uniqueness check

  internships: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    department: v.optional(v.string()),
    duration: v.string(),
    is_paid: v.boolean(), // Set default in mutation logic
    stipend: v.optional(v.string()),
    location: v.optional(v.string()),
    positions: v.optional(v.number()), // Set default in mutation logic
    is_active: v.boolean(), // Set default in mutation logic
    posted_by: v.optional(v.number()),
    created_at: v.number(), // Set in mutation logic
    updated_at: v.number(), // Set in mutation logic
    is_approved: v.boolean(), // Set default in mutation logic
    poster_email: v.string(),
    poster_role: v.string(),
    contact_email: v.string(),
    contact_phone: v.optional(v.string()),
    start_date: v.optional(v.string()),
    application_deadline: v.optional(v.string()),
    status: v.string(), // Set default in mutation logic
  }),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    skills: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience_level: v.optional(v.string()),
    job_type: v.optional(v.string()),
    location: v.optional(v.string()),
    salary_range: v.optional(v.string()),
    is_active: v.boolean(), // Set default in mutation logic
    posted_by: v.optional(v.number()),
    created_at: v.number(), // Set in mutation logic
    updated_at: v.number(), // Set in mutation logic
    is_approved: v.boolean(), // Set default in mutation logic
    status: v.string(), // Set default in mutation logic
    contact_email: v.string(), // Set default in mutation logic
    contact_phone: v.string(), // Set default in mutation logic
    poster_email: v.string(),
    poster_role: v.string(),
  }),

  profiles: defineTable({
    user_id: v.optional(v.id("users")), // Optional for initial profile creation
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
    is_visible: v.boolean(), // Set default in mutation logic
    created_at: v.number(), // Set in mutation logic
    updated_at: v.number(), // Set in mutation logic
    phone: v.optional(v.string()),
    how_can_you_support: v.optional(v.string()),
    cv_file_name: v.optional(v.string()),
    cv_file_path: v.optional(v.string()),
  }),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("admin"),
      v.literal("recruiter")
    ), // Set default in mutation logic
    created_at: v.number(), // Set in mutation logic
    updated_at: v.number(), // Set in mutation logic
    last_login_at: v.optional(v.number()),
  }).index("email", ["email"]), // Index for uniqueness check
});
