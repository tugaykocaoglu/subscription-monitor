import { getSubscriptions } from '@/server/queries/subscriptions';
import Link from 'next/link';
import { DeleteSubscriptionButton } from '@/components/subscriptions/DeleteSubscriptionButton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();
  console.log('subscriptions', subscriptions);
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-xl font-semibold text-foreground'>
            Subscriptions
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            A list of all your subscriptions including their name, cost, and
            renewal date.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <Button asChild>
            <Link href='/subscriptions/new'>Add Subscription</Link>
          </Button>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Next Renewal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className='font-medium'>
                        {sub.provider?.display_name || sub.custom_name}
                      </TableCell>
                      <TableCell>
                        {sub.amount} {sub.currencyInfo?.symbol}
                      </TableCell>
                      <TableCell>{sub.billing_cycle}</TableCell>
                      <TableCell>
                        {sub.next_renew_at
                          ? new Date(sub.next_renew_at).toLocaleDateString(
                              'en-US',
                              {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button variant='ghost' asChild className='mr-2'>
                          <Link href={`/subscriptions/${sub.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <DeleteSubscriptionButton id={sub.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
