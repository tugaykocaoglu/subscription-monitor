'use client';

import { useState, useEffect } from 'react';

import { getReminderRules } from '@/server/actions/reminders-query';
import { createReminderRule } from '@/server/actions/reminders';

import { AlertCircle } from 'lucide-react';

import { LoadingButton } from '@/components/ui/loading-button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteReminderButton } from '@/components/reminders/DeleteReminderButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    try {
      const data = await getReminderRules();
      setRules(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRule(formData: FormData) {
    setIsSubmitting(true);
    try {
      // Client-side Timezone Handling:
      // Convert the user's selected "16:40" (Local) to UTC specific timestamp
      const sendHourLocal = formData.get('send_hour') as string;

      if (sendHourLocal) {
        const [hours, minutes] = sendHourLocal.split(':').map(Number);

        // Create a date object for "today" at the specified local time
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        // Extract UTC hours/minutes
        const utcHours = date.getUTCHours().toString().padStart(2, '0');
        const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');

        // Update formData with UTC time string "13:40"
        formData.set('send_hour', `${utcHours}:${utcMinutes}`);
      }

      setError(null);
      const result = await createReminderRule(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        await loadRules();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper to convert UTC string from DB back to Local time for display
  function formatTimeFromUTC(utcTimeStr: string) {
    if (!utcTimeStr) return '';
    const [utcHours, utcMinutes] = utcTimeStr.split(':').map(Number);

    const date = new Date();
    date.setUTCHours(utcHours, utcMinutes, 0, 0);

    const localHours = date.getHours().toString().padStart(2, '0');
    const localMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${localHours}:${localMinutes}`;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Settings</h1>
        <p className='text-muted-foreground mt-2'>
          Manage your reminder preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Rules</CardTitle>
          <CardDescription>
            Set up automatic reminders before your subscriptions renew
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Spinner />
          ) : rules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Days Before</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Send Hour (Local)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className='font-medium'>
                      {rule.days_before}{' '}
                      {rule.days_before === 1 ? 'day' : 'days'}
                    </TableCell>
                    <TableCell className='capitalize'>{rule.channel}</TableCell>
                    <TableCell>{formatTimeFromUTC(rule.send_hour)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          rule.is_enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {rule.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DeleteReminderButton id={rule.id} onDelete={loadRules} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='text-muted-foreground text-center py-8'>
              No reminder rules yet. Add one below.
            </p>
          )}

          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-4'>Add New Reminder</h3>
            <form action={handleCreateRule} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='days_before'>Days Before Renewal</Label>
                  <Input
                    id='days_before'
                    name='days_before'
                    type='number'
                    min='0'
                    max='30'
                    defaultValue='3'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='channel'>Channel</Label>
                  <Select name='channel' defaultValue='email' required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='email'>Email</SelectItem>
                      <SelectItem value='sms'>SMS</SelectItem>
                      <SelectItem value='push'>Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='send_hour'>Send Time</Label>
                  <Input
                    id='send_hour'
                    name='send_hour'
                    type='time'
                    defaultValue='09:00'
                    required
                  />
                </div>
              </div>
              <LoadingButton type='submit' isLoading={isSubmitting}>
                Add Reminder Rule
              </LoadingButton>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
