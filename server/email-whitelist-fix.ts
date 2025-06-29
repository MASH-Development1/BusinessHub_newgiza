/**
 * Email Whitelist Fix - Complete table recreation
 * This creates a new table and migrates data to fix deletion issues
 */

import { db, pool } from "./db";

export class EmailWhitelistFix {
  async recreateTable() {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create new table with identical structure
      await client.query(`
        CREATE TABLE IF NOT EXISTS email_whitelist_new (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          unit VARCHAR(255),
          phone VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          added_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Copy all data except the problematic records
      await client.query(`
        INSERT INTO email_whitelist_new (email, name, unit, phone, is_active, added_by, created_at, updated_at)
        SELECT email, name, unit, phone, is_active, added_by, created_at, updated_at 
        FROM email_whitelist 
        WHERE id NOT IN (94, 95)
      `);
      
      // Drop old table and rename new one
      await client.query('DROP TABLE email_whitelist');
      await client.query('ALTER TABLE email_whitelist_new RENAME TO email_whitelist');
      
      await client.query('COMMIT');
      console.log('Email whitelist table recreated successfully');
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to recreate table:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  async testDeletion(email: string) {
    const client = await pool.connect();
    
    try {
      // Insert test record
      const insertResult = await client.query(
        'INSERT INTO email_whitelist (email, name) VALUES ($1, $2) RETURNING id',
        [email, 'Test User']
      );
      const testId = insertResult.rows[0].id;
      
      // Delete test record
      const deleteResult = await client.query(
        'DELETE FROM email_whitelist WHERE id = $1',
        [testId]
      );
      
      return deleteResult.rowCount > 0;
    } finally {
      client.release();
    }
  }
}

export const emailWhitelistFix = new EmailWhitelistFix();