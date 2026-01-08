import { createClient } from '@/lib/supabase/server';

export async function getSubscriptionsToRollover() {
  const supabase = await createClient();
  const now = new Date();

  // Get active subscriptions where next_renew_at is in the past
  // We check for subscriptions older than "now" but maybe we want a grace period?
  // Let's just say anything strictly less than now needs rollover.
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      id,
      user_id,
      custom_name,
      provider:subscription_providers(display_name),
      amount,
      currency,
      billing_cycle,
      next_renew_at,
      profile:profiles(email)
    `
    )
    .eq('status', 'active')
    .lt('next_renew_at', now.toISOString())
    .is('deleted_at', null);

  if (error) throw error;
  return data || [];
}

export function calculateNextRenewal(currentDate: Date, cycle: string): Date {
  const nextDate = new Date(currentDate);

  switch (cycle) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      // Handle edge cases like Jan 31 -> Feb 28
      const currentDay = nextDate.getDate();
      nextDate.setMonth(nextDate.getMonth() + 1);
      if (nextDate.getDate() !== currentDay) {
        // If dates don't match (e.g. leap year or short month), set to last day of month
        nextDate.setDate(0);
      }
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}
