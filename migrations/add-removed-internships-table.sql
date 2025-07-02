-- Migration: Add removed_internships table for soft delete functionality
-- Created: 2025-01-02

CREATE TABLE IF NOT EXISTS removed_internships (
    id SERIAL PRIMARY KEY,
    original_internship_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    poster_email VARCHAR(255) NOT NULL,
    poster_role VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    skills TEXT,
    department VARCHAR(100),
    duration VARCHAR(50) NOT NULL,
    is_paid BOOLEAN,
    stipend VARCHAR(100),
    location VARCHAR(255),
    positions INTEGER,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    start_date VARCHAR(100),
    application_deadline VARCHAR(100),
    is_active BOOLEAN,
    is_approved BOOLEAN,
    status VARCHAR(20),
    posted_by INTEGER,
    original_created_at TIMESTAMP,
    original_updated_at TIMESTAMP,
    removed_at TIMESTAMP DEFAULT NOW(),
    removed_by INTEGER REFERENCES users(id),
    removal_reason VARCHAR(500)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_removed_internships_original_id ON removed_internships(original_internship_id);
CREATE INDEX IF NOT EXISTS idx_removed_internships_removed_at ON removed_internships(removed_at);
CREATE INDEX IF NOT EXISTS idx_removed_internships_removed_by ON removed_internships(removed_by);
