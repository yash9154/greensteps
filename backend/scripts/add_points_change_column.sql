-- Migration: add canonical points_change column to points_history and copy data from existing columns if present
-- Run this against the `greensteps` database.

-- 1) Add column if not exists (MySQL 8+ supports IF NOT EXISTS)
ALTER TABLE points_history
  ADD COLUMN IF NOT EXISTS points_change INT DEFAULT 0;

-- 2) If an existing column named `change` exists, copy values into points_change for rows where points_change is 0
-- (backticks used because `change` is a reserved word)
UPDATE points_history
SET points_change = `change`
WHERE points_change = 0 AND `change` IS NOT NULL;

-- 3) If an existing column named `points` exists, copy values into points_change for rows where points_change is 0
UPDATE points_history
SET points_change = points
WHERE points_change = 0 AND points IS NOT NULL;

-- 4) Optional: verify
SELECT * FROM points_history ORDER BY created_at DESC LIMIT 20;
