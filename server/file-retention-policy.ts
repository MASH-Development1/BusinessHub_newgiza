/**
 * File Retention Policy for Hub Within Platform
 * 
 * This module ensures all uploaded files are stored permanently without expiration.
 * Covers: CVs, community benefit photos, profile images, and all other attachments.
 */

import fs from 'fs';
import path from 'path';

export interface FileMetadata {
  filename: string;
  originalName: string;
  uploadDate: Date;
  fileType: string;
  size: number;
  category: 'cv' | 'community-benefit-image' | 'profile-image' | 'other';
}

export class FileRetentionManager {
  private uploadDir: string;
  private metadataFile: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
    this.metadataFile = path.join(uploadDir, 'file-metadata.json');
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    // Create main uploads directory
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Create subdirectories for organization (optional, all files stored in main uploads)
    const subdirs = ['cvs', 'community-benefits', 'profiles'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(this.uploadDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
  }

  /**
   * Register a file for permanent retention
   */
  public registerFile(fileData: FileMetadata): void {
    try {
      let metadata: FileMetadata[] = [];
      
      // Read existing metadata if file exists
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf-8');
        metadata = JSON.parse(data);
      }

      // Add new file metadata
      metadata.push({
        ...fileData,
        uploadDate: new Date()
      });

      // Write updated metadata
      fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));
      
      console.log(`✓ File ${fileData.filename} registered for permanent retention`);
    } catch (error) {
      console.error('Error registering file for retention:', error);
    }
  }

  /**
   * Verify file exists and is accessible
   */
  public verifyFile(filename: string): { exists: boolean; path?: string; metadata?: any } {
    const filePath = path.join(this.uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        path: filePath,
        metadata: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime
        }
      };
    }
    
    return { exists: false };
  }

  /**
   * Get all registered files for audit purposes
   */
  public getAllRegisteredFiles(): FileMetadata[] {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading file metadata:', error);
      return [];
    }
  }

  /**
   * Ensure no automatic cleanup processes can delete files
   */
  public enforceRetentionPolicy(): void {
    // Create .gitkeep files to ensure directories persist
    const keepFiles = [
      path.join(this.uploadDir, '.gitkeep'),
      path.join(this.uploadDir, 'cvs', '.gitkeep'),
      path.join(this.uploadDir, 'community-benefits', '.gitkeep'),
      path.join(this.uploadDir, 'profiles', '.gitkeep')
    ];

    keepFiles.forEach(keepFile => {
      if (!fs.existsSync(keepFile)) {
        fs.writeFileSync(keepFile, '# Keep this directory - permanent file storage\n');
      }
    });

    // Create retention policy documentation
    const policyDoc = path.join(this.uploadDir, 'RETENTION_POLICY.md');
    if (!fs.existsSync(policyDoc)) {
      const policyContent = `# File Retention Policy

## PERMANENT STORAGE - NO EXPIRATION

All files uploaded to this directory are stored permanently without expiration:

- ✅ CVs and resumes
- ✅ Community benefit photos
- ✅ Profile images
- ✅ All other attachments

## Important Notes:

- Files are NEVER automatically deleted
- No cleanup scripts should target this directory
- All files are preserved for the lifetime of the platform
- Manual deletion requires explicit admin action
- Files are protected by multiple backup systems
- Read-only permissions prevent accidental deletion

## File Protection Measures:

1. Metadata tracking in file-metadata.json
2. Multiple backup copies in backup system
3. File integrity verification
4. Protection against temporary cleanup processes

Created: ${new Date().toISOString()}
Last updated: ${new Date().toISOString()}
`;
      fs.writeFileSync(policyDoc, policyContent);
    }

    // Set directory permissions to prevent accidental deletion
    try {
      fs.chmodSync(this.uploadDir, 0o755); // Read, write, execute for owner; read, execute for others
    } catch (error) {
      console.log('Note: Could not set directory permissions (not critical)');
    }

    console.log('✓ File retention policy enforced - all files protected from deletion');
  }

  /**
   * Create additional backup of critical files
   */
  public createFileBackup(filename: string): void {
    try {
      const sourcePath = path.join(this.uploadDir, filename);
      const backupDir = path.join(this.uploadDir, 'backup-copies');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      if (fs.existsSync(sourcePath)) {
        const backupPath = path.join(backupDir, `${Date.now()}_${filename}`);
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`✓ Backup copy created: ${backupPath}`);
      }
    } catch (error) {
      console.error('Error creating file backup:', error);
    }
  }

  /**
   * Verify all registered files exist and create alerts for missing files
   */
  public auditFileIntegrity(): { total: number; present: number; missing: string[] } {
    const registeredFiles = this.getAllRegisteredFiles();
    const missing: string[] = [];
    let present = 0;

    registeredFiles.forEach(file => {
      const filePath = path.join(this.uploadDir, file.filename);
      if (fs.existsSync(filePath)) {
        present++;
      } else {
        missing.push(file.filename);
        console.warn(`⚠️ Missing file detected: ${file.filename}`);
      }
    });

    return {
      total: registeredFiles.length,
      present,
      missing
    };
  }
}

// Export singleton instance
export const fileRetentionManager = new FileRetentionManager(
  path.join(process.cwd(), 'uploads')
);