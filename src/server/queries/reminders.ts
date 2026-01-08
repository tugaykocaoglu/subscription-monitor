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

export async function getSubscriptionsDueForReminder() {
  const supabase = await createClient();

  // Get all active subscriptions with their reminder rules
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      id,
      user_id,
      provider:subscription_providers(display_name),
      custom_name,
      amount,
      currency,
      next_renew_at,
      profile:profiles(email)
    `
    )
    .eq('status', 'active')
    .not('next_renew_at', 'is', null)
    .is('deleted_at', null);

  if (error) throw error;

  // Get all enabled reminder rules
  const { data: rules } = await supabase
    .from('reminder_rules')
    .select('*')
    .eq('is_enabled', true);

  if (!rules || !data) return [];

  const now = new Date();
  const subscriptionsNeedingReminders: any[] = [];

  for (const sub of data) {
    const renewDate = new Date(sub.next_renew_at);

    for (const rule of rules) {
      if (rule.user_id !== sub.user_id) continue;

      const reminderDate = new Date(renewDate);
      reminderDate.setDate(reminderDate.getDate() - rule.days_before);

      // Parse time string (e.g., "09:00:00" or "09:00")
      const [hours, minutes] = rule.send_hour.split(':').map(Number);
      reminderDate.setHours(hours || 9, minutes || 0, 0, 0);

      // Check if we should send reminder now
      if (
        reminderDate <= now &&
        reminderDate > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      ) {
        // Check if notification job already exists
        const { data: existingJob } = await supabase
          .from('notification_jobs')
          .select('id')
          .eq('subscription_id', sub.id)
          .eq('type', 'renewal_reminder')
          .eq('channel', rule.channel)
          .gte(
            'scheduled_at',
            new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
          )
          .single();

        if (!existingJob) {
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
