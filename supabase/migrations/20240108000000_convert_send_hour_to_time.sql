-- Migration: Convert send_hour from smallint to time
-- This migration handles the conversion of existing data

-- Step 1: Add a new temporary column with time type
ALTER TABLE public.reminder_rules 
ADD COLUMN send_hour_new time;

-- Step 2: Convert existing smallint values to time
-- Assumes smallint represents hour (0-23), converts to 'HH:00:00' format
UPDATE public.reminder_rules
SET send_hour_new = (send_hour || ':00:00')::time
WHERE send_hour IS NOT NULL;

-- Step 3: Drop the old column
ALTER TABLE public.reminder_rules 
DROP COLUMN send_hour;

-- Step 4: Rename the new column
ALTER TABLE public.reminder_rules 
RENAME COLUMN send_hour_new TO send_hour;

-- Step 5: Set default value and NOT NULL constraint
ALTER TABLE public.reminder_rules 
ALTER COLUMN send_hour SET DEFAULT '09:00:00',
ALTER COLUMN send_hour SET NOT NULL;
