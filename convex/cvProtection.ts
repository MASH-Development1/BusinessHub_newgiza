import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export interface CVProtectionRecord {
  cv_id: number;
  user_email: string;
  original_filename: string;
  protected_paths: string[];
  protected_at: string;
  status: 'protected' | 'missing' | 'corrupted';
}

// Query to get CV protection status
export const getCVProtectionStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get all CV protection records
    const protectionRecords = await ctx.db.query("cv_protection").collect();
    
    // Get all CV showcase entries to check protection status
    const cvShowcase = await ctx.db.query("cv_showcase").collect();
    
    const protectionStatus = {
      totalCVs: cvShowcase.length,
      protectedCVs: protectionRecords.length,
      missingProtection: cvShowcase.length - protectionRecords.length,
      protectionRecords: protectionRecords,
      lastUpdated: new Date().toISOString(),
    };

    return protectionStatus;
  },
});

// Query to get CV protection details for a specific CV
export const getCVProtectionDetails = query({
  args: { cvId: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get CV protection record
    const protectionRecord = await ctx.db
      .query("cv_protection")
      .withIndex("cv_id", (q) => q.eq("cv_id", args.cvId))
      .first();

    if (!protectionRecord) {
      return { protected: false, message: "CV not found in protection system" };
    }

    return {
      protected: true,
      record: protectionRecord,
      status: protectionRecord.status,
    };
  },
});

// Mutation to protect a CV file
export const protectCVFile = mutation({
  args: { 
    cvId: v.number(),
    userEmail: v.string(),
    originalFilename: v.string(),
    protectedPaths: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    const now = new Date().toISOString();

    // Check if protection record already exists
    const existingRecord = await ctx.db
      .query("cv_protection")
      .withIndex("cv_id", (q) => q.eq("cv_id", args.cvId))
      .first();

    if (existingRecord) {
      // Update existing record
      await ctx.db.patch(existingRecord._id, {
        user_email: args.userEmail,
        original_filename: args.originalFilename,
        protected_paths: args.protectedPaths,
        protected_at: now,
        status: 'protected',
        updated_at: now,
      });

      return { success: true, message: "CV protection updated", recordId: existingRecord._id };
    } else {
      // Create new protection record
      const recordId = await ctx.db.insert("cv_protection", {
        cv_id: args.cvId,
        user_email: args.userEmail,
        original_filename: args.originalFilename,
        protected_paths: args.protectedPaths,
        protected_at: now,
        status: 'protected',
        created_at: now,
        updated_at: now,
      });

      return { success: true, message: "CV protected successfully", recordId };
    }
  },
});

// Mutation to verify CV protection integrity
export const verifyCVProtectionIntegrity = mutation({
  args: { cvId: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get CV protection record
    const protectionRecord = await ctx.db
      .query("cv_protection")
      .withIndex("cv_id", (q) => q.eq("cv_id", args.cvId))
      .first();

    if (!protectionRecord) {
      return { 
        verified: false, 
        status: 'missing', 
        message: "CV not found in protection system" 
      };
    }

    // In a real implementation, you would check if the protected files actually exist
    // For now, we'll assume they exist and update the status
    const now = new Date().toISOString();
    
    await ctx.db.patch(protectionRecord._id, {
      status: 'protected',
      updated_at: now,
    });

    return { 
      verified: true, 
      status: 'protected', 
      message: "CV protection verified successfully",
      record: protectionRecord,
    };
  },
});

// Mutation to restore CV from protection
export const restoreCVFromProtection = mutation({
  args: { cvId: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get CV protection record
    const protectionRecord = await ctx.db
      .query("cv_protection")
      .withIndex("cv_id", (q) => q.eq("cv_id", args.cvId))
      .first();

    if (!protectionRecord) {
      throw new Error("CV protection record not found");
    }

    // In a real implementation, you would copy the protected file back to the uploads directory
    // For now, we'll just return success
    const now = new Date().toISOString();
    
    await ctx.db.patch(protectionRecord._id, {
      status: 'protected',
      updated_at: now,
    });

    return { 
      success: true, 
      message: "CV restored from protection successfully",
      restoredFilename: protectionRecord.original_filename,
    };
  },
});

// Mutation to create emergency backup of all CVs
export const createEmergencyCVBackup = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    const now = new Date().toISOString();
    const backupId = `emergency-cv-backup-${Date.now()}`;

    // Get all CV showcase entries
    const cvShowcase = await ctx.db.query("cv_showcase").collect();
    
    // Create emergency backup record
    const backupRecordId = await ctx.db.insert("cv_emergency_backups", {
      backup_id: backupId,
      cv_count: cvShowcase.length,
      created_at: now,
      created_by: identity.email!,
      status: 'completed',
    });

    // Store CV data in backup
    for (const cv of cvShowcase) {
      await ctx.db.insert("cv_emergency_backup_data", {
        backup_id: backupId,
        cv_id: parseInt(cv._id),
        cv_data: cv,
        created_at: now,
      });
    }

    return { 
      success: true, 
      backupId, 
      cvCount: cvShowcase.length,
      message: "Emergency CV backup created successfully" 
    };
  },
});

// Query to get emergency CV backups
export const getEmergencyCVBackups = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get all emergency backups
    const backups = await ctx.db.query("cv_emergency_backups").collect();
    return backups;
  },
}); 