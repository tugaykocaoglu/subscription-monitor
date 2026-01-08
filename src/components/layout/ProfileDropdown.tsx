'use client';

import { logout } from '@/server/actions/logout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProfileDropdownProps {
  userEmail: string;
}

export function ProfileDropdown({ userEmail }: ProfileDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
  }

  const initials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>My Account</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard' className='cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/subscriptions' className='cursor-pointer'>
            <CreditCard className='mr-2 h-4 w-4' />
            Subscriptions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings' className='cursor-pointer'>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className='cursor-pointer text-red-600 focus:text-red-600'
        >
          <LogOut className='mr-2 h-4 w-4' />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
