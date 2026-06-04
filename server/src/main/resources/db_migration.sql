-- Run this script manually on your production Database (e.g. Supabase console) if ddl-auto is disabled:
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);
