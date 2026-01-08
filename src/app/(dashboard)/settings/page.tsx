'use client';

import { useState, useEffect } from 'react';
import { getReminderRules } from '@/server/actions/reminders-query';
import { createReminderRule } from '@/server/actions/reminders';
import { Button } from '@/components/ui/button';
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
import { AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    setError(null);
    const result = await createReminderRule(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      await loadRules();
    }
  }

  if (loading) {
    return <div>Loading...</div>;
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

          {rules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Days Before</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Send Hour</TableHead>
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
                    <TableCell>{rule.send_hour}:00</TableCell>
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
                  <Label htmlFor='send_hour'>Send Hour (24h)</Label>
                  <Input
                    id='send_hour'
                    name='send_hour'
                    type='number'
                    min='0'
                    max='23'
                    defaultValue='9'
                    required
                  />
                </div>
              </div>
              <Button type='submit'>Add Reminder Rule</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
