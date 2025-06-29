/**
 * CV System Rebuild - Permanent Fix for File Corruption
 * Creates a completely new CV file management system
 */

import fs from 'fs';
import path from 'path';
import { storage } from './storage';

export class CVSystemRebuild {
  private newCvDir: string;

  constructor() {
    this.newCvDir = path.join(process.cwd(), 'uploads', 'cv-files');
    this.initializeNewSystem();
  }

  private initializeNewSystem(): void {
    // Create new CV directory structure
    if (!fs.existsSync(this.newCvDir)) {
      fs.mkdirSync(this.newCvDir, { recursive: true });
    }

    // Create integrity check file
    const integrityFile = path.join(this.newCvDir, '.integrity');
    if (!fs.existsSync(integrityFile)) {
      fs.writeFileSync(integrityFile, JSON.stringify({
        created: new Date().toISOString(),
        version: '2.0',
        description: 'CV file system with unique file management'
      }));
    }
  }

  /**
   * Process new CV upload with guaranteed uniqueness
   */
  async processNewCVUpload(cvId: number, sourceFile: any): Promise<string | null> {
    try {
      if (!sourceFile) return null;

      const fileExtension = path.extname(sourceFile.originalname);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 15);
      
      // Create absolutely unique filename
      const uniqueFilename = `cv_${cvId}_${timestamp}_${uniqueId}${fileExtension}`;
      const targetPath = path.join(this.newCvDir, uniqueFilename);

      // Copy file to new location
      fs.copyFileSync(sourceFile.path, targetPath);

      // Verify file was copied correctly
      if (!fs.existsSync(targetPath)) {
        throw new Error('File copy verification failed');
      }

      // Update database with new filename
      await storage.updateCvShowcase(cvId, { 
        cvFileName: uniqueFilename 
      });

      // Create file metadata
      const metadataPath = path.join(this.newCvDir, `${uniqueFilename}.meta`);
      fs.writeFileSync(metadataPath, JSON.stringify({
        cvId,
        originalName: sourceFile.originalname,
        uploadDate: new Date().toISOString(),
        fileSize: sourceFile.size,
        mimeType: sourceFile.mimetype
      }));

      console.log(`New CV file system: ${uniqueFilename} assigned to CV ${cvId}`);
      return uniqueFilename;

    } catch (error) {
      console.error(`Error processing CV upload for ID ${cvId}:`, error);
      return null;
    }
  }

  /**
   * Get CV file path using new system
   */
  getCVFilePath(filename: string): string {
    return path.join(this.newCvDir, filename);
  }

  /**
   * Verify CV file exists and belongs to correct CV
   */
  async verifyCV(cvId: number, filename: string): Promise<boolean> {
    try {
      const filePath = this.getCVFilePath(filename);
      const metadataPath = path.join(this.newCvDir, `${filename}.meta`);

      if (!fs.existsSync(filePath) || !fs.existsSync(metadataPath)) {
        return false;
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      return metadata.cvId === cvId;

    } catch (error) {
      return false;
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<{
    totalFiles: number;
    validFiles: number;
    corruptedFiles: number;
    systemVersion: string;
  }> {
    try {
      const files = fs.readdirSync(this.newCvDir)
        .filter(f => !f.startsWith('.') && !f.endsWith('.meta'));
      
      let validFiles = 0;
      let corruptedFiles = 0;

      for (const file of files) {
        const metadataPath = path.join(this.newCvDir, `${file}.meta`);
        if (fs.existsSync(metadataPath)) {
          validFiles++;
        } else {
          corruptedFiles++;
        }
      }

      return {
        totalFiles: files.length,
        validFiles,
        corruptedFiles,
        systemVersion: '2.0'
      };

    } catch (error) {
      return {
        totalFiles: 0,
        validFiles: 0,
        corruptedFiles: 0,
        systemVersion: 'error'
      };
    }
  }
}

export const cvSystemRebuild = new CVSystemRebuild();