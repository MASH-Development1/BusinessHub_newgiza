/**
 * CV File Validation System
 * Prevents duplicate files and ensures data integrity
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class CVValidator {
  private uploadsDir: string;
  private fileHashes: Map<string, number> = new Map(); // hash -> cvId

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
  }

  /**
   * Generate file hash to detect duplicates
   */
  private generateFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  /**
   * Validate CV file upload
   */
  async validateCVUpload(filePath: string, cvId: number): Promise<{ valid: boolean; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { valid: false, error: 'File does not exist' };
      }

      // Check file size (max 10MB)
      const stats = fs.statSync(filePath);
      if (stats.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds 10MB limit' };
      }

      // Generate hash to check for duplicates
      const fileHash = this.generateFileHash(filePath);
      
      // Check if this exact file is already associated with another CV
      const existingCvId = this.fileHashes.get(fileHash);
      if (existingCvId && existingCvId !== cvId) {
        return { 
          valid: false, 
          error: `This file is already uploaded for another CV (ID: ${existingCvId})` 
        };
      }

      // Register this file hash with the CV ID
      this.fileHashes.set(fileHash, cvId);

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'File validation failed' };
    }
  }

  /**
   * Clean up file hash registry when CV is deleted
   */
  removeCVFromRegistry(cvId: number): void {
    for (const [hash, id] of this.fileHashes.entries()) {
      if (id === cvId) {
        this.fileHashes.delete(hash);
        break;
      }
    }
  }

  /**
   * Initialize hash registry from existing files
   */
  async initializeRegistry(): Promise<void> {
    // This would scan existing CV files and build the hash registry
    // Implementation depends on your current file structure
  }
}

export const cvValidator = new CVValidator();