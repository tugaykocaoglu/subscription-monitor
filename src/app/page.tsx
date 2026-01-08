import { LandingHeader } from '@/components/layout/LandingHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-background'>
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <div className='relative overflow-hidden bg-background'>
          <div className='max-w-12xl mx-auto'>
            <div className='relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-12xl lg:w-full lg:pb-28 xl:pb-32'>
              <div className='mt-10 mx-auto max-w-12xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
                <div className='sm:text-center lg:text-center'>
                  <h1 className='text-8xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl'>
                    <span className='block xl:inline'>
                      Take control of your
                    </span>{' '}
                    <span className='block text-primary xl:inline'>
                      subscriptions
                    </span>
                  </h1>
                  <p className='mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl '>
                    Stop paying for unused services. Track all your recurring
                    payments in one place, get renewal reminders, and save
                    money.
                  </p>
                  <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-center gap-3'>
                    <Button
                      asChild
                      size='lg'
                      className='w-full sm:w-auto text-base md:text-lg h-12 px-8'
                    >
                      <Link href='/register'>Get started</Link>
                    </Button>
                    <Button
                      asChild
                      variant='secondary'
                      size='lg'
                      className='w-full sm:w-auto text-base md:text-lg h-12 px-8'
                    >
                      <Link href='/login'>Log in</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='py-12 bg-muted/50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='lg:text-center'>
              <h2 className='text-base text-primary font-semibold tracking-wide uppercase'>
                Features
              </h2>
              <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl'>
                A better way to manage recurring costs
              </p>
              <p className='mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto'>
                Simple, manual tracking without connecting your bank accounts.
                Privacy first.
              </p>
            </div>

            <div className='mt-10'>
              <dl className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
                <div className='relative'>
                  <dt>
                    <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground'>
                      <svg
                        className='h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        aria-hidden='true'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                        />
                      </svg>
                    </div>
                    <p className='ml-16 text-lg leading-6 font-medium text-foreground'>
                      Smart Reminders
                    </p>
                  </dt>
                  <dd className='mt-2 ml-16 text-base text-muted-foreground'>
                    Get notified before your subscriptions renew. Never pay for
                    an unwanted month again.
                  </dd>
                </div>

                <div className='relative'>
                  <dt>
                    <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground'>
                      <svg
                        className='h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                    </div>
                    <p className='ml-16 text-lg leading-6 font-medium text-foreground'>
                      Spend Analytics
                    </p>
                  </dt>
                  <dd className='mt-2 ml-16 text-base text-muted-foreground'>
                    See exactly how much you're spending each month, broken down
                    by category.
                  </dd>
                </div>

                <div className='relative'>
                  <dt>
                    <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground'>
                      <svg
                        className='h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                        />
                      </svg>
                    </div>
                    <p className='ml-16 text-lg leading-6 font-medium text-foreground'>
                      Privacy First
                    </p>
                  </dt>
                  <dd className='mt-2 ml-16 text-base text-muted-foreground'>
                    We don't connect to your bank or scrape your emails. Your
                    data is yours.
                  </dd>
                </div>

                <div className='relative'>
                  <dt>
                    <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground'>
                      <svg
                        className='h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                        />
                      </svg>
                    </div>
                    <p className='ml-16 text-lg leading-6 font-medium text-foreground'>
                      Multi-Currency
                    </p>
                  </dt>
                  <dd className='mt-2 ml-16 text-base text-muted-foreground'>
                    Track subscriptions in any currency. Perfect for digital
                    nomads and global services.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className='bg-background py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='sm:flex sm:flex-col sm:align-center'>
              <h1 className='text-5xl font-extrabold text-foreground sm:text-center'>
                Pricing Plans
              </h1>
              <p className='mt-5 text-xl text-muted-foreground sm:text-center'>
                Start building for free, then add a site plan to go live.
                Account plans unlock additional features.
              </p>
            </div>
            <div className='mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2'>
              {/* Basic Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg font-medium text-foreground'>
                    Basic
                  </CardTitle>
                  <CardDescription>
                    For individuals just getting started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='mt-4'>
                    <span className='text-4xl font-extrabold text-foreground'>
                      Free
                    </span>
                    <span className='text-base font-medium text-muted-foreground'>
                      /mo
                    </span>
                  </p>
                  <Button asChild className='mt-8 w-full'>
                    <Link href='/register'>Start for free</Link>
                  </Button>
                </CardContent>
                <CardFooter className='pt-6 pb-8 px-6 border-t border-border'>
                  <div className='w-full'>
                    <h3 className='text-xs font-medium text-foreground tracking-wide uppercase'>
                      What's included
                    </h3>
                    <ul role='list' className='mt-6 space-y-4'>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Track up to 5 subscriptions
                        </span>
                      </li>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Basic reminders
                        </span>
                      </li>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Manual entry
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg font-medium text-foreground'>
                    Pro
                  </CardTitle>
                  <CardDescription>
                    For power users who want full control.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='mt-4'>
                    <span className='text-4xl font-extrabold text-foreground'>
                      $5
                    </span>
                    <span className='text-base font-medium text-muted-foreground'>
                      /mo
                    </span>
                  </p>
                  <Button asChild className='mt-8 w-full'>
                    <Link href='/register?plan=pro'>Get Pro</Link>
                  </Button>
                </CardContent>
                <CardFooter className='pt-6 pb-8 px-6 border-t border-border'>
                  <div className='w-full'>
                    <h3 className='text-xs font-medium text-foreground tracking-wide uppercase'>
                      What's included
                    </h3>
                    <ul role='list' className='mt-6 space-y-4'>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Unlimited subscriptions
                        </span>
                      </li>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Advanced analytics
                        </span>
                      </li>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Priority support
                        </span>
                      </li>
                      <li className='flex space-x-3'>
                        <Check className='flex-shrink-0 h-5 w-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>
                          Email reminders
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
