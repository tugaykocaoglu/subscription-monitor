-- Migration: Setup Supabase Cron for Reminders and Renewals
-- NOTE: This requires the 'pg_cron' and 'pg_net' extensions.
-- NOTE: Update 'YOUR_APP_URL' and 'YOUR_CRON_SECRET' with actual values before running in production.

-- 1. Enable Extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Schedule Reminder Job (Runs every hour at minute 0)
-- Checks if any reminders need to be sent based on user rules
select cron.schedule(
  'monitor_reminders',
  '*/5 * * * *', -- Run every 5 minutes
  $$
  select
    net.http_get(
        url:='https://track-your-subscriptions.vercel.app/api/cron/reminders',
        headers:='{"Authorization": "Bearer 642387b9ba8ad41df06c06cc39a8704f602afc02ebc329a672e278b2c33cbfe5"}'::jsonb
    ) as request_id;
  $$
);

-- 3. Schedule Renewal Job (Runs daily at 00:01 UTC)
-- Checks for expired subscriptions and rolls them over
select cron.schedule(
  'monitor_renewals',
  '1 0 * * *', -- Run at 00:01 daily
  $$
  select
    net.http_get(
        url:='https://track-your-subscriptions.vercel.app/api/cron/renewals',
        headers:='{"Authorization": "Bearer 642387b9ba8ad41df06c06cc39a8704f602afc02ebc329a672e278b2c33cbfe5"}'::jsonb
    ) as request_id;
  $$
);
