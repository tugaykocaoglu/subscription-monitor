-- Migration: Remove unique constraint from reminder_rules
-- This allows users to create multiple rules for the same day and channel

ALTER TABLE public.reminder_rules 
DROP CONSTRAINT IF EXISTS reminder_rules_user_id_days_before_channel_key;
