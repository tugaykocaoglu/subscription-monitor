export function normalizeToMonthly(amount: number, cycle: string): number {
  const multipliers: Record<string, number> = {
    weekly: 4.33, // Average weeks per month
    monthly: 1,
    quarterly: 1 / 3,
    yearly: 1 / 12,
  };

  return amount * (multipliers[cycle] || 1);
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getDaysUntil(date: string | Date): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
