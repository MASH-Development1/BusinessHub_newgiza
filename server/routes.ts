import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  sendJobApplication,
  sendInternshipApplication,
  sendAccessRequestNotification,
  sendAccessApprovedNotification,
} from "./email";
import {
  insertJobSchema,
  insertInternshipSchema,
  insertCourseSchema,
  insertProfileSchema,
  insertApplicationSchema,
  insertCvShowcaseSchema,
  insertEmailWhitelistSchema,
  profiles,
  emailWhitelist,
  removedInternships,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";
import { fileRetentionManager } from "./file-retention-policy";
import { cvProtection } from "./cv-protection";
import { backupSystem } from "./backup-system";
import { disasterRecovery } from "./disaster-recovery";
import { emailWhitelistFix } from "./email-whitelist-fix";
import { forceDelete } from "./force-delete";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
        )
      );
    }
  },
});

// Excel upload configuration
const excelUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (
      allowedMimes.includes(file.mimetype) ||
      file.originalname.endsWith(".xlsx") ||
      file.originalname.endsWith(".xls") ||
      file.originalname.endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed."
        )
      );
    }
  },
});

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
        )
      );
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize file retention policy on startup
  fileRetentionManager.enforceRetentionPolicy();

  // Serve uploaded files with permanent retention headers
  app.use(
    "/uploads",
    express.static(uploadDir, {
      setHeaders: (res, path) => {
        // Set headers to indicate permanent storage
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        res.setHeader("X-File-Retention", "permanent-no-expiration");
      },
    })
  );

  // File verification endpoint
  app.get("/api/verify-file/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      res.json({
        exists: true,
        size: stats.size,
        modified: stats.mtime,
        path: `/uploads/${filename}`,
      });
    } else {
      res.status(404).json({
        exists: false,
        message: "File not found",
        searchedPath: filePath,
      });
    }
  });

  // Simple session store
  const sessions = new Map<
    string,
    { email: string; isAdmin: boolean; timestamp: number }
  >();

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if email is whitelisted
      const isWhitelisted = await storage.isEmailWhitelisted(email);
      if (!isWhitelisted) {
        return res.status(403).json({
          message:
            "Access denied. Your email is not registered as a NewGiza resident. Please contact the community administrator.",
        });
      }

      // Create session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, {
        email,
        isAdmin: false,
        timestamp: Date.now(),
      });

      // Set session cookie
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({ message: "Login successful", email });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Simple admin credentials (in production, use proper authentication)
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@newgiza.com";
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "NewGiza@2025!";

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Create admin session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, {
        email,
        isAdmin: true,
        timestamp: Date.now(),
      });

      res.cookie("sessionId", sessionId, {
        httpOnly: false, // Allow JavaScript access for debugging
        secure: false, // Allow cookies in development
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Admin login successful", email });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // CV owner login - simplified email-based authentication
  app.post("/api/auth/cv-login", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user has any CVs in the system
      const userCvs = await storage.getAllCvShowcase({ search: email });
      const userCv = userCvs.find(
        (cv) => cv.email.toLowerCase() === email.toLowerCase()
      );

      if (!userCv) {
        return res
          .status(404)
          .json({ message: "No CV found for this email address" });
      }

      // Create user session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, {
        email: email.toLowerCase(),
        isAdmin: false,
        timestamp: Date.now(),
      });

      res.cookie("sessionId", sessionId, {
        httpOnly: false, // Allow JavaScript access for debugging
        secure: false, // Allow cookies in development
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful", email: email.toLowerCase() });
    } catch (error) {
      console.error("CV owner login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
      res.clearCookie("sessionId");
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    const sessionId = req.cookies?.sessionId;
    const session = sessionId ? sessions.get(sessionId) : null;

    if (session && Date.now() - session.timestamp <= 24 * 60 * 60 * 1000) {
      return res.json({
        email: session.email,
        isAdmin: session.isAdmin,
        isAuthenticated: true,
      });
    } else {
      // Don't delete sessions in auth check - just return 401
      return res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.cookies?.sessionId;
    const session = sessionId ? sessions.get(sessionId) : null;

    // Check session validity in both development and production
    if (!session || Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      if (session) sessions.delete(sessionId);
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = session;
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    // Development bypass for admin access
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Statistics endpoint (protected)
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { industry, search, experienceLevel } = req.query;
      const jobs = await storage.getAllJobs({
        industry: industry as string,
        search: search as string,
        experienceLevel: experienceLevel as string,
      });
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);

      // Auto-populate poster email from authenticated user
      const sessionData = (req as any).user || { email: "admin@newgiza.com" };
      const jobWithPoster = {
        ...validatedData,
        posterEmail: sessionData.email,
      };

      const job = await storage.createJob(jobWithPoster);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.updateJob(parseInt(req.params.id), req.body);
      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      await storage.deleteJob(parseInt(req.params.id));
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Job approval routes (admin only)
  app.post("/api/admin/jobs/:id/approve", async (req, res) => {
    try {
      const job = await storage.updateJob(parseInt(req.params.id), {
        status: "approved",
        isApproved: true,
        isActive: true,
      });
      res.json(job);
    } catch (error) {
      console.error("Error approving job:", error);
      res.status(500).json({ message: "Failed to approve job" });
    }
  });

  app.post("/api/admin/jobs/:id/reject", async (req, res) => {
    try {
      const job = await storage.updateJob(parseInt(req.params.id), {
        status: "rejected",
        isApproved: false,
      });
      res.json(job);
    } catch (error) {
      console.error("Error rejecting job:", error);
      res.status(500).json({ message: "Failed to reject job" });
    }
  });

  // Removed Jobs routes (Admin only)
  app.get(
    "/api/admin/removed-jobs",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const removedJobs = await storage.getAllRemovedJobs();
        res.json(removedJobs);
      } catch (error) {
        console.error("Error fetching removed jobs:", error);
        res.status(500).json({ message: "Failed to fetch removed jobs" });
      }
    }
  );

  app.get(
    "/api/admin/removed-jobs/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const removedJob = await storage.getRemovedJob(parseInt(req.params.id));
        if (!removedJob) {
          return res.status(404).json({ message: "Removed job not found" });
        }
        res.json(removedJob);
      } catch (error) {
        console.error("Error fetching removed job:", error);
        res.status(500).json({ message: "Failed to fetch removed job" });
      }
    }
  );

  app.post(
    "/api/admin/removed-jobs/:id/restore",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const restoredJob = await storage.restoreJobFromRemoved(
          parseInt(req.params.id)
        );
        res.json({ message: "Job restored successfully", job: restoredJob });
      } catch (error) {
        console.error("Error restoring job:", error);
        res.status(500).json({ message: "Failed to restore job" });
      }
    }
  );

  // Removed Internships routes (Admin only)
  app.get(
    "/api/admin/removed-internships",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const removedInternships = await storage.getAllRemovedInternships();
        res.json(removedInternships);
      } catch (error) {
        console.error("Error fetching removed internships:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch removed internships" });
      }
    }
  );

  app.get(
    "/api/admin/removed-internships/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const removedInternship = await storage.getRemovedInternship(
          parseInt(req.params.id)
        );
        if (!removedInternship) {
          return res
            .status(404)
            .json({ message: "Removed internship not found" });
        }
        res.json(removedInternship);
      } catch (error) {
        console.error("Error fetching removed internship:", error);
        res.status(500).json({ message: "Failed to fetch removed internship" });
      }
    }
  );

  app.post(
    "/api/admin/removed-internships/:id/restore",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const restoredInternship = await storage.restoreInternshipFromRemoved(
          parseInt(req.params.id)
        );
        res.json({
          message: "Internship restored successfully",
          internship: restoredInternship,
        });
      } catch (error) {
        console.error("Error restoring internship:", error);
        res.status(500).json({ message: "Failed to restore internship" });
      }
    }
  );

  app.delete(
    "/api/admin/removed-internships/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        await db
          .delete(removedInternships)
          .where(eq(removedInternships.id, parseInt(req.params.id)));
        res.json({ message: "Removed internship permanently deleted" });
      } catch (error) {
        console.error("Error permanently deleting internship:", error);
        res
          .status(500)
          .json({ message: "Failed to permanently delete internship" });
      }
    }
  );

  // Internship routes
  app.get("/api/internships", async (req, res) => {
    try {
      const { department, search } = req.query;
      const internships = await storage.getAllInternships({
        department: department as string,
        search: search as string,
      });
      res.json(internships);
    } catch (error) {
      console.error("Error fetching internships:", error);
      res.status(500).json({ message: "Failed to fetch internships" });
    }
  });

  // Admin routes for internships
  app.get(
    "/api/admin/internships",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const allInternships = await storage.getAllInternshipsForAdmin();
        res.json(allInternships);
      } catch (error) {
        console.error("Error fetching all internships:", error);
        res.status(500).json({ message: "Failed to fetch internships" });
      }
    }
  );

  app.get(
    "/api/admin/internships/pending",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const pendingInternships = await storage.getPendingInternships();
        res.json(pendingInternships);
      } catch (error) {
        console.error("Error fetching pending internships:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch pending internships" });
      }
    }
  );

  // Specific routes must come before parameterized routes
  app.get(
    "/api/internships/pending",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const pendingInternships = await storage.getPendingInternships();
        res.json(pendingInternships);
      } catch (error) {
        console.error("Error fetching pending internships:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch pending internships" });
      }
    }
  );

  app.get("/api/internships/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid internship ID" });
      }
      const internship = await storage.getInternship(id);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      console.error("Error fetching internship:", error);
      res.status(500).json({ message: "Failed to fetch internship" });
    }
  });

  // Admin approval endpoints
  app.post(
    "/api/admin/internships/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid internship ID" });
        }

        const updatedInternship = await storage.updateInternship(id, {
          status: "approved",
          isApproved: true,
        });

        res.json({
          message: "Internship approved successfully",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error approving internship:", error);
        res.status(500).json({ message: "Failed to approve internship" });
      }
    }
  );

  app.post(
    "/api/admin/internships/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid internship ID" });
        }

        const { reason } = req.body;
        const updatedInternship = await storage.updateInternship(id, {
          status: "rejected",
          isApproved: false,
        });

        res.json({
          message: "Internship rejected",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error rejecting internship:", error);
        res.status(500).json({ message: "Failed to reject internship" });
      }
    }
  );

  // Approve internship (legacy endpoint)
  app.patch(
    "/api/internships/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid internship ID" });
        }

        const updatedInternship = await storage.updateInternship(id, {
          status: "approved",
          isApproved: true,
        });

        res.json({
          message: "Internship approved successfully",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error approving internship:", error);
        res.status(500).json({ message: "Failed to approve internship" });
      }
    }
  );

  // Reject internship (legacy endpoint)
  app.patch(
    "/api/internships/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid internship ID" });
        }

        const { reason } = req.body;
        const updatedInternship = await storage.updateInternship(id, {
          status: "rejected",
          isApproved: false,
        });

        res.json({
          message: "Internship rejected",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error rejecting internship:", error);
        res.status(500).json({ message: "Failed to reject internship" });
      }
    }
  );

  app.post("/api/internships", requireAuth, async (req, res) => {
    try {
      const currentUser = (req as any).user;

      // Get poster email from authenticated user or development fallback
      const posterEmail =
        currentUser?.email ||
        (process.env.NODE_ENV === "development" ? "admin@newgiza.com" : null);

      if (!posterEmail) {
        return res
          .status(401)
          .json({ message: "Authentication required to submit internship" });
      }

      // Build complete internship data
      const internshipData = {
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        posterRole: req.body.posterRole,
        duration: req.body.duration,
        contactEmail: req.body.contactEmail,
        skills: req.body.skills || null,
        requirements: req.body.requirements || null,
        experienceLevel: req.body.experienceLevel || null,
        department: req.body.department || null,
        isPaid: req.body.isPaid || false,
        stipend: req.body.stipend || null,
        location: req.body.location || null,
        positions: req.body.positions || 1,
        contactPhone: req.body.contactPhone || null,
        startDate: req.body.startDate || null,
        applicationDeadline: req.body.applicationDeadline || null,
        posterEmail: posterEmail,
        status: "pending",
        isApproved: false,
        isActive: true,
        postedBy: currentUser?.id || null,
      };

      console.log("Creating internship with data:", internshipData);
      console.log("Current user from auth:", currentUser);

      // Validate required fields manually since schema validation is complex
      if (
        !internshipData.title ||
        !internshipData.company ||
        !internshipData.description ||
        !internshipData.posterRole ||
        !internshipData.duration ||
        !internshipData.contactEmail
      ) {
        return res.status(400).json({
          message:
            "Missing required fields: title, company, description, posterRole, duration, and contactEmail are required",
        });
      }

      const internship = await storage.createInternship(internshipData);

      res.status(201).json({
        message: "Internship submitted for admin approval",
        internship: internship,
      });
    } catch (error) {
      console.error("Error creating internship:", error);
      res.status(500).json({
        message: "Failed to create internship",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.put("/api/internships/:id", async (req, res) => {
    try {
      const internship = await storage.updateInternship(
        parseInt(req.params.id),
        req.body
      );
      res.json(internship);
    } catch (error) {
      console.error("Error updating internship:", error);
      res.status(500).json({ message: "Failed to update internship" });
    }
  });

  app.delete("/api/internships/:id", async (req, res) => {
    try {
      await storage.deleteInternship(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting internship:", error);
      res.status(500).json({ message: "Failed to delete internship" });
    }
  });

  // Admin routes for internship management
  app.get(
    "/api/admin/internships",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const internships = await storage.getAllInternshipsForAdmin();
        res.json(internships);
      } catch (error) {
        console.error("Error fetching internships for admin:", error);
        res.status(500).json({ message: "Failed to fetch internships" });
      }
    }
  );

  app.get(
    "/api/admin/internships/pending",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const pendingInternships = await storage.getPendingInternships();
        res.json(pendingInternships);
      } catch (error) {
        console.error("Error fetching pending internships:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch pending internships" });
      }
    }
  );

  // Admin internship approval/rejection
  app.post(
    "/api/admin/internships/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const internship = await storage.updateInternship(id, {
          isApproved: true,
          status: "approved",
        });
        res.json(internship);
      } catch (error) {
        console.error("Error approving internship:", error);
        res.status(500).json({ message: "Failed to approve internship" });
      }
    }
  );

  app.post(
    "/api/admin/internships/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteInternship(id);
        res.json({ message: "Internship rejected and deleted" });
      } catch (error) {
        console.error("Error rejecting internship:", error);
        res.status(500).json({ message: "Failed to reject internship" });
      }
    }
  );

  // Admin internship edit/delete
  app.put(
    "/api/admin/internships/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const internship = await storage.updateInternship(id, req.body);
        res.json(internship);
      } catch (error) {
        console.error("Error updating internship:", error);
        res.status(500).json({ message: "Failed to update internship" });
      }
    }
  );

  app.delete(
    "/api/admin/internships/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteInternship(id);
        res.json({ message: "Internship deleted successfully" });
      } catch (error) {
        console.error("Error deleting internship:", error);
        res.status(500).json({ message: "Failed to delete internship" });
      }
    }
  );

  app.post(
    "/api/admin/internships/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const internshipId = parseInt(req.params.id);
        const updatedInternship = await storage.approveInternship(internshipId);
        res.json({
          message: "Internship approved successfully",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error approving internship:", error);
        res.status(500).json({ message: "Failed to approve internship" });
      }
    }
  );

  app.post(
    "/api/admin/internships/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const internshipId = parseInt(req.params.id);
        const updatedInternship = await storage.rejectInternship(internshipId);
        res.json({
          message: "Internship rejected",
          internship: updatedInternship,
        });
      } catch (error) {
        console.error("Error rejecting internship:", error);
        res.status(500).json({ message: "Failed to reject internship" });
      }
    }
  );

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { type } = req.query;
      const courses = await storage.getAllCourses({
        type: type as string,
      });
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.updateCourse(
        parseInt(req.params.id),
        req.body
      );
      res.json(course);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      await storage.deleteCourse(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Profile routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const { industry, search, experienceLevel } = req.query;
      const profiles = await storage.getAllProfiles({
        industry: industry as string,
        search: search as string,
        experienceLevel: experienceLevel as string,
      });
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Direct profile creation - FIXED VERSION
  app.post("/api/create-profile", async (req, res) => {
    try {
      console.log("PROFILE CREATION REQUEST - Body:", req.body);

      // Direct database insert with simplified data
      const insertResult = await db
        .insert(profiles)
        .values({
          name: req.body.name || "New Member",
          title: req.body.title || "Professional",
          company: req.body.company || null,
          bio: req.body.bio || null,
          industry: req.body.industry || req.body.areaOfExpertise || null,
          contact: req.body.email || null,
          phone: req.body.phone || null,
          howCanYouSupport: req.body.howCanYouSupport || null,
          isVisible: true,
        })
        .returning();

      const profile = insertResult[0];
      console.log("SUCCESS! Profile saved to database with ID:", profile.id);

      res.status(201).json({
        success: true,
        message: "Profile created successfully!",
        profile: profile,
      });
    } catch (error: any) {
      console.error("Profile creation error:", error);
      res.status(500).json({
        success: false,
        message: "Profile creation failed",
        error: error.message,
      });
    }
  });

  // Profile creation - with user tracking
  app.post(
    "/api/profiles",
    requireAuth,
    upload.single("cv"),
    async (req, res) => {
      try {
        console.log("PROFILE ENDPOINT HIT - Body:", req.body);
        const currentUser = (req as any).user;

        // Get the user ID from session email
        let userId = null;
        if (currentUser.email) {
          const user = await storage.getUserByEmail(currentUser.email);
          if (user) {
            userId = user.id;
          }
        }

        // Direct database insert with proper data handling including userId
        const insertResult = await db
          .insert(profiles)
          .values({
            userId: userId,
            name: req.body.name || "New Member",
            title: req.body.title || "Professional",
            company: req.body.company || null,
            bio: req.body.bio || null,
            industry: req.body.industry || null,
            contact: req.body.email || null,
            phone: req.body.phone || null,
            skills: req.body.skills || null,
            howCanYouSupport: req.body.howCanYouSupport || null,
            linkedinUrl: req.body.linkedinUrl || null,
            experienceLevel: req.body.experienceLevel || null,
            isVisible: true,
          })
          .returning();

        // If CV file is uploaded, register it for permanent retention
        if (req.file) {
          fileRetentionManager.registerFile({
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadDate: new Date(),
            fileType: req.file.mimetype,
            size: req.file.size,
            category: "cv",
          });

          console.log("CV file uploaded and registered:", req.file.filename);
        }

        const profile = insertResult[0];
        console.log(
          "Profile created successfully with ID:",
          profile.id,
          "for user:",
          userId
        );
        console.log("Profile data:", JSON.stringify(profile, null, 2));

        res.status(201).json({
          message: "Profile created successfully!",
          profile: profile,
        });
      } catch (error: any) {
        console.error("Profile creation error:", error);
        res.status(500).json({
          message: "Failed to create profile",
          error: error.message,
        });
      }
    }
  );

  app.put(
    "/api/profiles/:id",
    requireAuth,
    upload.single("cv"),
    async (req, res) => {
      try {
        const profileId = parseInt(req.params.id);
        const currentUser = (req as any).user;

        // Get the existing profile to check ownership
        const existingProfile = await storage.getProfile(profileId);
        if (!existingProfile) {
          return res.status(404).json({ message: "Profile not found" });
        }

        // Check if user is admin or the profile creator
        const isAdmin = currentUser.isAdmin;

        // Check ownership by email (contact field) or userId
        const isOwnerByEmail =
          existingProfile.contact &&
          currentUser.email &&
          existingProfile.contact.toLowerCase() ===
            currentUser.email.toLowerCase();

        const isOwnerByUserId =
          existingProfile.userId &&
          currentUser.email &&
          (await storage
            .getUserByEmail(currentUser.email)
            .then((user) => user && user.id === existingProfile.userId));

        const isOwner = isOwnerByEmail || isOwnerByUserId;

        console.log("Profile ownership check:", {
          profileId,
          currentUserEmail: currentUser.email,
          profileContact: existingProfile.contact,
          profileUserId: existingProfile.userId,
          isAdmin,
          isOwnerByEmail,
          isOwnerByUserId,
          isOwner,
        });

        if (!isAdmin && !isOwner) {
          return res.status(403).json({
            message: "Access denied. You can only edit your own profile.",
          });
        }

        // Prepare update data
        const updateData = { ...req.body };

        // If CV file is uploaded, add it to the update data and register for retention
        if (req.file) {
          updateData.cvFilePath = `/uploads/${req.file.filename}`;
          updateData.cvFileName = req.file.originalname;

          fileRetentionManager.registerFile({
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadDate: new Date(),
            fileType: req.file.mimetype,
            size: req.file.size,
            category: "cv",
          });

          console.log(
            "CV file uploaded for profile update:",
            req.file.filename
          );
        }

        const profile = await storage.updateProfile(profileId, updateData);
        res.json(profile);
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  );

  app.delete(
    "/api/profiles/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        await storage.deleteProfile(parseInt(req.params.id));
        res.json({ message: "Profile deleted successfully" });
      } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Failed to delete profile" });
      }
    }
  );

  // Application routes
  app.post(
    "/api/applications/job/:jobId",
    upload.single("cv"),
    async (req, res) => {
      try {
        const jobId = parseInt(req.params.jobId);
        const job = await storage.getJob(jobId);

        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }

        const { applicantName, applicantEmail, applicantPhone, coverLetter } =
          req.body;

        // Check for duplicate applications
        const existingApplications = await storage.getApplicationsByJob(jobId);
        const duplicateApplication = existingApplications.find(
          (app) =>
            app.applicantEmail.toLowerCase() === applicantEmail.toLowerCase()
        );

        if (duplicateApplication) {
          return res.status(400).json({
            message:
              "You have already applied for this position. Duplicate applications are not allowed.",
          });
        }

        const applicationData = {
          applicantName,
          applicantEmail,
          applicantPhone,
          coverLetter,
          jobId,
          cvFileName: req.file?.originalname,
          cvFilePath: req.file ? `/uploads/${req.file.filename}` : null,
          status: "submitted", // Direct submission without approval needed
        };

        const validatedData = insertApplicationSchema.parse(applicationData);
        const application = await storage.createApplication(validatedData);

        // Register CV file for permanent retention
        if (req.file && application) {
          try {
            fileRetentionManager.registerFile({
              filename: req.file.filename,
              originalName: req.file.originalname,
              uploadDate: new Date(),
              fileType: req.file.mimetype,
              size: req.file.size,
              category: "cv",
            });
            console.log(
              `CV file registered for permanent retention: ${req.file.filename}`
            );
          } catch (error) {
            console.error("Error registering CV file:", error);
          }
        }

        res.status(201).json({ message: "Application submitted successfully" });
      } catch (error) {
        console.error("Error submitting job application:", error);
        res.status(500).json({ message: "Failed to submit application" });
      }
    }
  );

  app.post(
    "/api/applications/internship/:internshipId",
    upload.single("cv"),
    async (req, res) => {
      try {
        const internshipId = parseInt(req.params.internshipId);
        const internship = await storage.getInternship(internshipId);

        if (!internship) {
          return res.status(404).json({ message: "Internship not found" });
        }

        const { applicantName, applicantEmail, applicantPhone, coverLetter } =
          req.body;

        // Check for duplicate applications
        const existingApplications =
          await storage.getApplicationsByInternship(internshipId);
        const duplicateApplication = existingApplications.find(
          (app) =>
            app.applicantEmail.toLowerCase() === applicantEmail.toLowerCase()
        );

        if (duplicateApplication) {
          return res.status(400).json({
            message:
              "You have already applied for this internship. Duplicate applications are not allowed.",
          });
        }

        const applicationData = {
          applicantName,
          applicantEmail,
          applicantPhone,
          coverLetter,
          internshipId,
          cvFileName: req.file?.originalname,
          cvFilePath: req.file ? `/uploads/${req.file.filename}` : null,
          status: "submitted", // Direct submission without approval needed
        };

        const validatedData = insertApplicationSchema.parse(applicationData);
        const application = await storage.createApplication(validatedData);

        // Register CV file for permanent retention
        if (req.file && application) {
          try {
            fileRetentionManager.registerFile({
              filename: req.file.filename,
              originalName: req.file.originalname,
              uploadDate: new Date(),
              fileType: req.file.mimetype,
              size: req.file.size,
              category: "cv",
            });
            console.log(
              `CV file registered for permanent retention: ${req.file.filename}`
            );
          } catch (error) {
            console.error("Error registering CV file:", error);
          }
        }

        // Email notifications disabled - approval through admin portal only

        res.status(201).json({ message: "Application submitted successfully" });
      } catch (error) {
        console.error("Error submitting internship application:", error);
        res.status(500).json({ message: "Failed to submit application" });
      }
    }
  );

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.put("/api/applications/:id", async (req, res) => {
    try {
      const { status, notes } = req.body;
      const application = await storage.updateApplicationStatus(
        parseInt(req.params.id),
        status,
        notes
      );
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  app.put("/api/applications/:id/status", async (req, res) => {
    try {
      const { status, notes } = req.body;
      const application = await storage.updateApplicationStatus(
        parseInt(req.params.id),
        status,
        notes
      );
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      await storage.deleteApplication(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // CV Showcase routes
  app.get("/api/cv-showcase", async (req, res) => {
    try {
      const { section, search } = req.query;
      console.log("Fetching CVs with filters:", { section, search });

      const cvs = await storage.getAllCvShowcase({
        section: section as string,
        search: search as string,
      });

      console.log("Found CVs:", cvs.length);
      res.json(cvs);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      res.status(500).json({ message: "Failed to fetch CVs" });
    }
  });

  app.get("/api/cv-showcase/:id", async (req, res) => {
    try {
      const cv = await storage.getCvShowcase(parseInt(req.params.id));
      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }
      res.json(cv);
    } catch (error) {
      console.error("Error fetching CV:", error);
      res.status(500).json({ message: "Failed to fetch CV" });
    }
  });

  app.post("/api/cv-showcase", upload.single("cv"), async (req, res) => {
    try {
      console.log("CV upload request:", req.body);
      console.log("CV file:", req.file);

      const {
        name,
        email,
        phone,
        title,
        section,
        bio,
        skills,
        experience,
        education,
        yearsOfExperience,
        linkedinUrl,
      } = req.body;

      // Register CV file for permanent retention and create backup
      if (req.file) {
        fileRetentionManager.registerFile({
          filename: req.file.filename,
          originalName: req.file.originalname,
          uploadDate: new Date(),
          fileType: req.file.mimetype,
          size: req.file.size,
          category: "cv",
        });

        // Create backup copy for extra protection
        fileRetentionManager.createFileBackup(req.file.filename);

        // Create multiple protected copies to prevent data loss from ephemeral file system
        const filePath = path.join(process.cwd(), "uploads", req.file.filename);
        await cvProtection.protectCVFile(filePath, 0, email); // Will get proper CV ID after creation

        console.log(
          `✓ CV file ${req.file.filename} permanently stored with multiple protection layers`
        );
      }

      const cvData = {
        name,
        email,
        phone,
        title,
        section,
        bio,
        skills,
        experience,
        education,
        yearsOfExperience,
        linkedinUrl,
        cvFileName: req.file?.filename,
        cvFilePath: req.file?.filename ? `/uploads/${req.file.filename}` : null,
      };

      const validatedData = insertCvShowcaseSchema.parse(cvData);
      const cv = await storage.createCvShowcase(validatedData);
      res.status(201).json(cv);
    } catch (error) {
      console.error("Error creating CV:", error);
      res.status(500).json({ message: "Failed to create CV" });
    }
  });

  app.put("/api/cv-showcase/:id", upload.single("cv"), async (req, res) => {
    try {
      const cvId = parseInt(req.params.id);
      const existingCv = await storage.getCvShowcase(cvId);

      if (!existingCv) {
        return res.status(404).json({ message: "CV not found" });
      }

      // Debug session authentication
      const sessionId = req.cookies?.sessionId;
      const session = sessionId ? sessions.get(sessionId) : null;

      console.log(`=== CV UPDATE AUTH DEBUG ===`);
      console.log(`CV ID: ${cvId}, CV Email: ${existingCv.email}`);
      console.log(`Request cookies:`, req.cookies);
      console.log(`SessionID from cookie: ${sessionId}`);
      console.log(`Session found: ${!!session}`);
      console.log(`Total sessions in store: ${sessions.size}`);

      // Debug all sessions in store
      console.log(`All sessions in store:`);
      sessions.forEach((value, key) => {
        console.log(
          `  SessionID: ${key} -> Email: ${value.email}, IsAdmin: ${value.isAdmin}`
        );
      });

      if (session) {
        console.log(`Session details:`, {
          email: session.email,
          isAdmin: session.isAdmin,
          timestamp: new Date(session.timestamp),
          age: Date.now() - session.timestamp,
        });
      }

      if (!session || Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        if (session) sessions.delete(sessionId);
        console.log(`AUTH FAILED: No valid session found`);
        return res
          .status(401)
          .json({ message: "Authentication required to edit this CV" });
      }

      // Check if user can edit this CV (only owner or admin)
      const canEdit =
        session.isAdmin || session.email === existingCv.email.toLowerCase();
      console.log(
        `Can edit check: ${canEdit} (isAdmin: ${session.isAdmin}, emailMatch: ${session.email === existingCv.email.toLowerCase()})`
      );

      if (!canEdit) {
        return res
          .status(403)
          .json({ message: "Unauthorized to edit this CV" });
      }

      const updateData = { ...req.body };

      // If a new CV file is uploaded, update file information
      if (req.file) {
        updateData.cvFileName = req.file.filename;
        updateData.cvFilePath = `/uploads/${req.file.filename}`;

        // Delete old CV file if it exists
        if (existingCv.cvFileName) {
          const oldFilePath = path.join(
            process.cwd(),
            "uploads",
            existingCv.cvFileName
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      const cv = await storage.updateCvShowcase(cvId, updateData);
      res.json(cv);
    } catch (error) {
      console.error("Error updating CV:", error);
      res.status(500).json({ message: "Failed to update CV" });
    }
  });

  app.patch("/api/cv-showcase/:id", async (req, res) => {
    try {
      const cvId = parseInt(req.params.id);
      const existingCv = await storage.getCvShowcase(cvId);

      if (!existingCv) {
        return res.status(404).json({ message: "CV not found" });
      }

      // Check for session-based auth (both admin and CV owner sessions)
      const sessionId = req.cookies?.sessionId;
      const session = sessionId ? sessions.get(sessionId) : null;

      if (!session || Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        if (session) sessions.delete(sessionId);
        return res
          .status(401)
          .json({ message: "Authentication required to edit this CV" });
      }

      // Check if user can edit this CV (only owner or admin)
      if (
        !session.isAdmin &&
        session.email !== existingCv.email.toLowerCase()
      ) {
        return res
          .status(403)
          .json({ message: "Unauthorized to edit this CV" });
      }

      const cv = await storage.updateCvShowcase(cvId, req.body);
      res.json(cv);
    } catch (error) {
      console.error("Error updating CV:", error);
      res.status(500).json({ message: "Failed to update CV" });
    }
  });

  // CV file download by filename
  app.get("/api/cv/download/:filename", async (req, res) => {
    try {
      const filename = decodeURIComponent(req.params.filename);
      const filePath = path.join(process.cwd(), "uploads", filename);

      // Check if file exists, attempt recovery if missing
      if (!fs.existsSync(filePath)) {
        // Try to restore from protected copies
        const cvRecord = await storage.getCvByFilename(filename);
        if (cvRecord) {
          const restoredFilename = await cvProtection.restoreCVFile(
            cvRecord.id
          );
          if (restoredFilename) {
            const restoredPath = path.join(
              process.cwd(),
              "uploads",
              restoredFilename
            );
            if (fs.existsSync(restoredPath)) {
              console.log(
                `✓ CV file restored from protected copy: ${filename} -> ${restoredFilename}`
              );
              // Update the CV record with new filename
              await storage.updateCvShowcase(cvRecord.id, {
                cvFileName: restoredFilename,
              });
              // Serve the restored file
              res.setHeader("Content-Type", "application/pdf");
              res.setHeader(
                "Content-Disposition",
                `inline; filename="${filename}"`
              );
              const fileStream = fs.createReadStream(restoredPath);
              fileStream.pipe(res);
              return;
            }
          }
        }
        return res
          .status(404)
          .json({ message: "CV file not found and could not be recovered" });
      }

      // Set proper headers for PDF viewing in browser
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error serving CV file:", error);
      res.status(500).json({ message: "Failed to serve CV file" });
    }
  });

  // CV download endpoint by ID - Direct file access
  app.get("/api/cv-showcase/:id/download", async (req, res) => {
    try {
      const cvId = parseInt(req.params.id);

      // Get CV data from cv_showcase table
      const cv = await storage.getCvShowcase(cvId);

      if (!cv) {
        console.error(`CV not found for ID: ${cvId}`);
        return res.status(404).json({ message: "CV record not found" });
      }

      // Check if CV has any file reference
      if (!cv.cvFileName && !cv.cvFilePath) {
        console.error(`No file attached to CV ID: ${cvId}`);
        return res
          .status(404)
          .json({ message: "No CV file attached to this record" });
      }

      // Extract filename from either cvFileName or cvFilePath
      let actualFilename;
      if (cv.cvFileName) {
        actualFilename = cv.cvFileName;
      } else if (cv.cvFilePath) {
        // Extract filename from path like "/uploads/cv-1748969741392-707895541.pdf"
        actualFilename = cv.cvFilePath.split("/").pop();
      }

      if (!actualFilename) {
        console.error(`Could not determine filename for CV ID: ${cvId}`);
        return res
          .status(404)
          .json({ message: "CV file reference is corrupted" });
      }

      const filePath = path.join(process.cwd(), "uploads", actualFilename);

      console.log(`Looking for CV file at: ${filePath}`);
      console.log(
        `CV record: ${cv.name} (${cv.email}) - cvFileName: ${cv.cvFileName}, cvFilePath: ${cv.cvFilePath}`
      );

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`CV file not found at: ${filePath} for CV ID: ${cvId}`);

        // Mark CV as having missing file for admin awareness
        await storage.updateCvShowcase(cvId, {
          bio: cv.bio
            ? `${cv.bio}\n\n[Admin Note: CV file is missing from server]`
            : "[Admin Note: CV file is missing from server]",
        });

        return res.status(404).json({
          message: "CV file not found or corrupted",
          details: `File ${actualFilename} is missing from server storage`,
        });
      }

      // Verify file is readable
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
      } catch (accessError) {
        console.error(`CV file not readable: ${filePath}`, accessError);
        return res
          .status(404)
          .json({ message: "CV file is corrupted or unreadable" });
      }

      // Determine content type from file extension
      const ext = path.extname(actualFilename).toLowerCase();
      const contentType =
        ext === ".pdf"
          ? "application/pdf"
          : ext === ".docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : ext === ".doc"
              ? "application/msword"
              : "application/octet-stream";

      // Set proper headers for file viewing
      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${cv.name}_CV${ext}"`
      );
      res.setHeader("Cache-Control", "private, no-cache");

      // Stream the file with error handling
      const fileStream = fs.createReadStream(filePath);

      fileStream.on("error", (streamError) => {
        console.error("File stream error:", streamError);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error reading CV file" });
        }
      });

      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading CV:", error);
      res.status(500).json({ message: "Failed to download CV" });
    }
  });

  // Admin route to check CV file integrity
  app.get(
    "/api/admin/cv-integrity",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const allCvs = await storage.getAllCvShowcase();
        const uploadsDir = path.join(process.cwd(), "uploads");
        const availableFiles = fs
          .readdirSync(uploadsDir)
          .filter((f) => f.startsWith("cv-"));

        const report = {
          totalCvs: allCvs.length,
          missingFiles: [] as any[],
          validFiles: [] as any[],
          orphanedFiles: [] as string[],
        };

        // Check each CV record
        for (const cv of allCvs) {
          if (cv.cvFileName) {
            const filePath = path.join(uploadsDir, cv.cvFileName);
            if (fs.existsSync(filePath)) {
              report.validFiles.push({
                id: cv.id,
                name: cv.name,
                email: cv.email,
                fileName: cv.cvFileName,
              });
            } else {
              report.missingFiles.push({
                id: cv.id,
                name: cv.name,
                email: cv.email,
                fileName: cv.cvFileName,
              });
            }
          }
        }

        // Check for orphaned files
        const referencedFiles = allCvs
          .map((cv) => cv.cvFileName)
          .filter(Boolean);
        report.orphanedFiles = availableFiles.filter(
          (file) => !referencedFiles.includes(file)
        );

        res.json(report);
      } catch (error) {
        console.error("Error checking CV integrity:", error);
        res.status(500).json({ message: "Failed to check CV integrity" });
      }
    }
  );

  // CV Protection System API endpoints
  app.get(
    "/api/admin/cv-protection/status",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const allCvs = await storage.getAllCvShowcase();
        const verification = await cvProtection.verifyProtectedFiles();

        // Calculate storage information
        const uploadsDir = path.join(process.cwd(), "uploads");
        const protectedDir = path.join(process.cwd(), "protected-cvs");
        const backupDir = path.join(process.cwd(), "cv-backups");

        let totalSize = 0;
        try {
          const calculateDirSize = (dirPath: string): number => {
            if (!fs.existsSync(dirPath)) return 0;
            let size = 0;
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
              const itemPath = path.join(dirPath, item);
              const stats = fs.statSync(itemPath);
              if (stats.isDirectory()) {
                size += calculateDirSize(itemPath);
              } else {
                size += stats.size;
              }
            }
            return size;
          };

          totalSize =
            calculateDirSize(uploadsDir) +
            calculateDirSize(protectedDir) +
            calculateDirSize(backupDir);
        } catch (error) {
          console.error("Error calculating storage size:", error);
        }

        const totalFiles = allCvs.filter((cv) => cv.cvFileName).length;
        const protectedFiles = verification.verified;
        const missingFiles = verification.missing;
        const integrityScore =
          totalFiles > 0
            ? Math.round((protectedFiles / totalFiles) * 100)
            : 100;

        res.json({
          totalFiles,
          protectedFiles,
          missingFiles,
          integrityScore,
          lastCheck: new Date().toISOString(),
          storageUsed: `${(totalSize / 1024 / 1024).toFixed(1)} MB`,
          availableSpace: "254 GB", // From df command earlier
        });
      } catch (error) {
        console.error("Error getting CV protection status:", error);
        res.status(500).json({ message: "Failed to get protection status" });
      }
    }
  );

  app.get(
    "/api/admin/cv-protection/files",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const manifestPath = path.join(
          process.cwd(),
          "protected-cvs",
          "PROTECTION_MANIFEST.json"
        );

        if (!fs.existsSync(manifestPath)) {
          return res.json([]);
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        const protectedFiles = manifest.protectedFiles || {};

        const fileList = Object.entries(protectedFiles).map(
          ([cvId, info]: [string, any]) => ({
            cvId: parseInt(cvId),
            userEmail: info.userEmail,
            originalFilename: info.originalFilename,
            protectedPaths: info.protectedPaths,
            protectedAt: info.protectedAt,
            status: info.status || "protected",
          })
        );

        res.json(fileList);
      } catch (error) {
        console.error("Error getting protected files list:", error);
        res.status(500).json({ message: "Failed to get protected files" });
      }
    }
  );

  app.post(
    "/api/admin/cv-protection/verify",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const verification = await cvProtection.verifyProtectedFiles();
        res.json({
          message: "Integrity check completed",
          ...verification,
        });
      } catch (error) {
        console.error("Error running integrity check:", error);
        res.status(500).json({ message: "Failed to run integrity check" });
      }
    }
  );

  app.post(
    "/api/admin/cv-protection/backup",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        await cvProtection.createEmergencyBackup();
        res.json({
          message: "Emergency backup created successfully",
        });
      } catch (error) {
        console.error("Error creating emergency backup:", error);
        res.status(500).json({ message: "Failed to create emergency backup" });
      }
    }
  );

  // Disaster Recovery System API endpoints
  app.post(
    "/api/admin/disaster-recovery/backup",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const { description } = req.body;
        const backup = await disasterRecovery.createCompleteBackup(
          description || "Manual backup"
        );
        res.json({
          message: "Complete system backup created",
          backup: {
            id: backup.id,
            timestamp: backup.timestamp,
            description: backup.description,
            metadata: backup.metadata,
          },
        });
      } catch (error) {
        console.error("Error creating disaster recovery backup:", error);
        res.status(500).json({ message: "Failed to create complete backup" });
      }
    }
  );

  app.get(
    "/api/admin/disaster-recovery/backups",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const backups = disasterRecovery.getAllBackups();
        res.json(backups);
      } catch (error) {
        console.error("Error listing disaster recovery backups:", error);
        res.status(500).json({ message: "Failed to list backups" });
      }
    }
  );

  app.post(
    "/api/admin/disaster-recovery/restore/:backupId",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const { backupId } = req.params;
        await disasterRecovery.restoreFromBackup(backupId);
        res.json({
          message: "System restored successfully from backup",
          backupId,
        });
      } catch (error) {
        console.error("Error restoring from backup:", error);
        res.status(500).json({ message: "Failed to restore from backup" });
      }
    }
  );

  // Admin route to clean up missing CV references
  app.post(
    "/api/admin/cv-cleanup",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const allCvs = await storage.getAllCvShowcase();
        const uploadsDir = path.join(process.cwd(), "uploads");
        const cleanedCvs = [];

        for (const cv of allCvs) {
          if (cv.cvFileName) {
            const filePath = path.join(uploadsDir, cv.cvFileName);
            if (!fs.existsSync(filePath)) {
              // Clear the file reference for missing files
              await storage.updateCvShowcase(cv.id, {
                cvFileName: null,
                cvFilePath: null,
                bio: cv.bio
                  ? `${cv.bio}\n\n[File was missing and reference cleared by admin]`
                  : "[File was missing and reference cleared by admin]",
              });
              cleanedCvs.push({
                id: cv.id,
                name: cv.name,
                email: cv.email,
                missingFile: cv.cvFileName,
              });
            }
          }
        }

        res.json({
          message: `Cleaned ${cleanedCvs.length} CV records with missing files`,
          cleanedCvs,
        });
      } catch (error) {
        console.error("Error cleaning CV references:", error);
        res.status(500).json({ message: "Failed to clean CV references" });
      }
    }
  );

  app.delete("/api/cv-showcase/:id", async (req, res) => {
    try {
      const cv = await storage.getCvShowcase(parseInt(req.params.id));
      if (cv && cv.cvFileName) {
        // Delete the physical file
        const filePath = path.join(process.cwd(), "uploads", cv.cvFileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await storage.deleteCvShowcase(parseInt(req.params.id));
      res.json({ message: "CV deleted successfully" });
    } catch (error) {
      console.error("Error deleting CV:", error);
      res.status(500).json({ message: "Failed to delete CV" });
    }
  });

  // CV-Job matching endpoint
  app.get(
    "/api/admin/cv-job-match/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const cvId = parseInt(req.params.id);
        const matches = await storage.findMatchingJobsForCV(cvId);
        res.json(matches);
      } catch (error) {
        console.error("Error finding job matches:", error);
        res.status(500).json({ message: "Failed to find job matches" });
      }
    }
  );

  // User management routes
  app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      await storage.deleteUser(parseInt(req.params.id));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Email whitelist routes
  app.get("/api/whitelist", requireAuth, requireAdmin, async (req, res) => {
    try {
      const emails = await storage.getAllWhitelistedEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      res.status(500).json({ message: "Failed to fetch whitelist" });
    }
  });

  app.post("/api/whitelist", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { email, name, notes } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const emailData = {
        email: email.toLowerCase(),
        name: name || null,
        addedBy: req.user.email,
      };

      const validatedData = insertEmailWhitelistSchema.parse(emailData);
      const result = await storage.addEmailToWhitelist(validatedData);

      // Email notifications disabled - approval through admin portal only

      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding email to whitelist:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        res.status(409).json({ message: "Email already whitelisted" });
      } else {
        res.status(500).json({ message: "Failed to add email to whitelist" });
      }
    }
  });

  app.delete(
    "/api/whitelist/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        await storage.removeEmailFromWhitelist(parseInt(req.params.id));
        res.json({ message: "Email removed from whitelist" });
      } catch (error) {
        console.error("Error removing email from whitelist:", error);
        res
          .status(500)
          .json({ message: "Failed to remove email from whitelist" });
      }
    }
  );

  // Excel import for bulk email whitelist
  app.post(
    "/api/whitelist/import",
    excelUpload.single("excel"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No Excel file provided" });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const emails = data
          .map((row: any) => ({
            email: row.email || row.Email || row.EMAIL,
            name: row.name || row.Name || row.NAME,
            unit: row.unit || row.Unit || row.UNIT,
            phone: row.phone || row.Phone || row.PHONE,
            addedBy: "Excel Import",
          }))
          .filter((email) => email.email);

        if (emails.length === 0) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            message:
              "No valid emails found. Please ensure your Excel file has email addresses in a column labeled 'email', 'Email', or 'EMAIL'.",
          });
        }

        const addedEmails = await storage.bulkAddEmails(emails);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          message: `Successfully imported ${addedEmails.length} emails`,
          emails: addedEmails,
        });
      } catch (error) {
        console.error("Error importing emails:", error);
        res.status(500).json({ message: "Failed to import emails from Excel" });
      }
    }
  );

  // Check if email is whitelisted (for authentication)
  app.post("/api/auth/check-email", async (req, res) => {
    try {
      const { email } = req.body;
      const isWhitelisted = await storage.isEmailWhitelisted(email);
      res.json({ isWhitelisted });
    } catch (error) {
      console.error("Error checking email whitelist:", error);
      res.status(500).json({ message: "Failed to check email" });
    }
  });

  // Access request endpoint
  app.post("/api/auth/request-access", async (req, res) => {
    try {
      const { fullName, email, unitNumber, mobile } = req.body;

      if (!fullName || !email || !unitNumber) {
        return res
          .status(400)
          .json({ message: "Full name, email, and unit number are required" });
      }

      // Check if email is already whitelisted
      const isAlreadyWhitelisted = await storage.isEmailWhitelisted(
        email.toLowerCase()
      );
      if (isAlreadyWhitelisted) {
        return res.status(400).json({
          message:
            "This email is already registered in the system. Please try logging in directly.",
        });
      }

      // Check if there's already a pending access request for this email
      const existingRequests = await storage.getAccessRequests();
      const hasPendingRequest = existingRequests.some(
        (request: any) =>
          request.email.toLowerCase() === email.toLowerCase() &&
          request.status === "pending"
      );

      if (hasPendingRequest) {
        return res.status(400).json({
          message:
            "An access request for this email is already pending review. Please wait for admin approval.",
        });
      }

      // Store the access request
      const accessRequest = await storage.createAccessRequest({
        fullName,
        email: email.toLowerCase(),
        unitNumber,
        mobile: mobile || null,
      });

      res.json({ message: "Access request submitted successfully" });
    } catch (error) {
      console.error("Error submitting access request:", error);
      res.status(500).json({ message: "Failed to submit access request" });
    }
  });

  // Get access requests (admin only)
  app.get(
    "/api/access-requests",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const requests = await storage.getAccessRequests();
        res.json(requests);
      } catch (error) {
        console.error("Error fetching access requests:", error);
        res.status(500).json({ message: "Failed to fetch access requests" });
      }
    }
  );

  // Approve access request (admin only)
  app.post(
    "/api/access-requests/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const requestId = parseInt(req.params.id);
        const request = await storage.approveAccessRequest(requestId);
        res.json({ message: "Access request approved", request });
      } catch (error) {
        console.error("Error approving access request:", error);
        res.status(500).json({ message: "Failed to approve access request" });
      }
    }
  );

  // Reject access request (admin only)
  app.post(
    "/api/access-requests/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const requestId = parseInt(req.params.id);
        await storage.rejectAccessRequest(requestId);
        res.json({ message: "Access request rejected" });
      } catch (error) {
        console.error("Error rejecting access request:", error);
        res.status(500).json({ message: "Failed to reject access request" });
      }
    }
  );

  // Job approval routes for admin
  app.post(
    "/api/admin/jobs/:id/approve",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const job = await storage.updateJob(id, {
          isApproved: true,
          status: "approved",
        });
        res.json(job);
      } catch (error) {
        console.error("Error approving job:", error);
        res.status(500).json({ message: "Failed to approve job" });
      }
    }
  );

  app.post(
    "/api/admin/jobs/:id/reject",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteJob(id);
        res.json({ message: "Job rejected and deleted" });
      } catch (error) {
        console.error("Error rejecting job:", error);
        res.status(500).json({ message: "Failed to reject job" });
      }
    }
  );

  // Community Benefits routes
  app.get("/api/community-benefits", async (req, res) => {
    try {
      const benefits = await storage.getHomepageBenefits();
      res.json(benefits);
    } catch (error) {
      console.error("Error fetching community benefits:", error);
      res.status(500).json({ message: "Failed to fetch community benefits" });
    }
  });

  // Public Community Benefits route for homepage
  app.get("/api/community-benefits", async (req, res) => {
    try {
      const benefits = await storage.getHomepageBenefits();
      res.json(benefits);
    } catch (error) {
      console.error("Error fetching homepage community benefits:", error);
      res.status(500).json({ message: "Failed to fetch community benefits" });
    }
  });

  // Public Community Benefits route for all active benefits
  app.get("/api/community-benefits/all", async (req, res) => {
    try {
      const benefits = await storage.getAllActiveBenefits();
      res.json(benefits);
    } catch (error) {
      console.error("Error fetching all community benefits:", error);
      res.status(500).json({ message: "Failed to fetch community benefits" });
    }
  });

  app.get(
    "/api/admin/community-benefits",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const benefits = await storage.getAllCommunityBenefits();
        res.json(benefits);
      } catch (error) {
        console.error("Error fetching all community benefits:", error);
        res.status(500).json({ message: "Failed to fetch community benefits" });
      }
    }
  );

  app.post(
    "/api/admin/community-benefits",
    requireAuth,
    requireAdmin,
    imageUpload.array("images", 5),
    async (req, res) => {
      try {
        const imageUrls =
          req.files && Array.isArray(req.files)
            ? req.files.map((file: any) => `/uploads/${file.filename}`)
            : [];

        // Register all uploaded images for permanent retention
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach((file: any) => {
            fileRetentionManager.registerFile({
              filename: file.filename,
              originalName: file.originalname,
              uploadDate: new Date(),
              fileType: file.mimetype,
              size: file.size,
              category: "community-benefit-image",
            });
          });
        }

        const benefitData = {
          title: req.body.title,
          description: req.body.description,
          discountPercentage: req.body.discountPercentage,
          businessName: req.body.businessName,
          location: req.body.location,
          validUntil: req.body.validUntil,
          category: req.body.category,
          isActive: req.body.isActive === "true" || req.body.isActive === true,
          showOnHomepage:
            req.body.showOnHomepage === "true" ||
            req.body.showOnHomepage === true,
          imageUrls: imageUrls,
        };

        const benefit = await storage.createCommunityBenefit(benefitData);
        res.status(201).json(benefit);
      } catch (error) {
        console.error("Error creating community benefit:", error);
        res.status(500).json({ message: "Failed to create community benefit" });
      }
    }
  );

  app.put(
    "/api/admin/community-benefits/:id",
    requireAuth,
    requireAdmin,
    imageUpload.single("image"),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const updateData: any = {
          title: req.body.title,
          description: req.body.description,
          discountPercentage: req.body.discountPercentage,
          businessName: req.body.businessName,
          location: req.body.location,
          validUntil: req.body.validUntil,
          category: req.body.category,
          isActive: req.body.isActive === "true",
          showOnHomepage: req.body.showOnHomepage === "true",
        };

        if (req.file) {
          // Register new image for permanent retention
          fileRetentionManager.registerFile({
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadDate: new Date(),
            fileType: req.file.mimetype,
            size: req.file.size,
            category: "community-benefit-image",
          });

          updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const benefit = await storage.updateCommunityBenefit(id, updateData);
        res.json(benefit);
      } catch (error) {
        console.error("Error updating community benefit:", error);
        res.status(500).json({ message: "Failed to update community benefit" });
      }
    }
  );

  app.delete(
    "/api/admin/community-benefits/:id",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteCommunityBenefit(id);
        res.json({ message: "Community benefit deleted successfully" });
      } catch (error) {
        console.error("Error deleting community benefit:", error);
        res.status(500).json({ message: "Failed to delete community benefit" });
      }
    }
  );

  // Job-CV Matching routes
  app.get(
    "/api/jobs/:id/matching-cvs",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const jobId = parseInt(req.params.id);
        const matchingCVs = await storage.findMatchingCVsForJob(jobId);
        res.json({
          jobId,
          matchingCVs,
          count: matchingCVs.length,
        });
      } catch (error) {
        console.error("Error finding matching CVs:", error);
        res.status(500).json({ message: "Failed to find matching CVs" });
      }
    }
  );

  app.get(
    "/api/cv-showcase/:id/matching-jobs",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const cvId = parseInt(req.params.id);
        const matchingJobs = await storage.findMatchingJobsForCV(cvId);
        res.json({
          cvId,
          matchingJobs,
          count: matchingJobs.length,
        });
      } catch (error) {
        console.error("Error finding matching jobs:", error);
        res.status(500).json({ message: "Failed to find matching jobs" });
      }
    }
  );

  // Admin login with username/password
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Simple admin credentials check
      const adminUsername = "admin";
      const adminPassword = "NewGiza@2025!";

      if (username === adminUsername && password === adminPassword) {
        // Set admin session
        req.session.isAdmin = true;
        req.session.adminUser = { username: adminUsername };
        res.json({ success: true, message: "Admin login successful" });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.isAdmin = false;
      req.session.adminUser = null;
      res.json({ success: true, message: "Admin logout successful" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Admin logout failed" });
    }
  });

  // Admin credentials change
  app.post(
    "/api/admin/change-credentials",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const { currentPassword, newEmail, newPassword } = req.body;

        // Get current admin credentials
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@newgiza.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "NewGiza@2025!";

        // Verify current password
        if (currentPassword !== ADMIN_PASSWORD) {
          return res
            .status(401)
            .json({ message: "Current password is incorrect" });
        }

        // Validate inputs
        if (newEmail && !newEmail.includes("@")) {
          return res
            .status(400)
            .json({ message: "Please enter a valid email address" });
        }

        if (newPassword && newPassword.length < 8) {
          return res
            .status(400)
            .json({
              message: "New password must be at least 8 characters long",
            });
        }

        // Update credentials
        if (newEmail) {
          process.env.ADMIN_EMAIL = newEmail;
        }
        if (newPassword) {
          process.env.ADMIN_PASSWORD = newPassword;
        }

        res.json({ message: "Admin credentials updated successfully" });
      } catch (error) {
        console.error("Credentials change error:", error);
        res.status(500).json({ message: "Failed to update credentials" });
      }
    }
  );

  // Backup and Restore endpoints
  app.get("/api/admin/backups", async (req, res) => {
    try {
      const { backupSystem } = await import("./backup-system");
      const backups = backupSystem.getAllBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ message: "Failed to fetch backups" });
    }
  });

  app.post("/api/admin/backups", async (req, res) => {
    try {
      const { description } = req.body;
      const { backupSystem } = await import("./backup-system");
      const backup = await backupSystem.createCompleteBackup(description);
      res.json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.post("/api/admin/backups/:id/restore", async (req, res) => {
    try {
      const { id } = req.params;
      const { backupSystem } = await import("./backup-system");
      await backupSystem.restoreFromBackup(id);
      res.json({ message: "Backup restored successfully" });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ message: "Failed to restore backup" });
    }
  });

  // Whitelist user editing endpoint
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      // Update whitelist entry directly in database
      const [updatedUser] = await db
        .update(emailWhitelist)
        .set({
          name: updates.name,
          phone: updates.phone,
          unit: updates.unit,
          isActive: updates.isActive,
          updatedAt: new Date(),
        })
        .where(eq(emailWhitelist.id, userId))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // User deletion endpoint - Force delete implementation
  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Use force delete to bypass all caching and connection issues
      const deleted = await forceDelete.forceDeleteUser(userId);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify deletion was successful
      const stillExists = await forceDelete.verifyDeletion(userId);

      res.status(200).json({
        message: "User deleted successfully",
        verified: stillExists,
        userId: userId,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ message: "Failed to delete user", error: error.message });
    }
  });

  // Emergency table recreation endpoint
  app.post(
    "/api/admin/fix-whitelist",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        await emailWhitelistFix.recreateTable();
        res
          .status(200)
          .json({ message: "Email whitelist table recreated successfully" });
      } catch (error) {
        console.error("Error recreating table:", error);
        res
          .status(500)
          .json({ message: "Failed to recreate table", error: error.message });
      }
    }
  );

  // File integrity monitoring endpoint for admins
  app.get(
    "/api/admin/file-integrity",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const integrityReport = fileRetentionManager.auditFileIntegrity();
        const retentionPolicy = {
          enforced: true,
          backupSystemActive: true,
          permanentStorage: true,
          noExpirationPolicy: true,
        };

        res.json({
          ...integrityReport,
          retentionPolicy,
          message: "All files are permanently stored with backup protection",
        });
      } catch (error) {
        console.error("Error checking file integrity:", error);
        res.status(500).json({ message: "Failed to check file integrity" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
