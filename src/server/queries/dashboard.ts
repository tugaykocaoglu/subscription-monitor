import { createClient } from '@/lib/supabase/server';
import { normalizeToMonthly } from '@/lib/utils/currency';

export async function getDashboardStats() {
  const supabase = await createClient();

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select(
      `
      id,
      amount,
      currency,
      billing_cycle,
      next_renew_at,
      status,
      category_id,
      provider:subscription_providers(display_name),
      custom_name,
      categories(name)
    `
    )
    .eq('status', 'active')
    .is('deleted_at', null);

  if (error) throw error;

  if (!subscriptions || subscriptions.length === 0) {
    return {
      totalSubscriptions: 0,
      monthlyTotal: {} as Record<string, number>,
      upcomingRenewals: [],
      spendingByCategory: {} as Record<string, Record<string, number>>,
      nextRenewal: null,
    };
  }

  // Calculate total monthly spending by currency
  const monthlyTotal: Record<string, number> = {};

  subscriptions.forEach((sub: any) => {
    const currency = sub.currency || 'USD';
    const monthly = normalizeToMonthly(sub.amount, sub.billing_cycle);
    monthlyTotal[currency] = (monthlyTotal[currency] || 0) + monthly;
  });

  // Get upcoming renewals (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const upcomingRenewals = subscriptions
    .filter((sub: any) => {
      if (!sub.next_renew_at) return false;
      const renewDate = new Date(sub.next_renew_at);
      return renewDate <= thirtyDaysFromNow && renewDate >= new Date();
    })
    .sort((a: any, b: any) => {
      return (
        new Date(a.next_renew_at!).getTime() -
        new Date(b.next_renew_at!).getTime()
      );
    })
    .slice(0, 5); // Top 5 upcoming

  // Spending by category and currency
  const spendingByCategory: Record<string, Record<string, number>> = {};

  subscriptions.forEach((sub: any) => {
    const categoryName = sub.categories?.name || 'Uncategorized';
    const currency = sub.currency || 'USD';
    const monthly = normalizeToMonthly(sub.amount, sub.billing_cycle);

    if (!spendingByCategory[categoryName]) {
      spendingByCategory[categoryName] = {};
    }

    spendingByCategory[categoryName][currency] =
      (spendingByCategory[categoryName][currency] || 0) + monthly;
  });

  // Next renewal date
  const nextRenewal = upcomingRenewals[0]?.next_renew_at || null;

  return {
    totalSubscriptions: subscriptions.length,
    monthlyTotal,
    upcomingRenewals,
    spendingByCategory,
    nextRenewal,
  };
}
