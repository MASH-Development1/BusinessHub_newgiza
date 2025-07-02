import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for basic user management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"), // user, admin
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Professional directory profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  bio: text("bio"),
  skills: text("skills"), // JSON array of skills
  industry: varchar("industry", { length: 100 }),
  experienceLevel: varchar("experience_level", { length: 50 }),
  contact: varchar("contact", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  howCanYouSupport: text("how_can_you_support"),
  portfolioUrl: varchar("portfolio_url", { length: 500 }),
  cvFileName: varchar("cv_file_name", { length: 500 }),
  cvFilePath: varchar("cv_file_path", { length: 500 }),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job postings
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  posterEmail: varchar("poster_email", { length: 255 }).notNull(), // Auto-captured from authenticated user
  posterRole: varchar("poster_role", { length: 100 }).notNull(), // CEO, Hiring Manager, HR, etc.
  description: text("description").notNull(),
  requirements: text("requirements"),
  skills: text("skills"), // JSON array of required skills
  industry: varchar("industry", { length: 100 }),
  experienceLevel: varchar("experience_level", { length: 50 }),
  jobType: varchar("job_type", { length: 50 }), // full-time, part-time, contract
  location: varchar("location", { length: 255 }),
  salaryRange: varchar("salary_range", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 })
    .notNull()
    .default("contact@company.com"),
  contactPhone: varchar("contact_phone", { length: 50 })
    .notNull()
    .default("TBD"),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected
  postedBy: integer("posted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Internship postings
export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  posterEmail: varchar("poster_email", { length: 255 }).notNull(), // Auto-captured from authenticated user
  posterRole: varchar("poster_role", { length: 100 }).notNull(), // HR Manager, Team Lead, etc.
  description: text("description").notNull(),
  requirements: text("requirements"),
  skills: text("skills"), // JSON array of required skills
  department: varchar("department", { length: 100 }),
  duration: varchar("duration", { length: 50 }).notNull(), // 3 months, 6 months, etc.
  isPaid: boolean("is_paid").default(false),
  stipend: varchar("stipend", { length: 100 }), // Amount if paid
  location: varchar("location", { length: 255 }),
  positions: integer("positions").default(1), // Number of available positions
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  startDate: varchar("start_date", { length: 100 }), // When internship starts
  applicationDeadline: varchar("application_deadline", { length: 100 }),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected
  postedBy: integer("posted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses and announcements
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // course, webinar, workshop, event, announcement
  instructor: varchar("instructor", { length: 255 }),
  duration: varchar("duration", { length: 100 }),
  price: varchar("price", { length: 50 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  location: varchar("location", { length: 255 }),
  isOnline: boolean("is_online").default(false),
  registrationUrl: varchar("registration_url", { length: 500 }),
  skills: text("skills"), // JSON array of skills taught
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  isFeatured: boolean("is_featured").default(false),
  postedBy: integer("posted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applications for jobs and internships
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicantName: varchar("applicant_name", { length: 255 }).notNull(),
  applicantEmail: varchar("applicant_email", { length: 255 }).notNull(),
  applicantPhone: varchar("applicant_phone", { length: 50 }).notNull(),
  coverLetter: text("cover_letter"),
  cvFileName: varchar("cv_file_name", { length: 255 }),
  cvFilePath: varchar("cv_file_path", { length: 500 }),
  jobId: integer("job_id").references(() => jobs.id),
  internshipId: integer("internship_id").references(() => internships.id),
  status: varchar("status", { length: 50 }).default("submitted"), // submitted, under review, interview, accepted, rejected
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CV Showcase for community networking by professional sections
export const cvShowcase = pgTable("cv_showcase", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  section: varchar("section", { length: 100 }).notNull(), // Technology, Marketing, Finance, HR, Sales, Procurement
  bio: text("bio"),
  skills: text("skills"), // Comma-separated skills
  experience: text("experience"),
  education: text("education"),
  yearsOfExperience: varchar("years_of_experience", { length: 50 }),
  cvFileName: varchar("cv_file_name", { length: 255 }),
  cvFilePath: varchar("cv_file_path", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email whitelist for resident access control
export const emailWhitelist = pgTable("email_whitelist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  unit: varchar("unit", { length: 100 }), // Apartment/villa number
  phone: varchar("phone", { length: 50 }),
  isActive: boolean("is_active").default(true),
  addedBy: varchar("added_by", { length: 255 }), // Admin who added this email
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accessRequests = pgTable("access_requests", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  mobile: varchar("mobile", { length: 20 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community Benefits table for admin management
export const communityBenefits = pgTable("community_benefits", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  discountPercentage: varchar("discount_percentage", { length: 50 }),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 500 }),
  imageUrl: varchar("image_url", { length: 1000 }),
  imageUrls: text("image_urls").array(),
  validUntil: varchar("valid_until", { length: 255 }),
  category: varchar("category", { length: 100 }),
  isActive: boolean("is_active").default(true),
  showOnHomepage: boolean("show_on_homepage").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Removed jobs (soft delete)
export const removedJobs = pgTable("removed_jobs", {
  id: serial("id").primaryKey(),
  originalJobId: integer("original_job_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  posterEmail: varchar("poster_email", { length: 255 }).notNull(),
  posterRole: varchar("poster_role", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  skills: text("skills"),
  industry: varchar("industry", { length: 100 }),
  experienceLevel: varchar("experience_level", { length: 50 }),
  jobType: varchar("job_type", { length: 50 }),
  location: varchar("location", { length: 255 }),
  salaryRange: varchar("salary_range", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  isActive: boolean("is_active"),
  isApproved: boolean("is_approved"),
  status: varchar("status", { length: 20 }),
  postedBy: integer("posted_by"),
  originalCreatedAt: timestamp("original_created_at"),
  originalUpdatedAt: timestamp("original_updated_at"),
  removedAt: timestamp("removed_at").defaultNow(),
  removedBy: integer("removed_by").references(() => users.id),
  removalReason: varchar("removal_reason", { length: 500 }),
});

// Removed internships (soft delete)
export const removedInternships = pgTable("removed_internships", {
  id: serial("id").primaryKey(),
  originalInternshipId: integer("original_internship_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  posterEmail: varchar("poster_email", { length: 255 }).notNull(),
  posterRole: varchar("poster_role", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  skills: text("skills"),
  department: varchar("department", { length: 100 }),
  duration: varchar("duration", { length: 50 }).notNull(),
  isPaid: boolean("is_paid"),
  stipend: varchar("stipend", { length: 100 }),
  location: varchar("location", { length: 255 }),
  positions: integer("positions"),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  startDate: varchar("start_date", { length: 100 }),
  applicationDeadline: varchar("application_deadline", { length: 100 }),
  isActive: boolean("is_active"),
  isApproved: boolean("is_approved"),
  status: varchar("status", { length: 20 }),
  postedBy: integer("posted_by"),
  originalCreatedAt: timestamp("original_created_at"),
  originalUpdatedAt: timestamp("original_updated_at"),
  removedAt: timestamp("removed_at").defaultNow(),
  removedBy: integer("removed_by").references(() => users.id),
  removalReason: varchar("removal_reason", { length: 500 }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  jobs: many(jobs),
  internships: many(internships),
  courses: many(courses),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  postedBy: one(users, {
    fields: [jobs.postedBy],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const internshipsRelations = relations(internships, ({ one, many }) => ({
  postedBy: one(users, {
    fields: [internships.postedBy],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  postedBy: one(users, {
    fields: [courses.postedBy],
    references: [users.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  internship: one(internships, {
    fields: [applications.internshipId],
    references: [internships.id],
  }),
}));

export const removedJobsRelations = relations(removedJobs, ({ one }) => ({
  postedBy: one(users, {
    fields: [removedJobs.postedBy],
    references: [users.id],
  }),
}));

export const removedInternshipsRelations = relations(
  removedInternships,
  ({ one }) => ({
    postedBy: one(users, {
      fields: [removedInternships.postedBy],
      references: [users.id],
    }),
  })
);

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // Make these fields explicitly optional since they come from form data
    userId: z.number().optional(),
    skills: z.string().optional(),
    experienceLevel: z.string().optional(),
    linkedinUrl: z.string().optional(),
    portfolioUrl: z.string().optional(),
  });

export const insertJobSchema = createInsertSchema(jobs)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    posterEmail: true, // Auto-captured from authenticated user
  })
  .extend({
    posterRole: z.string().min(1, "Role in company is required"),
  });

export const insertInternshipSchema = createInsertSchema(internships)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    posterEmail: true, // Auto-captured from authenticated user
    isApproved: true,
    status: true,
    postedBy: true,
  })
  .extend({
    posterRole: z.string().min(1, "Role in company is required"),
    duration: z.string().min(1, "Duration is required"),
    contactEmail: z.string().email("Valid contact email is required"),
  });

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRemovedJobSchema = createInsertSchema(removedJobs).omit({
  id: true,
  removedAt: true,
});

export const insertRemovedInternshipSchema = createInsertSchema(
  removedInternships
).omit({
  id: true,
  removedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCvShowcaseSchema = createInsertSchema(cvShowcase).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailWhitelistSchema = createInsertSchema(
  emailWhitelist
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityBenefitSchema = createInsertSchema(
  communityBenefits
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type RemovedJob = typeof removedJobs.$inferSelect;
export type InsertRemovedJob = z.infer<typeof insertRemovedJobSchema>;

export type RemovedInternship = typeof removedInternships.$inferSelect;
export type InsertRemovedInternship = z.infer<
  typeof insertRemovedInternshipSchema
>;

export type Internship = typeof internships.$inferSelect;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type CvShowcase = typeof cvShowcase.$inferSelect;
export type InsertCvShowcase = z.infer<typeof insertCvShowcaseSchema>;

export type EmailWhitelist = typeof emailWhitelist.$inferSelect;
export type InsertEmailWhitelist = z.infer<typeof insertEmailWhitelistSchema>;

export type CommunityBenefit = typeof communityBenefits.$inferSelect;
export type InsertCommunityBenefit = z.infer<
  typeof insertCommunityBenefitSchema
>;
