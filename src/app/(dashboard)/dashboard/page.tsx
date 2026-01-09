import { getDashboardStats } from '@/server/queries/dashboard';
import { formatCurrency, getDaysUntil } from '@/lib/utils/currency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreditCard, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ... imports ...

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  console.log('stats', stats);
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
          <p className='text-muted-foreground mt-2'>
            Overview of your subscriptions
          </p>
        </div>
        <Button asChild>
          <Link href='/subscriptions/new'>Add Subscription</Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Subscriptions
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalSubscriptions}</div>
            <p className='text-xs text-muted-foreground'>
              Active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Monthly Cost</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {Object.entries(stats.monthlyTotal).length > 0 ? (
              <div className='space-y-1'>
                {Object.entries(stats.monthlyTotal).map(
                  ([currency, amount]) => (
                    <div key={currency} className='text-xl font-bold'>
                      {formatCurrency(amount, currency)}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className='text-2xl font-bold'>
                {formatCurrency(0, 'USD')}
              </div>
            )}
            <p className='text-xs text-muted-foreground mt-2'>
              Normalized monthly spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Next Renewal</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.nextRenewal
                ? `${getDaysUntil(stats.nextRenewal)} days`
                : 'N/A'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.nextRenewal
                ? new Date(stats.nextRenewal).toLocaleDateString()
                : 'No upcoming renewals'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Yearly Cost</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {Object.entries(stats.monthlyTotal).length > 0 ? (
              <div className='space-y-1'>
                {Object.entries(stats.monthlyTotal).map(
                  ([currency, amount]) => (
                    <div key={currency} className='text-xl font-bold'>
                      {formatCurrency(amount * 12, currency)}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className='text-2xl font-bold'>
                {formatCurrency(0, 'USD')}
              </div>
            )}
            <p className='text-xs text-muted-foreground mt-2'>
              Projected annual spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Renewals */}
      {stats.upcomingRenewals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
            <CardDescription>
              Subscriptions renewing in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Renewal Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className='text-right'>Days Until</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.upcomingRenewals.map((sub: any) => {
                  const daysUntil = getDaysUntil(sub.next_renew_at);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className='font-medium'>
                        {sub.provider?.display_name || sub.custom_name}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {sub.categories?.name}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.next_renew_at).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(sub.amount, sub.currency)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            daysUntil <= 7
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Spending by Category */}
      {Object.keys(stats.spendingByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Monthly spending breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {Object.entries(stats.spendingByCategory)
                .map(([category, currencies]) => {
                  // Calculate total USD equivalent or just sort by category name?
                  // For now, let's just render.
                  return { category, currencies };
                })
                .sort((a, b) => a.category.localeCompare(b.category))
                .map(({ category, currencies }) => {
                  return (
                    <div key={category} className='space-y-2'>
                      <h4 className='text-sm font-medium border-b pb-1 mb-2'>
                        {category}
                      </h4>
                      {Object.entries(currencies).map(([currency, amount]) => {
                        // Calculate percentage relative to that currency's total
                        const totalForCurrency =
                          stats.monthlyTotal[currency] || 0;
                        const percentage =
                          totalForCurrency > 0
                            ? (
                                ((amount as number) / totalForCurrency) *
                                100
                              ).toFixed(1)
                            : '0';

                        return (
                          <div key={currency} className='space-y-1'>
                            <div className='flex items-center justify-between text-xs text-muted-foreground'>
                              <span>{currency}</span>
                              <span>
                                {formatCurrency(amount as number, currency)} (
                                {percentage}%)
                              </span>
                            </div>
                            <div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
                              <div
                                className='h-full bg-primary'
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalSubscriptions === 0 && (
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-12'>
              <CreditCard className='mx-auto h-12 w-12 text-muted-foreground' />
              <h3 className='mt-4 text-lg font-semibold'>
                No subscriptions yet
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Get started by adding your first subscription
              </p>
              <Button asChild className='mt-4'>
                <Link href='/subscriptions/new'>Add Subscription</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
