import { createClient } from '@/lib/supabase/server';

export async function getReminderRules() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reminder_rules')
    .select('*')
    .order('days_before', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSubscriptionsDueForReminder(supabaseClient?: any) {
  const supabase = supabaseClient || (await createClient());

  // Get all active subscriptions with their reminder rules
  // 1. Get all active subscriptions
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select(
      `
      id,
      user_id,
      provider:subscription_providers(display_name),
      custom_name,
      amount,
      currency,
      next_renew_at
    `
    )
    .eq('status', 'active')
    .not('next_renew_at', 'is', null)
    .is('deleted_at', null);

  if (error) throw error;
  if (!subscriptions) return [];

  // 2. Manual join profiles for emails
  const userIds = Array.from(new Set(subscriptions.map((s: any) => s.user_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map((p: any) => [p.id, p.email]));

  const data = subscriptions.map((sub: any) => ({
    ...sub,
    profile: { email: profileMap.get(sub.user_id) },
  }));

  // Get all enabled reminder rules
  const { data: rules } = await supabase
    .from('reminder_rules')
    .select('*')
    .eq('is_enabled', true);

  if (!rules || !data) return [];

  const now = new Date();
  console.log('--- DEBUG START ---');
  console.log('Now (Server UTC):', now.toISOString());
  console.log('Rules Raw:', JSON.stringify(rules, null, 2));
  console.log(
    'Subscriptions Raw:',
    JSON.stringify(
      data.map((s: any) => ({
        id: s.id,
        name: s.custom_name,
        next_renew_at: s.next_renew_at,
        user_id: s.user_id,
      })),
      null,
      2
    )
  );
  console.log('--- DEBUG END ---');

  const subscriptionsNeedingReminders: any[] = [];

  console.log(
    `[DEBUG] Checking ${data.length} subscriptions against ${rules.length} rules`
  );

  for (const sub of data) {
    if (!sub.next_renew_at) continue;

    // Ensure we work with a Date object
    const renewDate = new Date(sub.next_renew_at);

    for (const rule of rules) {
      if (rule.user_id !== sub.user_id) continue;

      // Calculate reminder date
      const reminderDate = new Date(renewDate);
      reminderDate.setDate(reminderDate.getDate() - rule.days_before);

      // Parse time string carefully (e.g., "09:00:00" or "09:00")
      const timeParts = rule.send_hour.toString().split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      // Treat input as UTC directly (Server Time)
      // User must input time in UTC.
      reminderDate.setHours(hours, minutes, 0, 0);

      // Define the "Due Window"
      // A reminder is due if current time is AFTER reminderDate
      // AND current time is NOT MORE THAN 24 hours after reminderDate (to avoid sending old reminders)
      const windowStart = reminderDate.getTime();
      const windowEnd = windowStart + 24 * 60 * 60 * 1000; // 24 hours window
      const nowTime = now.getTime();

      const isDue = nowTime >= windowStart && nowTime < windowEnd;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEBUG] Sub: ${sub.custom_name || sub.id} 
         - Renew: ${renewDate.toISOString()}
         - Rule: ${rule.days_before} days before @ ${rule.send_hour}
         - Reminder Target: ${reminderDate.toISOString()}
         - Now: ${now.toISOString()}
         - Is Due? ${isDue}`);
      }

      if (isDue) {
        // Check idempotency: Have we sent this SPECIFIC reminder type for this SPECIFIC renewal date?
        // We use a window check on scheduled_at to ensure we don't send duplicates for the same cycle.
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] Checking previous job for sub ${sub.id} 
             - Type: renewal_reminder
             - Channel: ${rule.channel}
             - ScheduledAt: ${reminderDate.toISOString()}
           `);

          // DEEP DEBUG: Fetch ALL jobs for this subscription
          const { data: allJobs } = await supabase
            .from('notification_jobs')
            .select('*')
            .eq('subscription_id', sub.id);
          console.log(`[DEBUG] ALL jobs for sub ${sub.id}:`, allJobs);
        }

        const { data: existingJobs, error: jobCheckError } = await supabase
          .from('notification_jobs')
          .select('id, status, scheduled_at')
          .eq('subscription_id', sub.id)
          .eq('type', 'renewal_reminder')
          .eq('channel', rule.channel)
          // STRICT IDEMPOTENCY: Check for exact scheduled time.
          // This allows multiple rules (e.g. 3 days before vs 1 day before) to coexist
          // as long as they have different target times.
          .eq('scheduled_at', reminderDate.toISOString())
          .limit(1);

        if (process.env.NODE_ENV === 'development') {
          if (jobCheckError) {
            console.error(`[DEBUG] Job check error:`, jobCheckError);
          }
          if (existingJobs && existingJobs.length > 0) {
            console.log(`[DEBUG] Found existing job:`, existingJobs[0]);
          } else {
            console.log(`[DEBUG] No existing job found`);
          }
        }

        if (!existingJobs || existingJobs.length === 0) {
          console.log(`[DEBUG] -> Queuing reminder for ${sub.id}`);
          subscriptionsNeedingReminders.push({
            subscription: sub,
            rule,
            scheduledAt: reminderDate,
          });
        }
      }
    }
  }

  return subscriptionsNeedingReminders;
}
