'use client';

import Link from 'next/link';
import { logout } from '@/server/actions/auth';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export function TopNav() {
  return (
    <nav className='bg-background shadow'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                href='/dashboard'
                className='text-xl font-bold text-primary'
              >
                SubMonitor
              </Link>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <Button variant='ghost' asChild>
                <Link href='/dashboard'>Dashboard</Link>
              </Button>
              <Button variant='ghost' asChild>
                <Link href='/subscriptions'>Subscriptions</Link>
              </Button>
              <Button variant='ghost' asChild>
                <Link href='/settings'>Settings</Link>
              </Button>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <ModeToggle />
            <Button onClick={() => logout()}>Sign out</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
