import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export function LandingHeader() {
  return (
    <header className=' shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold text-primary'>
              SubMonitor
            </Link>
          </div>
          <div className='flex space-x-4 items-center'>
            <ModeToggle />
            <Button variant='ghost' asChild>
              <Link href='/login'>Log in</Link>
            </Button>
            <Button asChild>
              <Link href='/subscriptions'>Subscriptions</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
