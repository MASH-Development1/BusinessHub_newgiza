import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  access_requests: defineTable({
    full_name: v.string(),
    email: v.string(),
    unit_number: v.string(),
    mobile: v.optional(v.union(v.string(), v.null())), // Allow null for optional field
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ), // Set default in mutation logic
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }).index("email", ["email"]),

  applications: defineTable({
    applicant_name: v.string(),
    applicant_email: v.string(),
    applicant_phone: v.string(),
    cover_letter: v.optional(v.union(v.string(), v.null())),
    cv_file_name: v.optional(v.union(v.string(), v.null())),
    cv_file_path: v.optional(v.union(v.string(), v.null())),
    job_id: v.optional(v.union(v.id("jobs"), v.null())),
    internship_id: v.optional(v.union(v.id("internships"), v.null())),
    status: v.string(), // Set default in mutation logic
    notes: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }).index("applicant_email", ["applicant_email"]),

  backup_data: defineTable({
    backup_id: v.string(),
    table_name: v.string(),
    data: v.array(v.any()),
    created_at: v.string(), // ISO8601 date string
  }).index("backup_id", ["backup_id"]),

  backups: defineTable({
    backup_id: v.string(),
    metadata: v.any(), // BackupMetadata interface
    created_at: v.string(), // ISO8601 date string
    created_by: v.string(),
  }).index("backup_id", ["backup_id"]),

  community_benefits: defineTable({
    title: v.string(),
    description: v.string(),
    discount_percentage: v.optional(v.union(v.string(), v.null())),
    business_name: v.string(),
    location: v.optional(v.union(v.string(), v.null())),
    image_url: v.optional(v.union(v.string(), v.null())),
    valid_until: v.optional(v.union(v.string(), v.null())),
    category: v.optional(v.union(v.string(), v.null())),
    is_active: v.boolean(), // Set default in mutation logic
    show_on_homepage: v.boolean(), // Set default in mutation logic
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
    image_urls: v.optional(v.union(v.array(v.string()), v.null())),
  }),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    instructor: v.optional(v.union(v.string(), v.null())),
    duration: v.optional(v.union(v.string(), v.null())),
    price: v.optional(v.union(v.string(), v.null())),
    start_date: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    end_date: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    max_attendees: v.optional(v.union(v.number(), v.null())),
    current_attendees: v.optional(v.union(v.number(), v.null())), // set default in mutation logic
    location: v.optional(v.union(v.string(), v.null())),
    is_online: v.boolean(), // set default in mutation logic
    registration_url: v.optional(v.union(v.string(), v.null())),
    skills: v.optional(v.union(v.string(), v.null())),
    is_active: v.boolean(), // set default in mutation logic
    is_featured: v.boolean(), // set default in mutation logic
    posted_by: v.optional(v.union(v.string(), v.null())), // Convex auth user ID
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
    is_approved: v.boolean(), // set default in mutation logic
  }),

  cv_emergency_backup_data: defineTable({
    backup_id: v.string(),
    cv_id: v.number(),
    cv_data: v.any(),
    created_at: v.string(), // ISO8601 date string
  }).index("backup_id", ["backup_id"]),

  cv_emergency_backups: defineTable({
    backup_id: v.string(),
    cv_count: v.number(),
    created_at: v.string(), // ISO8601 date string
    created_by: v.string(),
    status: v.string(),
  }).index("backup_id", ["backup_id"]),

  cv_protection: defineTable({
    cv_id: v.number(),
    user_email: v.string(),
    original_filename: v.string(),
    protected_paths: v.array(v.string()),
    protected_at: v.string(), // ISO8601 date string
    status: v.union(
      v.literal("protected"),
      v.literal("missing"),
      v.literal("corrupted")
    ),
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }).index("cv_id", ["cv_id"]),

  cv_showcase: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.union(v.string(), v.null())),
    title: v.string(),
    section: v.string(),
    bio: v.optional(v.union(v.string(), v.null())),
    skills: v.optional(v.union(v.string(), v.null())),
    experience: v.optional(v.union(v.string(), v.null())),
    education: v.optional(v.union(v.string(), v.null())),
    years_of_experience: v.optional(v.union(v.string(), v.null())),
    cv_file_name: v.optional(v.union(v.string(), v.null())),
    cv_file_path: v.optional(v.union(v.string(), v.null())),
    cv_storage_id: v.optional(v.union(v.id("_storage"), v.null())),
    linkedin_url: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }),

  email_whitelist: defineTable({
    email: v.string(),
    name: v.optional(v.union(v.string(), v.null())),
    unit: v.optional(v.union(v.string(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    is_active: v.boolean(), // Set default in mutation logic
    added_by: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }).index("email", ["email"]),

  internships: defineTable({
    title: v.string(),
    company: v.string(),
    poster_email: v.string(),
    poster_role: v.string(),
    description: v.string(),
    requirements: v.optional(v.union(v.string(), v.null())),
    skills: v.optional(v.union(v.string(), v.null())),
    department: v.optional(v.union(v.string(), v.null())),
    duration: v.string(),
    is_paid: v.optional(v.union(v.boolean(), v.null())),
    stipend: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    positions: v.optional(v.union(v.number(), v.null())),
    contact_email: v.string(),
    contact_phone: v.optional(v.union(v.string(), v.null())),
    start_date: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    application_deadline: v.optional(v.union(v.string(), v.null())),
    is_active: v.optional(v.union(v.boolean(), v.null())),
    is_approved: v.optional(v.union(v.boolean(), v.null())),
    status: v.optional(v.union(v.string(), v.null())), // VARCHAR(20)
    posted_by: v.optional(v.union(v.string(), v.null())), // Convex auth user ID
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }),

  jobs: defineTable({
    title: v.string(), // VARCHAR(255), NOT NULL
    company: v.string(), // VARCHAR(255), NOT NULL
    poster_email: v.string(), // VARCHAR(255), NOT NULL
    poster_role: v.string(), // VARCHAR(100), NOT NULL
    description: v.string(), // TEXT, NOT NULL
    requirements: v.optional(v.union(v.string(), v.null())), // TEXT
    skills: v.optional(v.union(v.string(), v.null())), // TEXT
    industry: v.optional(v.union(v.string(), v.null())), // VARCHAR(100)
    experience_level: v.optional(v.union(v.string(), v.null())), // VARCHAR(50)
    job_type: v.optional(v.union(v.string(), v.null())), // VARCHAR(50)
    location: v.optional(v.union(v.string(), v.null())), // VARCHAR(255)
    salary_range: v.optional(v.union(v.string(), v.null())), // VARCHAR(100)
    contact_email: v.string(), // VARCHAR(255), NOT NULL
    contact_phone: v.string(), // VARCHAR(50), NOT NULL
    is_active: v.optional(v.union(v.boolean(), v.null())),
    is_approved: v.optional(v.union(v.boolean(), v.null())),
    status: v.optional(v.union(v.string(), v.null())), // VARCHAR(20)
    posted_by: v.optional(v.union(v.string(), v.null())), // Convex auth user ID
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
  }),

  profiles: defineTable({
    user_id: v.optional(v.union(v.id("email_whitelist"), v.null())), // Optional for initial profile creation
    name: v.string(),
    title: v.string(),
    company: v.optional(v.union(v.string(), v.null())),
    bio: v.optional(v.union(v.string(), v.null())),
    skills: v.optional(v.union(v.string(), v.null())),
    industry: v.optional(v.union(v.string(), v.null())),
    experience_level: v.optional(v.union(v.string(), v.null())),
    contact: v.optional(v.union(v.string(), v.null())),
    linkedin_url: v.optional(v.union(v.string(), v.null())),
    portfolio_url: v.optional(v.union(v.string(), v.null())),
    is_visible: v.boolean(), // Set default in mutation logic
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
    phone: v.optional(v.union(v.string(), v.null())),
    how_can_you_support: v.optional(v.union(v.string(), v.null())),
    cv_file_name: v.optional(v.union(v.string(), v.null())),
    cv_file_path: v.optional(v.union(v.string(), v.null())),
  }),

  removed_internships: defineTable({
    title: v.string(),
    company: v.string(),
    poster_email: v.string(),
    poster_role: v.string(),
    description: v.string(),
    requirements: v.optional(v.union(v.string(), v.null())),
    skills: v.optional(v.union(v.string(), v.null())),
    department: v.optional(v.union(v.string(), v.null())),
    duration: v.string(),
    is_paid: v.optional(v.union(v.boolean(), v.null())),
    stipend: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    positions: v.optional(v.union(v.number(), v.null())),
    contact_email: v.string(),
    contact_phone: v.optional(v.union(v.string(), v.null())),
    start_date: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    application_deadline: v.optional(v.union(v.string(), v.null())),
    is_active: v.optional(v.union(v.boolean(), v.null())),
    is_approved: v.optional(v.union(v.boolean(), v.null())),
    status: v.optional(v.union(v.string(), v.null())),
    posted_by: v.optional(v.union(v.string(), v.null())), // Convex auth user ID
    original_created_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    original_updated_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    removed_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    removed_by: v.optional(v.union(v.id("email_whitelist"), v.null())),
    removal_reason: v.optional(v.union(v.string(), v.null())),
  })
    .index("by_removed_at", ["removed_at"])
    .index("by_removed_by", ["removed_by"]),

  removed_jobs: defineTable({
    title: v.string(), // VARCHAR(255), NOT NULL
    company: v.string(), // VARCHAR(255), NOT NULL
    poster_email: v.string(), // VARCHAR(255), NOT NULL
    poster_role: v.string(), // VARCHAR(100), NOT NULL
    description: v.string(), // TEXT, NOT NULL
    requirements: v.optional(v.union(v.string(), v.null())), // TEXT
    skills: v.optional(v.union(v.string(), v.null())), // TEXT
    industry: v.optional(v.union(v.string(), v.null())), // VARCHAR(100)
    experience_level: v.optional(v.union(v.string(), v.null())), // VARCHAR(50)
    job_type: v.optional(v.union(v.string(), v.null())), // VARCHAR(50)
    location: v.optional(v.union(v.string(), v.null())), // VARCHAR(255)
    salary_range: v.optional(v.union(v.string(), v.null())), // VARCHAR(100)
    contact_email: v.string(), // VARCHAR(255), NOT NULL
    contact_phone: v.string(), // VARCHAR(50), NOT NULL
    is_active: v.optional(v.union(v.boolean(), v.null())),
    is_approved: v.optional(v.union(v.boolean(), v.null())),
    status: v.optional(v.union(v.string(), v.null())), // VARCHAR(20)
    posted_by: v.optional(v.union(v.string(), v.null())), // Convex auth user ID
    original_created_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    original_updated_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    removed_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
    removed_by: v.optional(v.union(v.id("email_whitelist"), v.null())), // INTEGER (foreign key, enforce in logic)
    removal_reason: v.optional(v.union(v.string(), v.null())), // VARCHAR(500)
  }).index("by_removed_at", ["removed_at"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("admin"),
      v.literal("recruiter")
    ), // Set default in mutation logic
    created_at: v.string(), // ISO8601 date string
    updated_at: v.string(), // ISO8601 date string
    last_login_at: v.optional(v.union(v.string(), v.null())), // ISO8601 date string
  }).index("email", ["email"]),

  sessions: defineTable({
    session_id: v.string(),
    email: v.string(),
    is_admin: v.boolean(),
    created_at: v.string(), // ISO8601 date string
    expires_at: v.string(), // ISO8601 date string
  }).index("session_id", ["session_id"]),
});
