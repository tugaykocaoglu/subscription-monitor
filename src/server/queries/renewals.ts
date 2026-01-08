import { createClient } from '@/lib/supabase/server';

export async function getSubscriptionsToRollover(supabaseClient?: any) {
  const supabase = supabaseClient || (await createClient());
  const now = new Date();

  // Get active subscriptions where next_renew_at is in the past
  // We check for subscriptions older than "now" but maybe we want a grace period?
  // Let's just say anything strictly less than now needs rollover.
  // 1. Fetch expired subscriptions (without joining profiles yet)
  const { data: subscriptions, error } = await supabase
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
      next_renew_at
    `
    )
    .eq('status', 'active')
    .lt('next_renew_at', now.toISOString())
    .is('deleted_at', null);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] Checking for rollovers. Now: ${now.toISOString()}`);
    if (subscriptions && subscriptions.length > 0) {
      console.log(
        `[DEBUG] Found older subscriptions:`,
        subscriptions.map((s: any) => `${s.custom_name} (${s.next_renew_at})`)
      );
    } else {
      console.log('[DEBUG] No expired subscriptions found.');
    }
  }

  if (error) throw error;
  if (!subscriptions || subscriptions.length === 0) return [];

  // 2. Fetch profiles to get emails
  // Since we don't have a direct FK for PostgREST embedding, we manual join
  const userIds = Array.from(new Set(subscriptions.map((s: any) => s.user_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map((p: any) => [p.id, p.email]));

  return subscriptions.map((sub: any) => ({
    ...sub,
    profile: { email: profileMap.get(sub.user_id) },
  }));
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
