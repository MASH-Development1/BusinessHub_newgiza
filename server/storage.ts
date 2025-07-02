import {
  users,
  profiles,
  jobs,
  removedJobs,
  internships,
  removedInternships,
  courses,
  applications,
  cvShowcase,
  emailWhitelist,
  accessRequests,
  communityBenefits,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Job,
  type InsertJob,
  type RemovedJob,
  type InsertRemovedJob,
  type Internship,
  type InsertInternship,
  type RemovedInternship,
  type InsertRemovedInternship,
  type Course,
  type InsertCourse,
  type Application,
  type InsertApplication,
  type CvShowcase,
  type InsertCvShowcase,
  type EmailWhitelist,
  type InsertEmailWhitelist,
  type CommunityBenefit,
  type InsertCommunityBenefit,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Profile operations
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  getAllProfiles(filters?: {
    industry?: string;
    search?: string;
    experienceLevel?: string;
  }): Promise<Profile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile>;
  deleteProfile(id: number): Promise<void>;

  // Job operations
  getAllJobs(filters?: {
    industry?: string;
    search?: string;
    experienceLevel?: string;
  }): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  // Removed Jobs operations
  getAllRemovedJobs(): Promise<RemovedJob[]>;
  getRemovedJob(id: number): Promise<RemovedJob | undefined>;
  moveJobToRemoved(
    jobId: number,
    removedBy?: number,
    reason?: string
  ): Promise<RemovedJob>;
  restoreJobFromRemoved(removedJobId: number): Promise<Job>;

  // Removed Internships operations
  getAllRemovedInternships(): Promise<RemovedInternship[]>;
  getRemovedInternship(id: number): Promise<RemovedInternship | undefined>;
  moveInternshipToRemoved(
    internshipId: number,
    removedBy?: number,
    reason?: string
  ): Promise<RemovedInternship>;
  restoreInternshipFromRemoved(
    removedInternshipId: number
  ): Promise<Internship>;

  // Internship operations
  getAllInternships(filters?: {
    department?: string;
    search?: string;
  }): Promise<Internship[]>;
  getAllInternshipsForAdmin(): Promise<Internship[]>;
  getPendingInternships(): Promise<Internship[]>;
  getInternship(id: number): Promise<Internship | undefined>;
  createInternship(internship: InsertInternship): Promise<Internship>;
  updateInternship(
    id: number,
    internship: Partial<InsertInternship>
  ): Promise<Internship>;
  deleteInternship(id: number): Promise<void>;
  approveInternship(id: number): Promise<Internship>;
  rejectInternship(id: number): Promise<Internship>;

  // Course operations
  getAllCourses(filters?: { type?: string }): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getAllApplications(): Promise<Application[]>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  getApplicationsByInternship(internshipId: number): Promise<Application[]>;
  updateApplicationStatus(
    id: number,
    status: string,
    notes?: string
  ): Promise<Application>;
  deleteApplication(id: number): Promise<void>;

  // CV Showcase operations
  getAllCvShowcase(filters?: {
    section?: string;
    search?: string;
  }): Promise<CvShowcase[]>;
  getCvShowcase(id: number): Promise<CvShowcase | undefined>;
  getCvByFilename(filename: string): Promise<CvShowcase | undefined>;
  createCvShowcase(cv: InsertCvShowcase): Promise<CvShowcase>;
  updateCvShowcase(
    id: number,
    cv: Partial<InsertCvShowcase>
  ): Promise<CvShowcase>;
  deleteCvShowcase(id: number): Promise<void>;

  // Email whitelist operations
  getAllWhitelistedEmails(): Promise<EmailWhitelist[]>;
  isEmailWhitelisted(email: string): Promise<boolean>;
  addEmailToWhitelist(email: InsertEmailWhitelist): Promise<EmailWhitelist>;
  removeEmailFromWhitelist(id: number): Promise<void>;
  bulkAddEmails(emails: InsertEmailWhitelist[]): Promise<EmailWhitelist[]>;

  // Stats
  getStats(): Promise<{
    totalJobs: number;
    totalInternships: number;
    totalCourses: number;
    totalProfiles: number;
    totalApplications: number;
    totalCvs: number;
  }>;

  // Access request operations
  createAccessRequest(data: {
    fullName: string;
    email: string;
    unitNumber: string;
    mobile?: string | null;
  }): Promise<any>; // Replace any with the correct type

  getAccessRequests(): Promise<any[]>; // Replace any[] with the correct type
  approveAccessRequest(requestId: number): Promise<any>; // Replace any with correct type
  rejectAccessRequest(requestId: number): Promise<any>; // Replace any with correct type

  // Community Benefits operations
  getAllCommunityBenefits(): Promise<CommunityBenefit[]>;
  getHomepageBenefits(): Promise<CommunityBenefit[]>;
  getCommunityBenefit(id: number): Promise<CommunityBenefit | undefined>;
  createCommunityBenefit(
    benefit: InsertCommunityBenefit
  ): Promise<CommunityBenefit>;
  updateCommunityBenefit(
    id: number,
    benefit: Partial<InsertCommunityBenefit>
  ): Promise<CommunityBenefit>;
  deleteCommunityBenefit(id: number): Promise<void>;
  getAllActiveBenefits(): Promise<CommunityBenefit[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  // Profile operations
  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async getAllProfiles(filters?: {
    industry?: string;
    search?: string;
    experienceLevel?: string;
  }): Promise<Profile[]> {
    let whereClause = eq(profiles.isVisible, true);

    if (filters?.industry) {
      whereClause = and(whereClause, eq(profiles.industry, filters.industry))!;
    }

    if (filters?.experienceLevel) {
      whereClause = and(
        whereClause,
        eq(profiles.experienceLevel, filters.experienceLevel)
      )!;
    }

    if (filters?.search) {
      whereClause = and(
        whereClause,
        or(
          like(profiles.name, `%${filters.search}%`),
          like(profiles.title, `%${filters.search}%`),
          like(profiles.company, `%${filters.search}%`),
          like(profiles.skills, `%${filters.search}%`)
        )
      )!;
    }

    return await db
      .select()
      .from(profiles)
      .where(whereClause)
      .orderBy(desc(profiles.createdAt));
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    // Ensure required fields are present with defaults if needed
    const profileData = {
      name: profile.name || "Unknown",
      title: profile.title || "Unknown",
      company: profile.company,
      bio: profile.bio,
      skills: profile.skills,
      industry: profile.industry,
      experienceLevel: profile.experienceLevel,
      contact: profile.contact,
      linkedinUrl: profile.linkedinUrl,
      portfolioUrl: profile.portfolioUrl,
      isVisible: profile.isVisible !== false, // Default to true
      userId: profile.userId,
    };

    console.log("Storage: Creating profile with data:", profileData);

    const [newProfile] = await db
      .insert(profiles)
      .values(profileData)
      .returning();
    return newProfile;
  }

  async updateProfile(
    id: number,
    profile: Partial<InsertProfile>
  ): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile;
  }

  async deleteProfile(id: number): Promise<void> {
    await db.delete(profiles).where(eq(profiles.id, id));
  }

  // Job operations
  async getAllJobs(filters?: {
    industry?: string;
    search?: string;
    experienceLevel?: string;
  }): Promise<Job[]> {
    let whereClause = eq(jobs.isActive, true);

    if (filters?.industry) {
      whereClause = and(whereClause, eq(jobs.industry, filters.industry))!;
    }

    if (filters?.experienceLevel) {
      whereClause = and(
        whereClause,
        eq(jobs.experienceLevel, filters.experienceLevel)
      )!;
    }

    if (filters?.search) {
      whereClause = and(
        whereClause,
        or(
          like(jobs.title, `%${filters.search}%`),
          like(jobs.company, `%${filters.search}%`),
          like(jobs.description, `%${filters.search}%`),
          like(jobs.skills, `%${filters.search}%`)
        )
      )!;
    }

    return await db
      .select()
      .from(jobs)
      .where(whereClause)
      .orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<void> {
    // Move job to removed_jobs table instead of deleting
    await this.moveJobToRemoved(id);
  }

  // Removed Jobs operations
  async getAllRemovedJobs(): Promise<RemovedJob[]> {
    return await db
      .select()
      .from(removedJobs)
      .orderBy(desc(removedJobs.removedAt));
  }

  async getRemovedJob(id: number): Promise<RemovedJob | undefined> {
    const [removedJob] = await db
      .select()
      .from(removedJobs)
      .where(eq(removedJobs.id, id));
    return removedJob;
  }

  async moveJobToRemoved(
    jobId: number,
    removedBy?: number,
    reason?: string
  ): Promise<RemovedJob> {
    // Get the job to be moved
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job) {
      throw new Error(`Job with id ${jobId} not found`);
    }

    // Create entry in removed_jobs table
    const [removedJob] = await db
      .insert(removedJobs)
      .values({
        originalJobId: job.id,
        title: job.title,
        company: job.company,
        posterEmail: job.posterEmail,
        posterRole: job.posterRole,
        description: job.description,
        requirements: job.requirements,
        skills: job.skills,
        industry: job.industry,
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        location: job.location,
        salaryRange: job.salaryRange,
        contactEmail: job.contactEmail,
        contactPhone: job.contactPhone,
        isActive: job.isActive,
        isApproved: job.isApproved,
        status: job.status,
        postedBy: job.postedBy,
        originalCreatedAt: job.createdAt,
        originalUpdatedAt: job.updatedAt,
        removedBy,
        removalReason: reason,
      })
      .returning();

    // Delete applications associated with this job
    await db.delete(applications).where(eq(applications.jobId, jobId));

    // Delete the original job
    await db.delete(jobs).where(eq(jobs.id, jobId));

    return removedJob;
  }

  async restoreJobFromRemoved(removedJobId: number): Promise<Job> {
    // Get the removed job
    const [removedJob] = await db
      .select()
      .from(removedJobs)
      .where(eq(removedJobs.id, removedJobId));
    if (!removedJob) {
      throw new Error(`Removed job with id ${removedJobId} not found`);
    }

    // Restore job to jobs table
    const [restoredJob] = await db
      .insert(jobs)
      .values({
        title: removedJob.title,
        company: removedJob.company,
        posterEmail: removedJob.posterEmail,
        posterRole: removedJob.posterRole,
        description: removedJob.description,
        requirements: removedJob.requirements,
        skills: removedJob.skills,
        industry: removedJob.industry,
        experienceLevel: removedJob.experienceLevel,
        jobType: removedJob.jobType,
        location: removedJob.location,
        salaryRange: removedJob.salaryRange,
        contactEmail: removedJob.contactEmail,
        contactPhone: removedJob.contactPhone,
        isActive: removedJob.isActive,
        isApproved: removedJob.isApproved,
        status: removedJob.status,
        postedBy: removedJob.postedBy,
        createdAt: removedJob.originalCreatedAt,
        updatedAt: new Date(),
      })
      .returning();

    // Remove from removed_jobs table
    await db.delete(removedJobs).where(eq(removedJobs.id, removedJobId));

    return restoredJob;
  }

  // Removed Internships operations
  async getAllRemovedInternships(): Promise<RemovedInternship[]> {
    return await db
      .select()
      .from(removedInternships)
      .orderBy(desc(removedInternships.removedAt));
  }

  async getRemovedInternship(
    id: number
  ): Promise<RemovedInternship | undefined> {
    const [removedInternship] = await db
      .select()
      .from(removedInternships)
      .where(eq(removedInternships.id, id));
    return removedInternship;
  }

  async moveInternshipToRemoved(
    internshipId: number,
    removedBy?: number,
    reason?: string
  ): Promise<RemovedInternship> {
    // Get the internship to be moved
    const [internship] = await db
      .select()
      .from(internships)
      .where(eq(internships.id, internshipId));
    if (!internship) {
      throw new Error(`Internship with id ${internshipId} not found`);
    }

    // Create entry in removed_internships table
    const [removedInternship] = await db
      .insert(removedInternships)
      .values({
        originalInternshipId: internship.id,
        title: internship.title,
        company: internship.company,
        posterEmail: internship.posterEmail,
        posterRole: internship.posterRole,
        description: internship.description,
        requirements: internship.requirements,
        skills: internship.skills,
        department: internship.department,
        duration: internship.duration,
        isPaid: internship.isPaid,
        stipend: internship.stipend,
        location: internship.location,
        positions: internship.positions,
        contactEmail: internship.contactEmail,
        contactPhone: internship.contactPhone,
        startDate: internship.startDate,
        applicationDeadline: internship.applicationDeadline,
        isActive: internship.isActive,
        isApproved: internship.isApproved,
        status: internship.status,
        postedBy: internship.postedBy,
        originalCreatedAt: internship.createdAt,
        originalUpdatedAt: internship.updatedAt,
        removedBy,
        removalReason: reason,
      })
      .returning();

    // Delete applications associated with this internship
    await db
      .delete(applications)
      .where(eq(applications.internshipId, internshipId));

    // Delete the original internship
    await db.delete(internships).where(eq(internships.id, internshipId));

    return removedInternship;
  }

  async restoreInternshipFromRemoved(
    removedInternshipId: number
  ): Promise<Internship> {
    // Get the removed internship
    const [removedInternship] = await db
      .select()
      .from(removedInternships)
      .where(eq(removedInternships.id, removedInternshipId));
    if (!removedInternship) {
      throw new Error(
        `Removed internship with id ${removedInternshipId} not found`
      );
    }

    // Restore internship to internships table
    const [restoredInternship] = await db
      .insert(internships)
      .values({
        title: removedInternship.title,
        company: removedInternship.company,
        posterEmail: removedInternship.posterEmail,
        posterRole: removedInternship.posterRole,
        description: removedInternship.description,
        requirements: removedInternship.requirements,
        skills: removedInternship.skills,
        department: removedInternship.department,
        duration: removedInternship.duration,
        isPaid: removedInternship.isPaid,
        stipend: removedInternship.stipend,
        location: removedInternship.location,
        positions: removedInternship.positions,
        contactEmail: removedInternship.contactEmail,
        contactPhone: removedInternship.contactPhone,
        startDate: removedInternship.startDate,
        applicationDeadline: removedInternship.applicationDeadline,
        isActive: removedInternship.isActive,
        isApproved: removedInternship.isApproved,
        status: removedInternship.status,
        postedBy: removedInternship.postedBy,
        createdAt: removedInternship.originalCreatedAt,
        updatedAt: new Date(),
      })
      .returning();

    // Remove from removed_internships table
    await db
      .delete(removedInternships)
      .where(eq(removedInternships.id, removedInternshipId));

    return restoredInternship;
  }

  // Internship operations - Public view (approved only)
  async getAllInternships(filters?: {
    department?: string;
    search?: string;
  }): Promise<Internship[]> {
    let whereClause = and(
      eq(internships.isActive, true),
      eq(internships.isApproved, true)
    );

    if (filters?.department) {
      whereClause = and(
        whereClause,
        eq(internships.department, filters.department)
      )!;
    }

    if (filters?.search) {
      whereClause = and(
        whereClause,
        or(
          like(internships.title, `%${filters.search}%`),
          like(internships.company, `%${filters.search}%`),
          like(internships.description, `%${filters.search}%`),
          like(internships.skills, `%${filters.search}%`)
        )
      )!;
    }

    return await db
      .select()
      .from(internships)
      .where(whereClause)
      .orderBy(desc(internships.createdAt));
  }

  // Admin view - All internships with approval status
  async getAllInternshipsForAdmin(): Promise<Internship[]> {
    return await db
      .select()
      .from(internships)
      .orderBy(desc(internships.createdAt));
  }

  // Get pending internships for admin approval
  async getPendingInternships(): Promise<Internship[]> {
    return await db
      .select()
      .from(internships)
      .where(eq(internships.status, "pending"))
      .orderBy(desc(internships.createdAt));
  }

  async getInternship(id: number): Promise<Internship | undefined> {
    const [internship] = await db
      .select()
      .from(internships)
      .where(eq(internships.id, id));
    return internship;
  }

  async createInternship(internship: InsertInternship): Promise<Internship> {
    const [newInternship] = await db
      .insert(internships)
      .values(internship)
      .returning();
    return newInternship;
  }

  async updateInternship(
    id: number,
    internship: Partial<InsertInternship>
  ): Promise<Internship> {
    const [updatedInternship] = await db
      .update(internships)
      .set({ ...internship, updatedAt: new Date() })
      .where(eq(internships.id, id))
      .returning();
    return updatedInternship;
  }

  async deleteInternship(id: number): Promise<void> {
    // Move internship to removed_internships table instead of deleting
    await this.moveInternshipToRemoved(id);
  }

  // Internship approval functions
  async approveInternship(id: number): Promise<Internship> {
    const [updatedInternship] = await db
      .update(internships)
      .set({
        status: "approved",
        isApproved: true,
        updatedAt: new Date(),
      })
      .where(eq(internships.id, id))
      .returning();
    return updatedInternship;
  }

  async rejectInternship(id: number): Promise<Internship> {
    const [updatedInternship] = await db
      .update(internships)
      .set({
        status: "rejected",
        isApproved: false,
        updatedAt: new Date(),
      })
      .where(eq(internships.id, id))
      .returning();
    return updatedInternship;
  }

  // Course operations
  async getAllCourses(filters?: { type?: string }): Promise<Course[]> {
    let whereClause = eq(courses.isActive, true);

    if (filters?.type && filters.type !== "all") {
      whereClause = and(whereClause, eq(courses.type, filters.type))!;
    }

    return await db
      .select()
      .from(courses)
      .where(whereClause)
      .orderBy(desc(courses.isFeatured), desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(
    id: number,
    course: Partial<InsertCourse>
  ): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Application operations
  async createApplication(
    application: InsertApplication
  ): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async getAllApplications(): Promise<Application[]> {
    const result = await db
      .select({
        id: applications.id,
        applicantName: applications.applicantName,
        applicantEmail: applications.applicantEmail,
        applicantPhone: applications.applicantPhone,
        coverLetter: applications.coverLetter,
        jobId: applications.jobId,
        internshipId: applications.internshipId,
        cvFileName: applications.cvFileName,
        cvFilePath: applications.cvFilePath,
        status: applications.status,
        notes: applications.notes,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        jobTitle: jobs.title,
        jobCompany: jobs.company,
        internshipTitle: internships.title,
        internshipCompany: internships.company,
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(internships, eq(applications.internshipId, internships.id))
      .orderBy(desc(applications.createdAt));

    return result.map((app) => ({
      ...app,
      jobTitle: app.jobTitle || app.internshipTitle,
      company: app.jobCompany || app.internshipCompany,
      appliedAt: app.createdAt,
      positionType: app.jobId ? "Job" : "Internship",
    }));
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.createdAt));
  }

  async getApplicationsByInternship(
    internshipId: number
  ): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.internshipId, internshipId))
      .orderBy(desc(applications.createdAt));
  }

  async updateApplicationStatus(
    id: number,
    status: string,
    notes?: string
  ): Promise<Application> {
    const updateData: any = { status, updatedAt: new Date() };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const [updatedApplication] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // CV Showcase operations
  async getAllCvShowcase(
    filters: { section?: string; search?: string } = {}
  ): Promise<CvShowcase[]> {
    try {
      console.log("Fetching CVs with filters:", filters);

      const conditions = [];

      if (filters.section) {
        conditions.push(eq(cvShowcase.section, filters.section));
      }

      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(
          or(
            like(cvShowcase.name, searchTerm),
            like(cvShowcase.email, searchTerm),
            like(cvShowcase.title, searchTerm),
            like(cvShowcase.skills, searchTerm),
            like(cvShowcase.bio, searchTerm)
          )
        );
      }

      const query = db.select().from(cvShowcase);

      const result =
        conditions.length > 0
          ? await query
              .where(and(...conditions))
              .orderBy(desc(cvShowcase.createdAt))
          : await query.orderBy(desc(cvShowcase.createdAt));

      console.log("CV Query result count:", result.length);
      return result;
    } catch (error) {
      console.error("Error in getAllCvShowcase:", error);
      return [];
    }
  }

  async getCvShowcase(id: number): Promise<CvShowcase | undefined> {
    const [cv] = await db
      .select()
      .from(cvShowcase)
      .where(eq(cvShowcase.id, id));
    return cv;
  }

  async getCvByFilename(filename: string): Promise<CvShowcase | undefined> {
    const [cv] = await db
      .select()
      .from(cvShowcase)
      .where(eq(cvShowcase.cvFileName, filename));
    return cv;
  }

  async createCvShowcase(cv: InsertCvShowcase): Promise<CvShowcase> {
    const [newCv] = await db.insert(cvShowcase).values(cv).returning();
    return newCv;
  }

  async updateCvShowcase(
    id: number,
    cv: Partial<InsertCvShowcase>
  ): Promise<CvShowcase> {
    const [updatedCv] = await db
      .update(cvShowcase)
      .set({ ...cv, updatedAt: new Date() })
      .where(eq(cvShowcase.id, id))
      .returning();
    return updatedCv;
  }

  async deleteCvShowcase(id: number): Promise<void> {
    await db.delete(cvShowcase).where(eq(cvShowcase.id, id));
  }

  // Email whitelist operations
  async getAllWhitelistedEmails(): Promise<EmailWhitelist[]> {
    return await db
      .select()
      .from(emailWhitelist)
      .where(eq(emailWhitelist.isActive, true))
      .orderBy(desc(emailWhitelist.createdAt));
  }

  async isEmailWhitelisted(email: string): Promise<boolean> {
    const [whitelistedEmail] = await db
      .select()
      .from(emailWhitelist)
      .where(
        and(
          eq(emailWhitelist.email, email.toLowerCase()),
          eq(emailWhitelist.isActive, true)
        )
      );
    return !!whitelistedEmail;
  }

  async addEmailToWhitelist(
    email: InsertEmailWhitelist
  ): Promise<EmailWhitelist> {
    const [newEmail] = await db
      .insert(emailWhitelist)
      .values({ ...email, email: email.email.toLowerCase() })
      .returning();
    return newEmail;
  }

  async removeEmailFromWhitelist(id: number): Promise<void> {
    await db.delete(emailWhitelist).where(eq(emailWhitelist.id, id));
  }

  async bulkAddEmails(
    emails: InsertEmailWhitelist[]
  ): Promise<EmailWhitelist[]> {
    const emailsToInsert = emails.map((email) => ({
      ...email,
      email: email.email.toLowerCase(),
    }));
    return await db.insert(emailWhitelist).values(emailsToInsert).returning();
  }

  async getStats(): Promise<{
    totalJobs: number;
    totalInternships: number;
    totalCourses: number;
    totalProfiles: number;
    totalApplications: number;
    totalCvs: number;
  }> {
    const [jobCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(and(eq(jobs.isActive, true), eq(jobs.status, "approved")));

    const [internshipCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(internships)
      .where(
        and(eq(internships.isActive, true), eq(internships.isApproved, true))
      );

    const [courseCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.isActive, true));

    const [profileCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(profiles)
      .where(eq(profiles.isVisible, true));

    const [applicationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications);

    const [cvCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(cvShowcase);

    return {
      totalJobs: jobCount.count,
      totalInternships: internshipCount.count,
      totalCourses: courseCount.count,
      totalProfiles: profileCount.count,
      totalApplications: applicationCount.count,
      totalCvs: cvCount.count,
    };
  }

  // Access request methods
  async createAccessRequest(data: {
    fullName: string;
    email: string;
    unitNumber: string;
    mobile?: string | null;
  }) {
    const [request] = await db
      .insert(accessRequests)
      .values({
        fullName: data.fullName,
        email: data.email,
        unitNumber: data.unitNumber,
        mobile: data.mobile,
        status: "pending",
      })
      .returning();
    return request;
  }

  async getAccessRequests() {
    return await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.status, "pending"))
      .orderBy(desc(accessRequests.createdAt));
  }

  async approveAccessRequest(requestId: number) {
    // First get the request
    const [request] = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.id, requestId));

    if (!request) {
      throw new Error("Access request not found");
    }

    // Add email to whitelist with all user details
    await this.addEmailToWhitelist({
      email: request.email,
      name: request.fullName,
      unit: request.unitNumber,
      phone: request.mobile,
      addedBy: "Admin",
    });

    // Update request status
    const [updatedRequest] = await db
      .update(accessRequests)
      .set({
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(accessRequests.id, requestId))
      .returning();

    return updatedRequest;
  }

  async rejectAccessRequest(requestId: number) {
    const [updatedRequest] = await db
      .update(accessRequests)
      .set({
        status: "rejected",
        updatedAt: new Date(),
      })
      .where(eq(accessRequests.id, requestId))
      .returning();

    return updatedRequest;
  }

  // Community Benefits operations
  async getAllCommunityBenefits(): Promise<CommunityBenefit[]> {
    return await db
      .select()
      .from(communityBenefits)
      .orderBy(desc(communityBenefits.createdAt));
  }

  async getHomepageBenefits(): Promise<CommunityBenefit[]> {
    return await db
      .select()
      .from(communityBenefits)
      .where(
        and(
          eq(communityBenefits.isActive, true),
          eq(communityBenefits.showOnHomepage, true)
        )
      )
      .orderBy(desc(communityBenefits.createdAt));
  }

  async getCommunityBenefit(id: number): Promise<CommunityBenefit | undefined> {
    const [benefit] = await db
      .select()
      .from(communityBenefits)
      .where(eq(communityBenefits.id, id));
    return benefit;
  }

  async createCommunityBenefit(
    benefit: InsertCommunityBenefit
  ): Promise<CommunityBenefit> {
    const [created] = await db
      .insert(communityBenefits)
      .values(benefit)
      .returning();
    return created;
  }

  async updateCommunityBenefit(
    id: number,
    benefit: Partial<InsertCommunityBenefit>
  ): Promise<CommunityBenefit> {
    const [updated] = await db
      .update(communityBenefits)
      .set({ ...benefit, updatedAt: new Date() })
      .where(eq(communityBenefits.id, id))
      .returning();
    return updated;
  }

  async deleteCommunityBenefit(id: number): Promise<void> {
    await db.delete(communityBenefits).where(eq(communityBenefits.id, id));
  }

  async getAllActiveBenefits(): Promise<CommunityBenefit[]> {
    return await db
      .select()
      .from(communityBenefits)
      .where(eq(communityBenefits.isActive, true))
      .orderBy(desc(communityBenefits.createdAt));
  }

  // Job-CV Matching functionality
  async findMatchingCVsForJob(jobId: number): Promise<CvShowcase[]> {
    const job = await this.getJob(jobId);
    if (!job) return [];

    const allCVs = await this.getAllCvShowcase();
    const jobKeywords = this.extractKeywords(
      job.title + " " + job.industry + " " + (job.skills || "")
    );

    return allCVs.filter((cv) => {
      const cvKeywords = this.extractKeywords(
        cv.name + " " + cv.title + " " + cv.section + " " + (cv.bio || "")
      );
      return this.calculateMatchScore(jobKeywords, cvKeywords) > 0.3; // 30% match threshold
    });
  }

  async findMatchingJobsForCV(
    cvId: number
  ): Promise<{ job: Job; score: number }[]> {
    const cv = await this.getCvShowcase(cvId);
    if (!cv) return [];

    const allJobs = await this.getAllJobs();
    const cvKeywords = this.extractKeywords(
      cv.name +
        " " +
        cv.title +
        " " +
        cv.section +
        " " +
        (cv.bio || "") +
        " " +
        (cv.skills || "")
    );

    const jobMatches = allJobs
      .map((job) => {
        const jobKeywords = this.extractKeywords(
          job.title +
            " " +
            job.industry +
            " " +
            (job.skills || "") +
            " " +
            (job.description || "") +
            " " +
            (job.requirements || "")
        );
        const score = this.calculateMatchScore(cvKeywords, jobKeywords);
        return { job, score: Math.round(score * 100) };
      })
      .filter((match) => match.score > 30) // 30% match threshold
      .sort((a, b) => b.score - a.score); // Sort by highest match score first

    return jobMatches;
  }

  private extractKeywords(text: string): string[] {
    const relevantSkills = [
      // Technical Skills
      "javascript",
      "typescript",
      "react",
      "node",
      "python",
      "java",
      "php",
      "sql",
      "mongodb",
      "mysql",
      "html",
      "css",
      "angular",
      "vue",
      "express",
      "django",
      "flask",
      "spring",
      "laravel",
      "aws",
      "azure",
      "docker",
      "kubernetes",
      "git",
      "linux",
      "windows",
      "oracle",
      "postgresql",
      "redis",
      "elasticsearch",

      // Business Skills
      "marketing",
      "sales",
      "finance",
      "accounting",
      "hr",
      "management",
      "consulting",
      "legal",
      "healthcare",
      "engineering",
      "design",
      "operations",
      "procurement",
      "real estate",
      "logistics",
      "manufacturing",
      "construction",
      "education",
      "retail",
      "hospitality",
      "telecommunications",

      // Professional Levels
      "senior",
      "junior",
      "lead",
      "head",
      "director",
      "coordinator",
      "assistant",
      "executive",
      "supervisor",
      "team",
      "project",
      "product",
      "strategy",
      "business",
      "technical",

      // Industry Terms
      "digital",
      "technology",
      "innovation",
      "automation",
      "communication",
      "customer",
      "service",
      "quality",
      "safety",
      "compliance",
      "audit",
      "risk",
      "planning",
      "analysis",
      "research",
    ];

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);

    return words.filter(
      (word) =>
        relevantSkills.includes(word) ||
        word.includes("engineer") ||
        word.includes("manager") ||
        word.includes("developer") ||
        word.includes("analyst") ||
        word.includes("specialist") ||
        word.includes("coordinator") ||
        word.includes("assistant") ||
        word.includes("supervisor")
    );
  }

  private calculateMatchScore(
    keywords1: string[],
    keywords2: string[]
  ): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;

    const intersection = keywords1.filter((keyword) =>
      keywords2.includes(keyword)
    );
    return intersection.length / Math.max(keywords1.length, keywords2.length);
  }

  // Email whitelist deletion method
  async deleteEmailWhitelist(id: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        "DELETE FROM email_whitelist WHERE id = $1",
        [id]
      );
      await client.query("COMMIT");
      console.log(`Database deletion result for ID ${id}:`, result.rowCount);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Database deletion error:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export const storage = new DatabaseStorage();
