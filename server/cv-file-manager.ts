/**
 * CV File Management System
 * Ensures each CV record has a unique file and prevents corruption
 */

import fs from 'fs';
import path from 'path';
import { storage } from './storage';

export class CVFileManager {
  private uploadsDir: string;
  private cvDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.cvDir = path.join(this.uploadsDir, 'cvs');
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.cvDir)) {
      fs.mkdirSync(this.cvDir, { recursive: true });
    }
  }

  /**
   * Associates a CV file with a specific CV record
   */
  async assignFileToCV(cvId: number, sourceFilePath: string, originalName: string): Promise<string> {
    try {
      // Generate unique filename for this CV
      const fileExtension = path.extname(originalName);
      const uniqueFilename = `cv-${cvId}-${Date.now()}${fileExtension}`;
      const targetPath = path.join(this.cvDir, uniqueFilename);

      // Copy file to unique location
      if (fs.existsSync(sourceFilePath)) {
        fs.copyFileSync(sourceFilePath, targetPath);
        
        // Update database with unique filename
        await storage.updateCvShowcase(cvId, { 
          cvFileName: uniqueFilename 
        });

        console.log(`CV file assigned: ${uniqueFilename} for CV ID ${cvId}`);
        return uniqueFilename;
      } else {
        throw new Error(`Source file not found: ${sourceFilePath}`);
      }
    } catch (error) {
      console.error(`Error assigning file to CV ${cvId}:`, error);
      throw error;
    }
  }

  /**
   * Get the file path for a CV
   */
  getCVFilePath(filename: string): string {
    return path.join(this.cvDir, filename);
  }

  /**
   * Check if CV file exists
   */
  cvFileExists(filename: string): boolean {
    const filePath = this.getCVFilePath(filename);
    return fs.existsSync(filePath);
  }

  /**
   * Clean orphaned CV files that don't belong to any CV record
   */
  async cleanOrphanedFiles(): Promise<void> {
    try {
      const files = fs.readdirSync(this.cvDir);
      const cvRecords = await storage.getAllCvShowcase();
      const validFilenames = cvRecords
        .map(cv => cv.cvFileName)
        .filter(filename => filename !== null);

      for (const file of files) {
        if (!validFilenames.includes(file)) {
          const filePath = path.join(this.cvDir, file);
          fs.unlinkSync(filePath);
          console.log(`Removed orphaned CV file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning orphaned files:', error);
    }
  }

  /**
   * Verify CV file integrity
   */
  async verifyIntegrity(): Promise<{ valid: number; missing: number; orphaned: number }> {
    try {
      const cvRecords = await storage.getAllCvShowcase();
      const files = fs.readdirSync(this.cvDir);
      
      let valid = 0;
      let missing = 0;
      let orphaned = 0;

      // Check for missing files
      for (const cv of cvRecords) {
        if (cv.cvFileName) {
          if (this.cvFileExists(cv.cvFileName)) {
            valid++;
          } else {
            missing++;
            console.log(`Missing CV file for ${cv.name}: ${cv.cvFileName}`);
          }
        }
      }

      // Check for orphaned files
      const validFilenames = cvRecords
        .map(cv => cv.cvFileName)
        .filter(filename => filename !== null);

      for (const file of files) {
        if (!validFilenames.includes(file)) {
          orphaned++;
        }
      }

      return { valid, missing, orphaned };
    } catch (error) {
      console.error('Error verifying CV file integrity:', error);
      return { valid: 0, missing: 0, orphaned: 0 };
    }
  }
}

export const cvFileManager = new CVFileManager();