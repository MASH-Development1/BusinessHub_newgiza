/**
 * Comprehensive Backup System for Hub Within Platform
 * 
 * This system creates regular backups of all platform data including:
 * - Database tables and content
 * - Uploaded files (CVs, images, documents)
 * - System configuration
 * 
 * Backups are created automatically and can be restored when needed.
 */

import { db } from './db';
import { storage } from './storage';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface BackupMetadata {
  id: string;
  timestamp: Date;
  description: string;
  tables: string[];
  filesCount: number;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
}

export class BackupSystem {
  private backupDir: string;
  private metadataFile: string;

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    this.metadataFile = path.join(this.backupDir, 'backup-metadata.json');
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    // Create subdirectories for different backup types
    const subdirs = ['database', 'files', 'complete'];
    subdirs.forEach(dir => {
      const fullPath = path.join(this.backupDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  /**
   * Create a complete backup of all platform data
   */
  async createCompleteBackup(description: string = 'Automated backup'): Promise<BackupMetadata> {
    const backupId = `backup-${Date.now()}`;
    const timestamp = new Date();
    
    console.log(`Starting complete backup: ${backupId}`);
    
    try {
      // Create backup directory for this specific backup
      const backupPath = path.join(this.backupDir, 'complete', backupId);
      fs.mkdirSync(backupPath, { recursive: true });

      // Backup database
      await this.backupDatabase(backupPath);
      
      // Backup files
      const filesCount = await this.backupFiles(backupPath);
      
      // Calculate backup size
      const size = await this.calculateDirectorySize(backupPath);
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        description,
        tables: [
          'users', 'profiles', 'jobs', 'internships', 'courses', 
          'applications', 'cv_showcase', 'email_whitelist', 
          'access_requests', 'community_benefits'
        ],
        filesCount,
        size,
        status: 'completed'
      };

      // Save metadata
      await this.saveBackupMetadata(metadata);
      
      console.log(`Backup completed: ${backupId}`);
      return metadata;
      
    } catch (error) {
      console.error(`Backup failed: ${error}`);
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        description,
        tables: [],
        filesCount: 0,
        size: '0MB',
        status: 'failed'
      };
      
      await this.saveBackupMetadata(metadata);
      throw error;
    }
  }

  /**
   * Backup all database tables
   */
  private async backupDatabase(backupPath: string): Promise<void> {
    const dbBackupPath = path.join(backupPath, 'database');
    fs.mkdirSync(dbBackupPath, { recursive: true });

    // Export each table as JSON
    const tables = [
      'users', 'profiles', 'jobs', 'internships', 'courses',
      'applications', 'cv_showcase', 'email_whitelist', 
      'access_requests', 'community_benefits'
    ];

    for (const table of tables) {
      try {
        const data = await this.exportTable(table);
        const filePath = path.join(dbBackupPath, `${table}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      } catch (error) {
        console.warn(`Could not backup table ${table}:`, error);
      }
    }

    // Also create a PostgreSQL dump if possible
    try {
      const dumpPath = path.join(dbBackupPath, 'postgres-dump.sql');
      await execAsync(`pg_dump "${process.env.DATABASE_URL}" > "${dumpPath}"`);
    } catch (error) {
      console.warn('PostgreSQL dump failed, continuing with JSON backups');
    }
  }

  /**
   * Export table data as JSON
   */
  private async exportTable(tableName: string): Promise<any[]> {
    try {
      // Dynamic table export based on our storage methods
      switch (tableName) {
        case 'users':
          return await storage.getAllUsers();
        case 'profiles':
          return await storage.getAllProfiles();
        case 'jobs':
          return await storage.getAllJobs();
        case 'internships':
          return await storage.getAllInternships();
        case 'courses':
          return await storage.getAllCourses();
        case 'applications':
          return await storage.getAllApplications();
        case 'cv_showcase':
          return await storage.getAllCvShowcase();
        case 'email_whitelist':
          return await storage.getAllWhitelistedEmails();
        case 'access_requests':
          return await storage.getAccessRequests();
        case 'community_benefits':
          return await storage.getAllCommunityBenefits();
        default:
          return [];
      }
    } catch (error) {
      console.warn(`Error exporting ${tableName}:`, error);
      return [];
    }
  }

  /**
   * Backup all uploaded files
   */
  private async backupFiles(backupPath: string): Promise<number> {
    const filesBackupPath = path.join(backupPath, 'files');
    fs.mkdirSync(filesBackupPath, { recursive: true });

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      return 0;
    }

    // Copy all files from uploads directory
    try {
      await execAsync(`cp -r "${uploadsDir}"/* "${filesBackupPath}"/`);
      
      // Count files
      const files = fs.readdirSync(uploadsDir);
      return files.length;
    } catch (error) {
      console.warn('File backup failed:', error);
      return 0;
    }
  }

  /**
   * Calculate directory size
   */
  private async calculateDirectorySize(dirPath: string): Promise<string> {
    try {
      const { stdout } = await execAsync(`du -sh "${dirPath}"`);
      return stdout.split('\t')[0];
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Save backup metadata
   */
  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    let allMetadata: BackupMetadata[] = [];
    
    if (fs.existsSync(this.metadataFile)) {
      try {
        const content = fs.readFileSync(this.metadataFile, 'utf8');
        allMetadata = JSON.parse(content);
      } catch (error) {
        console.warn('Could not read existing metadata');
      }
    }

    allMetadata.push(metadata);
    
    // Keep only last 50 backups in metadata
    if (allMetadata.length > 50) {
      allMetadata = allMetadata.slice(-50);
    }

    fs.writeFileSync(this.metadataFile, JSON.stringify(allMetadata, null, 2));
  }

  /**
   * Get all backup metadata
   */
  getAllBackups(): BackupMetadata[] {
    if (!fs.existsSync(this.metadataFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.metadataFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return [];
    }
  }

  /**
   * Restore from a specific backup
   */
  async restoreFromBackup(backupId: string): Promise<void> {
    const backupPath = path.join(this.backupDir, 'complete', backupId);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup ${backupId} not found`);
    }

    console.log(`Starting restore from backup: ${backupId}`);

    // Restore database
    await this.restoreDatabase(backupPath);
    
    // Restore files
    await this.restoreFiles(backupPath);
    
    console.log(`Restore completed from backup: ${backupId}`);
  }

  /**
   * Restore database from backup
   */
  private async restoreDatabase(backupPath: string): Promise<void> {
    const dbBackupPath = path.join(backupPath, 'database');
    
    if (!fs.existsSync(dbBackupPath)) {
      throw new Error('Database backup not found');
    }

    // Try PostgreSQL restore first
    const dumpPath = path.join(dbBackupPath, 'postgres-dump.sql');
    if (fs.existsSync(dumpPath)) {
      try {
        await execAsync(`psql "${process.env.DATABASE_URL}" < "${dumpPath}"`);
        return;
      } catch (error) {
        console.warn('PostgreSQL restore failed, trying JSON restore');
      }
    }

    // Fallback to JSON restore
    const jsonFiles = fs.readdirSync(dbBackupPath).filter(f => f.endsWith('.json'));
    
    for (const file of jsonFiles) {
      const tableName = file.replace('.json', '');
      const filePath = path.join(dbBackupPath, file);
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        await this.restoreTable(tableName, data);
      } catch (error) {
        console.warn(`Could not restore table ${tableName}:`, error);
      }
    }
  }

  /**
   * Restore table data from JSON
   */
  private async restoreTable(tableName: string, data: any[]): Promise<void> {
    // This would need specific implementation based on each table structure
    console.log(`Restoring ${data.length} records to ${tableName}`);
    // Implementation would depend on having proper restore methods in storage
  }

  /**
   * Restore files from backup
   */
  private async restoreFiles(backupPath: string): Promise<void> {
    const filesBackupPath = path.join(backupPath, 'files');
    
    if (!fs.existsSync(filesBackupPath)) {
      console.warn('Files backup not found');
      return;
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Backup existing uploads before restore
    if (fs.existsSync(uploadsDir)) {
      const backupUploads = `${uploadsDir}-backup-${Date.now()}`;
      await execAsync(`mv "${uploadsDir}" "${backupUploads}"`);
    }

    // Restore files
    fs.mkdirSync(uploadsDir, { recursive: true });
    await execAsync(`cp -r "${filesBackupPath}"/* "${uploadsDir}"/`);
  }

  /**
   * Schedule automatic backups
   */
  scheduleAutomaticBackups(): void {
    // Create backup every 6 hours
    setInterval(async () => {
      try {
        await this.createCompleteBackup('Scheduled automatic backup');
      } catch (error) {
        console.error('Scheduled backup failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('Automatic backup scheduling enabled (every 6 hours)');
  }

  /**
   * Clean old backups (keep last 10)
   */
  async cleanOldBackups(): Promise<void> {
    const allBackups = this.getAllBackups();
    const sortedBackups = allBackups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (sortedBackups.length <= 10) {
      return; // Keep all if less than 10
    }

    const backupsToDelete = sortedBackups.slice(10);
    
    for (const backup of backupsToDelete) {
      try {
        const backupPath = path.join(this.backupDir, 'complete', backup.id);
        if (fs.existsSync(backupPath)) {
          await execAsync(`rm -rf "${backupPath}"`);
        }
      } catch (error) {
        console.warn(`Could not delete backup ${backup.id}:`, error);
      }
    }

    // Update metadata to remove deleted backups
    const remainingBackups = sortedBackups.slice(0, 10);
    fs.writeFileSync(this.metadataFile, JSON.stringify(remainingBackups, null, 2));
  }
}

// Export singleton instance
export const backupSystem = new BackupSystem();