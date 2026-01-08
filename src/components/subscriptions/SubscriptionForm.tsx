'use client';

import {
  createSubscription,
  updateSubscription,
} from '@/server/actions/subscriptions';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Props {
  initialData?: any;
  categories: { id: number; name: string }[];
  providers: { id: number; display_name: string }[];
  isEditing?: boolean;
}

export function SubscriptionForm({
  initialData,
  categories,
  providers,
  isEditing,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await (isEditing && initialData
      ? updateSubscription(initialData.id, formData)
      : createSubscription(formData));

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className='space-y-8'>
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='provider_id'>Provider (Optional)</Label>
          <Select
            name='provider_id'
            defaultValue={initialData?.provider_id?.toString() || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a provider' />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='custom_name'>Custom Name (if no provider)</Label>
          <Input
            type='text'
            name='custom_name'
            id='custom_name'
            defaultValue={initialData?.custom_name || ''}
          />
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='amount'>Amount</Label>
          <Input
            type='number'
            step='0.01'
            name='amount'
            id='amount'
            required
            defaultValue={initialData?.amount || ''}
          />
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='currency'>Currency (e.g. USD)</Label>
          <Input
            type='text'
            name='currency'
            id='currency'
            required
            maxLength={3}
            defaultValue={initialData?.currency || 'USD'}
            className='uppercase'
          />
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='billing_cycle'>Billing Cycle</Label>
          <Select
            name='billing_cycle'
            defaultValue={initialData?.billing_cycle || 'monthly'}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select cycle' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='weekly'>Weekly</SelectItem>
              <SelectItem value='monthly'>Monthly</SelectItem>
              <SelectItem value='quarterly'>Quarterly</SelectItem>
              <SelectItem value='yearly'>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='next_renew_at'>Next Renewal Date</Label>
          <Input
            type='date'
            name='next_renew_at'
            id='next_renew_at'
            defaultValue={
              initialData?.next_renew_at
                ? new Date(initialData.next_renew_at)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
          />
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='category_id'>Category</Label>
          <Select
            name='category_id'
            defaultValue={initialData?.category_id?.toString() || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='sm:col-span-3 space-y-2'>
          <Label htmlFor='status'>Status</Label>
          <Select name='status' defaultValue={initialData?.status || 'active'}>
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='paused'>Paused</SelectItem>
              <SelectItem value='canceled'>Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex justify-end space-x-4'>
        <Button variant='outline' asChild>
          <Link href='/subscriptions'>Cancel</Link>
        </Button>
        <Button type='submit'>{isEditing ? 'Save' : 'Create'}</Button>
      </div>
    </form>
  );
}
