/**
 * Disaster Recovery System - Complete Backup and Restoration
 * Handles full system recovery from catastrophic data loss
 */

import fs from 'fs';
import path from 'path';
import { db } from './db';
import { storage } from './storage';
import * as schema from '../shared/schema';

export interface DisasterRecoveryBackup {
  id: string;
  timestamp: Date;
  description: string;
  databaseTables: Record<string, any[]>;
  files: { [filename: string]: string }; // Base64 encoded files
  metadata: {
    totalRecords: number;
    totalFiles: number;
    backupSize: string;
    version: string;
  };
}

export class DisasterRecoverySystem {
  private backupDir: string;

  constructor() {
    this.backupDir = path.join(process.cwd(), 'disaster-recovery-backups');
    this.initializeSystem();
  }

  private initializeSystem(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Create system info file
    const systemInfoPath = path.join(this.backupDir, 'SYSTEM_INFO.json');
    if (!fs.existsSync(systemInfoPath)) {
      fs.writeFileSync(systemInfoPath, JSON.stringify({
        created: new Date().toISOString(),
        purpose: 'Complete disaster recovery backups',
        warning: 'CRITICAL - DO NOT DELETE - Contains full system state',
        version: '1.0.0'
      }, null, 2));
    }

    console.log('Disaster Recovery System initialized');
  }

  /**
   * Create a complete disaster recovery backup
   */
  async createCompleteBackup(description: string = 'Full system backup'): Promise<DisasterRecoveryBackup> {
    const backupId = `disaster-recovery-${Date.now()}`;
    const timestamp = new Date();

    console.log(`Creating disaster recovery backup: ${backupId}`);

    try {
      // 1. Backup all database tables with data
      const databaseTables = await this.backupAllDatabaseTables();

      // 2. Backup all files with content
      const files = await this.backupAllFiles();

      // 3. Create backup metadata
      const totalRecords = Object.values(databaseTables).reduce((sum, table) => sum + table.length, 0);
      const totalFiles = Object.keys(files).length;
      const backupSize = this.calculateBackupSize(databaseTables, files);

      const backup: DisasterRecoveryBackup = {
        id: backupId,
        timestamp,
        description,
        databaseTables,
        files,
        metadata: {
          totalRecords,
          totalFiles,
          backupSize,
          version: '1.0.0'
        }
      };

      // 4. Save the complete backup
      const backupPath = path.join(this.backupDir, `${backupId}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

      // 5. Create a compressed version for storage efficiency
      await this.createCompressedBackup(backup, backupId);

      console.log(`✓ Disaster recovery backup created: ${totalRecords} records, ${totalFiles} files`);
      return backup;

    } catch (error) {
      console.error('Error creating disaster recovery backup:', error);
      throw error;
    }
  }

  /**
   * Backup all database tables with complete data
   */
  private async backupAllDatabaseTables(): Promise<Record<string, any[]>> {
    const tables: Record<string, any[]> = {};

    try {
      // CV Showcase
      tables.cv_showcase = await storage.getAllCvShowcase();
      
      // Jobs
      tables.jobs = await storage.getAllJobs();
      
      // Internships
      tables.internships = await storage.getAllInternships();
      
      // Applications
      tables.applications = await storage.getAllApplications();
      
      // Courses
      tables.courses = await storage.getAllCourses();
      
      // Profiles
      tables.profiles = await storage.getAllProfiles();
      
      // Email Whitelist
      tables.email_whitelist = await storage.getAllWhitelistedEmails();
      
      // Community Benefits
      tables.community_benefits = await storage.getAllCommunityBenefits();
      
      // Access Requests
      tables.access_requests = await storage.getAccessRequests();

      console.log('✓ All database tables backed up');
      return tables;

    } catch (error) {
      console.error('Error backing up database tables:', error);
      throw error;
    }
  }

  /**
   * Backup all files with their content as base64
   */
  private async backupAllFiles(): Promise<{ [filename: string]: string }> {
    const files: { [filename: string]: string } = {};
    const uploadsDir = path.join(process.cwd(), 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        console.log('No uploads directory found, skipping file backup');
        return files;
      }

      const fileList = this.getAllFilesRecursively(uploadsDir);
      
      for (const filePath of fileList) {
        const relativePath = path.relative(uploadsDir, filePath);
        const fileContent = fs.readFileSync(filePath);
        files[relativePath] = fileContent.toString('base64');
      }

      console.log(`✓ ${fileList.length} files backed up with content`);
      return files;

    } catch (error) {
      console.error('Error backing up files:', error);
      throw error;
    }
  }

  /**
   * Get all files recursively from a directory
   */
  private getAllFilesRecursively(dirPath: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        files.push(...this.getAllFilesRecursively(itemPath));
      } else {
        files.push(itemPath);
      }
    }
    
    return files;
  }

  /**
   * Calculate backup size
   */
  private calculateBackupSize(databaseTables: Record<string, any[]>, files: { [filename: string]: string }): string {
    const dbSize = JSON.stringify(databaseTables).length;
    const filesSize = Object.values(files).reduce((sum, content) => sum + content.length, 0);
    const totalSize = dbSize + filesSize;
    
    if (totalSize > 1024 * 1024) {
      return `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
    } else if (totalSize > 1024) {
      return `${(totalSize / 1024).toFixed(2)} KB`;
    } else {
      return `${totalSize} bytes`;
    }
  }

  /**
   * Create compressed backup for storage efficiency
   */
  private async createCompressedBackup(backup: DisasterRecoveryBackup, backupId: string): Promise<void> {
    try {
      // Create a summary version without file content for quick reference
      const summary = {
        ...backup,
        files: Object.keys(backup.files).reduce((acc, key) => {
          acc[key] = `[${backup.files[key].length} bytes]`;
          return acc;
        }, {} as { [key: string]: string })
      };

      const summaryPath = path.join(this.backupDir, `${backupId}-summary.json`);
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

      console.log('✓ Backup summary created');
    } catch (error) {
      console.error('Error creating compressed backup:', error);
    }
  }

  /**
   * Restore complete system from backup
   */
  async restoreFromBackup(backupId: string): Promise<void> {
    const backupPath = path.join(this.backupDir, `${backupId}.json`);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupId}`);
    }

    console.log(`Starting disaster recovery restoration from: ${backupId}`);

    try {
      const backup: DisasterRecoveryBackup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

      // 1. Clear existing data (WARNING: Destructive operation)
      console.log('⚠️  Clearing existing data...');
      await this.clearAllData();

      // 2. Restore database tables
      console.log('📥 Restoring database tables...');
      await this.restoreAllDatabaseTables(backup.databaseTables);

      // 3. Restore files
      console.log('📁 Restoring files...');
      await this.restoreAllFiles(backup.files);

      console.log(`✅ Disaster recovery completed successfully`);
      console.log(`📊 Restored: ${backup.metadata.totalRecords} records, ${backup.metadata.totalFiles} files`);

    } catch (error) {
      console.error('❌ Disaster recovery failed:', error);
      throw error;
    }
  }

  /**
   * Clear all existing data (destructive operation)
   */
  private async clearAllData(): Promise<void> {
    try {
      // Clear database tables (keep structure, remove data)
      await db.delete(schema.cvShowcase);
      await db.delete(schema.jobs);
      await db.delete(schema.internships);
      await db.delete(schema.applications);
      await db.delete(schema.courses);
      await db.delete(schema.profiles);
      await db.delete(schema.communityBenefits);
      await db.delete(schema.accessRequests);
      // Note: Don't clear email_whitelist as it's critical for access

      // Clear files
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
          const filePath = path.join(uploadsDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      }

      console.log('✓ Existing data cleared');
    } catch (error) {
      console.error('Error clearing existing data:', error);
      throw error;
    }
  }

  /**
   * Restore all database tables
   */
  private async restoreAllDatabaseTables(tables: Record<string, any[]>): Promise<void> {
    try {
      // Restore in order to handle dependencies
      if (tables.cv_showcase) {
        await db.insert(schema.cvShowcase).values(tables.cv_showcase);
        console.log(`✓ Restored ${tables.cv_showcase.length} CV records`);
      }

      if (tables.jobs) {
        await db.insert(schema.jobs).values(tables.jobs);
        console.log(`✓ Restored ${tables.jobs.length} job records`);
      }

      if (tables.internships) {
        await db.insert(schema.internships).values(tables.internships);
        console.log(`✓ Restored ${tables.internships.length} internship records`);
      }

      if (tables.applications) {
        await db.insert(schema.applications).values(tables.applications);
        console.log(`✓ Restored ${tables.applications.length} application records`);
      }

      if (tables.courses) {
        await db.insert(schema.courses).values(tables.courses);
        console.log(`✓ Restored ${tables.courses.length} course records`);
      }

      if (tables.profiles) {
        await db.insert(schema.profiles).values(tables.profiles);
        console.log(`✓ Restored ${tables.profiles.length} profile records`);
      }

      if (tables.community_benefits) {
        await db.insert(schema.communityBenefits).values(tables.community_benefits);
        console.log(`✓ Restored ${tables.community_benefits.length} community benefit records`);
      }

      if (tables.access_requests) {
        await db.insert(schema.accessRequests).values(tables.access_requests);
        console.log(`✓ Restored ${tables.access_requests.length} access request records`);
      }

      console.log('✅ All database tables restored');
    } catch (error) {
      console.error('Error restoring database tables:', error);
      throw error;
    }
  }

  /**
   * Restore all files from base64 content
   */
  private async restoreAllFiles(files: { [filename: string]: string }): Promise<void> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    try {
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      for (const [relativePath, base64Content] of Object.entries(files)) {
        const fullPath = path.join(uploadsDir, relativePath);
        const directory = path.dirname(fullPath);
        
        // Ensure directory exists
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }
        
        // Restore file content
        const fileContent = Buffer.from(base64Content, 'base64');
        fs.writeFileSync(fullPath, fileContent);
      }

      console.log(`✅ Restored ${Object.keys(files).length} files`);
    } catch (error) {
      console.error('Error restoring files:', error);
      throw error;
    }
  }

  /**
   * List all available disaster recovery backups
   */
  getAllBackups(): { id: string; timestamp: Date; description: string; metadata: any }[] {
    try {
      const backups: { id: string; timestamp: Date; description: string; metadata: any }[] = [];
      
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = files.filter(file => file.endsWith('.json') && !file.includes('summary') && file !== 'SYSTEM_INFO.json');
      
      for (const file of backupFiles) {
        try {
          const backupPath = path.join(this.backupDir, file);
          const backup: DisasterRecoveryBackup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
          
          backups.push({
            id: backup.id,
            timestamp: backup.timestamp,
            description: backup.description,
            metadata: backup.metadata
          });
        } catch (error) {
          console.error(`Error reading backup file ${file}:`, error);
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Schedule automatic disaster recovery backups
   */
  startAutomaticBackups(): void {
    // Create backup every 6 hours
    setInterval(async () => {
      try {
        await this.createCompleteBackup('Automated disaster recovery backup');
        console.log('✓ Automatic disaster recovery backup completed');
      } catch (error) {
        console.error('❌ Automatic disaster recovery backup failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('🔄 Automatic disaster recovery backups scheduled (every 6 hours)');
  }
}

export const disasterRecovery = new DisasterRecoverySystem();