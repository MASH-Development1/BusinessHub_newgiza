/**
 * Force Delete Solution - Bypasses all ORM and connection pooling
 */

import { Pool } from '@neondatabase/serverless';

export class ForceDelete {
  private createDirectConnection() {
    return new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000
    });
  }

  async forceDeleteUser(userId: number): Promise<boolean> {
    const pool = this.createDirectConnection();
    const client = await pool.connect();
    
    try {
      // First, disable any triggers or constraints temporarily
      await client.query('SET session_replication_role = replica');
      
      // Force delete with immediate commit
      await client.query('BEGIN');
      const result = await client.query(
        'DELETE FROM email_whitelist WHERE id = $1',
        [userId]
      );
      await client.query('COMMIT');
      
      // Re-enable triggers
      await client.query('SET session_replication_role = DEFAULT');
      
      // Force vacuum to ensure deletion is persisted
      await client.query('VACUUM email_whitelist');
      
      return result.rowCount > 0;
      
    } catch (error) {
      await client.query('ROLLBACK');
      await client.query('SET session_replication_role = DEFAULT');
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
  }

  async verifyDeletion(userId: number): Promise<boolean> {
    const pool = this.createDirectConnection();
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT COUNT(*) as count FROM email_whitelist WHERE id = $1',
        [userId]
      );
      return parseInt(result.rows[0].count) === 0;
    } finally {
      client.release();
      await pool.end();
    }
  }
}

export const forceDelete = new ForceDelete();