-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Categories Table
create table categories (
  id smallint generated always as identity primary key,
  name text not null unique,
  sort_order int not null default 0
);

-- 2. Subscription Providers Table (Catalog)
create table subscription_providers (
  id smallint generated always as identity primary key,
  key text not null unique,
  display_name text not null,
  category_id smallint references categories(id),
  website_url text,
  logo_url text,
  is_active boolean default true
);

-- 3. Subscriptions Table (Core User Data)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  provider_id smallint references subscription_providers(id),
  custom_name text,
  category_id smallint references categories(id),
  plan_name text,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null,
  billing_cycle text not null check (billing_cycle in ('weekly', 'monthly', 'quarterly', 'yearly')),
  next_renew_at timestamptz,
  status text not null default 'active' check (status in ('active', 'paused', 'canceled')),
  started_at date,
  canceled_at date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Indexes for Subscriptions
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_user_renew on subscriptions(user_id, next_renew_at) where status = 'active' and deleted_at is null;
create index idx_subscriptions_provider_id on subscriptions(provider_id);

-- 4. Reminder Rules Table
create table reminder_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  days_before int not null check (days_before >= 0),
  channel text not null check (channel in ('email', 'sms', 'push')),
  send_hour time not null default '09:00:00',
  is_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Notification Jobs Table
create table notification_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  subscription_id uuid references subscriptions(id),
  type text not null check (type in ('renewal_reminder', 'system')),
  channel text not null check (channel in ('email', 'sms', 'push')),
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'canceled')),
  attempt_count int default 0,
  last_error text,
  provider_msg_id text,
  sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (subscription_id, type, channel, scheduled_at) -- Idempotency
);

-- Indexes for Notification Jobs
create index idx_jobs_status_scheduled on notification_jobs(status, scheduled_at) where status = 'pending';
create index idx_jobs_user_created on notification_jobs(user_id, created_at desc);

-- 6. RLS Policies
alter table categories enable row level security;
alter table subscription_providers enable row level security;
alter table subscriptions enable row level security;
alter table reminder_rules enable row level security;
alter table notification_jobs enable row level security;

-- Categories & Providers: Public Read-Only (or Authenticated Read-Only)
create policy "Public read access for categories"
  on categories for select
  to authenticated
  using (true);

create policy "Public read access for providers"
  on subscription_providers for select
  to authenticated
  using (true);

-- Subscriptions: User Owned
create policy "Users can view own subscriptions"
  on subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on subscriptions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on subscriptions for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on subscriptions for delete
  to authenticated
  using (auth.uid() = user_id);

-- Reminder Rules: User Owned
create policy "Users can view own reminder rules"
  on reminder_rules for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own reminder rules"
  on reminder_rules for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reminder rules"
  on reminder_rules for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own reminder rules"
  on reminder_rules for delete
  to authenticated
  using (auth.uid() = user_id);

-- Notification Jobs: User can view, but only System (Cron) can insert/update generally
-- However, for MVP, we might allow the user to see them.
-- We'll restrict INSERT/UPDATE to service role or specific conditions if needed.
-- For now, let's assume the Cron job runs with Service Role, so it bypasses RLS.
-- We just need to let users SEE their logs if they want.

create policy "Users can view own notification jobs"
  on notification_jobs for select
  to authenticated
  using (auth.uid() = user_id);

-- Seed Data (Optional - Basic Categories)
insert into categories (name, sort_order) values
('Entertainment', 10),
('Music', 20),
('Utilities', 30),
('Productivity', 40),
('Health & Fitness', 50);
