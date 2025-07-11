import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export interface BackupMetadata {
  id: string;
  timestamp: string;
  description: string;
  tables: string[];
  filesCount: number;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
}

// Query to get all backups
export const getAllBackups = query({
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

    // Get all backups from the backups table
    const backups = await ctx.db.query("backups").collect();
    return backups;
  },
});

// Mutation to create a complete backup
export const createCompleteBackup = mutation({
  args: { description: v.optional(v.string()) },
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

    const backupId = `backup-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const description = args.description || 'Manual backup';

    try {
      // Create backup metadata
      const backupMetadata: BackupMetadata = {
        id: backupId,
        timestamp,
        description,
        tables: [
          'users', 'profiles', 'jobs', 'internships', 'courses', 
          'applications', 'cv_showcase', 'email_whitelist', 
          'access_requests', 'community_benefits', 'removed_jobs', 'removed_internships'
        ],
        filesCount: 0, // Will be calculated
        size: '0MB', // Will be calculated
        status: 'in-progress'
      };

      // Insert backup record
      const backupRecordId = await ctx.db.insert("backups", {
        backup_id: backupId,
        metadata: backupMetadata,
        created_at: timestamp,
        created_by: identity.email!,
      });

      // Export all tables to backup data
      await exportTableToBackup(ctx, backupId, 'users');
      await exportTableToBackup(ctx, backupId, 'profiles');
      await exportTableToBackup(ctx, backupId, 'jobs');
      await exportTableToBackup(ctx, backupId, 'internships');
      await exportTableToBackup(ctx, backupId, 'courses');
      await exportTableToBackup(ctx, backupId, 'applications');
      await exportTableToBackup(ctx, backupId, 'cv_showcase');
      await exportTableToBackup(ctx, backupId, 'email_whitelist');
      await exportTableToBackup(ctx, backupId, 'access_requests');
      await exportTableToBackup(ctx, backupId, 'community_benefits');
      await exportTableToBackup(ctx, backupId, 'removed_jobs');
      await exportTableToBackup(ctx, backupId, 'removed_internships');

      // Update backup status to completed
      await ctx.db.patch(backupRecordId, {
        metadata: {
          ...backupMetadata,
          status: 'completed',
          filesCount: 12, // Number of tables backed up
          size: 'Calculated', // Would need file system access for actual size
        }
      });

      return { success: true, backupId, backupRecordId };
    } catch (error) {
      // Update backup status to failed
      const backupRecord = await ctx.db
        .query("backups")
        .withIndex("backup_id", (q) => q.eq("backup_id", backupId))
        .first();
      
      if (backupRecord) {
        await ctx.db.patch(backupRecord._id, {
          metadata: {
            id: backupId,
            timestamp,
            description,
            tables: [],
            filesCount: 0,
            size: '0MB',
            status: 'failed'
          }
        });
      }

      throw error;
    }
  },
});

// Mutation to restore from backup
export const restoreFromBackup = mutation({
  args: { backupId: v.string() },
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

    // Get backup data
    const backupData = await ctx.db
      .query("backup_data")
      .withIndex("backup_id", (q) => q.eq("backup_id", args.backupId))
      .collect();

    if (backupData.length === 0) {
      throw new Error("Backup not found");
    }

    try {
      // Restore each table
      for (const data of backupData) {
        await restoreTableFromBackup(ctx, data.table_name, data.data);
      }

      return { success: true, message: "Backup restored successfully" };
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error}`);
    }
  },
});

// Mutation to delete a backup
export const deleteBackup = mutation({
  args: { backupId: v.string() },
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

    // Delete backup record
    const backupRecord = await ctx.db
      .query("backups")
      .withIndex("backup_id", (q) => q.eq("backup_id", args.backupId))
      .first();

    if (backupRecord) {
      await ctx.db.delete(backupRecord._id);
    }

    // Delete all backup data
    const backupData = await ctx.db
      .query("backup_data")
      .withIndex("backup_id", (q) => q.eq("backup_id", args.backupId))
      .collect();

    for (const data of backupData) {
      await ctx.db.delete(data._id);
    }

    return { success: true };
  },
});

// Helper function to export table data to backup
async function exportTableToBackup(ctx: any, backupId: string, tableName: string) {
  let data: any[] = [];

  switch (tableName) {
    case 'users':
      data = await ctx.db.query("users").collect();
      break;
    case 'profiles':
      data = await ctx.db.query("profiles").collect();
      break;
    case 'jobs':
      data = await ctx.db.query("jobs").collect();
      break;
    case 'internships':
      data = await ctx.db.query("internships").collect();
      break;
    case 'courses':
      data = await ctx.db.query("courses").collect();
      break;
    case 'applications':
      data = await ctx.db.query("applications").collect();
      break;
    case 'cv_showcase':
      data = await ctx.db.query("cv_showcase").collect();
      break;
    case 'email_whitelist':
      data = await ctx.db.query("email_whitelist").collect();
      break;
    case 'access_requests':
      data = await ctx.db.query("access_requests").collect();
      break;
    case 'community_benefits':
      data = await ctx.db.query("community_benefits").collect();
      break;
    case 'removed_jobs':
      data = await ctx.db.query("removed_jobs").collect();
      break;
    case 'removed_internships':
      data = await ctx.db.query("removed_internships").collect();
      break;
  }

  // Store backup data
  await ctx.db.insert("backup_data", {
    backup_id: backupId,
    table_name: tableName,
    data: data,
    created_at: new Date().toISOString(),
  });
}

// Helper function to restore table from backup
async function restoreTableFromBackup(ctx: any, tableName: string, data: any[]) {
  // Clear existing data (optional - could be made configurable)
  // For now, we'll just add the backup data as new records

  for (const record of data) {
    const { _id, ...recordData } = record; // Remove _id to create new records
    
    switch (tableName) {
      case 'users':
        await ctx.db.insert("users", recordData);
        break;
      case 'profiles':
        await ctx.db.insert("profiles", recordData);
        break;
      case 'jobs':
        await ctx.db.insert("jobs", recordData);
        break;
      case 'internships':
        await ctx.db.insert("internships", recordData);
        break;
      case 'courses':
        await ctx.db.insert("courses", recordData);
        break;
      case 'applications':
        await ctx.db.insert("applications", recordData);
        break;
      case 'cv_showcase':
        await ctx.db.insert("cv_showcase", recordData);
        break;
      case 'email_whitelist':
        await ctx.db.insert("email_whitelist", recordData);
        break;
      case 'access_requests':
        await ctx.db.insert("access_requests", recordData);
        break;
      case 'community_benefits':
        await ctx.db.insert("community_benefits", recordData);
        break;
      case 'removed_jobs':
        await ctx.db.insert("removed_jobs", recordData);
        break;
      case 'removed_internships':
        await ctx.db.insert("removed_internships", recordData);
        break;
    }
  }
} 