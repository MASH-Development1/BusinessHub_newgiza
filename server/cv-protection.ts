/**
 * CV File Protection System
 * Prevents recurring data loss by implementing multiple protection layers
 */

import fs from 'fs';
import path from 'path';
import { fileRetentionManager } from './file-retention-policy';

export class CVProtectionSystem {
  private uploadsDir: string;
  private protectedDir: string;
  private backupDir: string;
  private protectionLog: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.protectedDir = path.join(process.cwd(), 'protected-cvs');
    this.backupDir = path.join(process.cwd(), 'cv-backups');
    this.protectionLog = path.join(process.cwd(), 'cv-protection.log');
    this.initializeProtection();
  }

  private initializeProtection(): void {
    // Create protected directories
    [this.protectedDir, this.backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create protection manifest
    const manifestPath = path.join(this.protectedDir, 'PROTECTION_MANIFEST.json');
    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, JSON.stringify({
        created: new Date().toISOString(),
        purpose: 'This directory contains permanently protected CV files',
        warning: 'DO NOT DELETE - Contains critical user data',
        backupCount: 0
      }, null, 2));
    }

    this.logProtection('CV Protection System initialized');
  }

  private logProtection(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.protectionLog, logEntry);
    console.log(`CV Protection: ${message}`);
  }

  /**
   * Create multiple protected copies of a CV file
   */
  async protectCVFile(originalPath: string, cvId: number, userEmail: string): Promise<string[]> {
    const protectedPaths: string[] = [];
    const filename = path.basename(originalPath);
    const timestamp = Date.now();
    
    try {
      // Copy 1: Protected directory with CV ID
      const protectedPath1 = path.join(this.protectedDir, `cv-${cvId}-${timestamp}-${filename}`);
      fs.copyFileSync(originalPath, protectedPath1);
      protectedPaths.push(protectedPath1);

      // Copy 2: Backup directory with email identifier
      const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
      const protectedPath2 = path.join(this.backupDir, `${safeEmail}-cv-${cvId}-${filename}`);
      fs.copyFileSync(originalPath, protectedPath2);
      protectedPaths.push(protectedPath2);

      // Copy 3: Versioned backup
      const versionedPath = path.join(this.backupDir, 'versions', `cv-${cvId}-v${timestamp}-${filename}`);
      const versionDir = path.dirname(versionedPath);
      if (!fs.existsSync(versionDir)) {
        fs.mkdirSync(versionDir, { recursive: true });
      }
      fs.copyFileSync(originalPath, versionedPath);
      protectedPaths.push(versionedPath);

      // Update protection manifest
      this.updateProtectionManifest(cvId, userEmail, filename, protectedPaths);

      this.logProtection(`Protected CV file for user ${userEmail} (ID: ${cvId}) - ${protectedPaths.length} copies created`);
      return protectedPaths;

    } catch (error) {
      this.logProtection(`ERROR protecting CV file: ${error}`);
      throw error;
    }
  }

  private updateProtectionManifest(cvId: number, userEmail: string, filename: string, protectedPaths: string[]): void {
    const manifestPath = path.join(this.protectedDir, 'PROTECTION_MANIFEST.json');
    let manifest: any = {};
    
    try {
      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      }
    } catch (error) {
      this.logProtection(`Warning: Could not read protection manifest: ${error}`);
    }

    if (!manifest.protectedFiles) {
      manifest.protectedFiles = {};
    }

    manifest.protectedFiles[cvId] = {
      userEmail,
      originalFilename: filename,
      protectedPaths,
      protectedAt: new Date().toISOString(),
      status: 'protected'
    };

    manifest.lastUpdated = new Date().toISOString();
    manifest.totalProtected = Object.keys(manifest.protectedFiles).length;

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  /**
   * Restore CV file from protected copies
   */
  async restoreCVFile(cvId: number): Promise<string | null> {
    const manifestPath = path.join(this.protectedDir, 'PROTECTION_MANIFEST.json');
    
    try {
      if (!fs.existsSync(manifestPath)) {
        this.logProtection(`No protection manifest found for CV restoration`);
        return null;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const protectedFile = manifest.protectedFiles?.[cvId];

      if (!protectedFile) {
        this.logProtection(`No protected copies found for CV ID: ${cvId}`);
        return null;
      }

      // Try to restore from any available protected copy
      for (const protectedPath of protectedFile.protectedPaths) {
        if (fs.existsSync(protectedPath)) {
          const originalFilename = `cv-${Date.now()}-restored.${protectedFile.originalFilename.split('.').pop()}`;
          const restoredPath = path.join(this.uploadsDir, originalFilename);
          
          fs.copyFileSync(protectedPath, restoredPath);
          
          this.logProtection(`Successfully restored CV ID: ${cvId} from ${protectedPath} to ${restoredPath}`);
          return originalFilename;
        }
      }

      this.logProtection(`All protected copies missing for CV ID: ${cvId}`);
      return null;

    } catch (error) {
      this.logProtection(`ERROR restoring CV file: ${error}`);
      return null;
    }
  }

  /**
   * Verify integrity of all protected CV files
   */
  async verifyProtectedFiles(): Promise<{ verified: number; missing: number; corrupted: number }> {
    const manifestPath = path.join(this.protectedDir, 'PROTECTION_MANIFEST.json');
    const result = { verified: 0, missing: 0, corrupted: 0 };

    try {
      if (!fs.existsSync(manifestPath)) {
        return result;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const protectedFiles = manifest.protectedFiles || {};

      for (const [cvId, fileInfo] of Object.entries(protectedFiles)) {
        const info = fileInfo as any;
        let hasValidCopy = false;

        for (const protectedPath of info.protectedPaths) {
          try {
            if (fs.existsSync(protectedPath)) {
              const stats = fs.statSync(protectedPath);
              if (stats.size > 0) {
                hasValidCopy = true;
                break;
              }
            }
          } catch (error) {
            // File is corrupted or inaccessible
          }
        }

        if (hasValidCopy) {
          result.verified++;
        } else {
          result.missing++;
        }
      }

      this.logProtection(`Protection verification: ${result.verified} verified, ${result.missing} missing`);
      return result;

    } catch (error) {
      this.logProtection(`ERROR during protection verification: ${error}`);
      return result;
    }
  }

  /**
   * Create emergency backup of all current CV files
   */
  async createEmergencyBackup(): Promise<void> {
    const emergencyDir = path.join(this.backupDir, 'emergency', Date.now().toString());
    fs.mkdirSync(emergencyDir, { recursive: true });

    try {
      const cvFiles = fs.readdirSync(this.uploadsDir).filter(file => file.startsWith('cv-'));
      
      for (const file of cvFiles) {
        const sourcePath = path.join(this.uploadsDir, file);
        const destPath = path.join(emergencyDir, file);
        fs.copyFileSync(sourcePath, destPath);
      }

      // Create backup manifest
      const backupManifest = {
        createdAt: new Date().toISOString(),
        filesBackedUp: cvFiles.length,
        files: cvFiles,
        purpose: 'Emergency backup before system changes'
      };

      fs.writeFileSync(
        path.join(emergencyDir, 'BACKUP_MANIFEST.json'),
        JSON.stringify(backupManifest, null, 2)
      );

      this.logProtection(`Emergency backup created: ${cvFiles.length} files backed up to ${emergencyDir}`);

    } catch (error) {
      this.logProtection(`ERROR creating emergency backup: ${error}`);
      throw error;
    }
  }

  /**
   * Schedule automatic protection checks
   */
  startAutomaticProtection(): void {
    // Check every 10 minutes
    setInterval(async () => {
      await this.verifyProtectedFiles();
    }, 10 * 60 * 1000);

    // Create emergency backup every hour
    setInterval(async () => {
      await this.createEmergencyBackup();
    }, 60 * 60 * 1000);

    this.logProtection('Automatic protection monitoring started');
  }
}

export const cvProtection = new CVProtectionSystem();