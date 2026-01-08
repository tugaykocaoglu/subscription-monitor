'use client';

import { login } from '@/server/actions/auth';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <Card>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>Sign in</CardTitle>
          <CardDescription className='text-center'>
            Or{' '}
            <Link href='/register' className='text-primary hover:underline'>
              start your 14-day free trial
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email address</Label>
              <Input id='email' name='email' type='email' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Spinner className='mr-2 h-4 w-4' />}
              Sign in {isLoading.toString()}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
