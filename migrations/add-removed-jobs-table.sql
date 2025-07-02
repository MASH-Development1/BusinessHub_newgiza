-- Migration to add removed_jobs table for soft delete functionality
CREATE TABLE IF NOT EXISTS "removed_jobs" (
  "id" serial PRIMARY KEY NOT NULL,
  "original_job_id" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "company" varchar(255) NOT NULL,
  "poster_email" varchar(255) NOT NULL,
  "poster_role" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "requirements" text,
  "skills" text,
  "industry" varchar(100),
  "experience_level" varchar(50),
  "job_type" varchar(50),
  "location" varchar(255),
  "salary_range" varchar(100),
  "contact_email" varchar(255) NOT NULL,
  "contact_phone" varchar(50) NOT NULL,
  "is_active" boolean,
  "is_approved" boolean,
  "status" varchar(20),
  "posted_by" integer,
  "original_created_at" timestamp,
  "original_updated_at" timestamp,
  "removed_at" timestamp DEFAULT now(),
  "removed_by" integer,
  "removal_reason" varchar(500)
);

-- Add foreign key constraint for removed_by
DO $$ BEGIN
 ALTER TABLE "removed_jobs" ADD CONSTRAINT "removed_jobs_removed_by_users_id_fk" FOREIGN KEY ("removed_by") references "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS "idx_removed_jobs_original_job_id" ON "removed_jobs" ("original_job_id");
CREATE INDEX IF NOT EXISTS "idx_removed_jobs_removed_at" ON "removed_jobs" ("removed_at");
