'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createReminderRule(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const daysBeforeValue = formData.get('days_before');
  const channelValue = formData.get('channel');
  const sendHourValue = formData.get('send_hour');

  if (!daysBeforeValue || !channelValue) {
    return { error: 'Missing required fields' };
  }

  const daysBefore = parseInt(daysBeforeValue.toString());
  const channel = channelValue.toString();
  const sendHour = sendHourValue ? parseInt(sendHourValue.toString()) : 9;

  const { error } = await supabase.from('reminder_rules').insert({
    user_id: user.id,
    days_before: daysBefore,
    channel,
    send_hour: sendHour,
    is_enabled: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/settings');
}

export async function updateReminderRule(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const daysBeforeValue = formData.get('days_before');
  const sendHourValue = formData.get('send_hour');
  const isEnabledValue = formData.get('is_enabled');

  const updates: any = {};
  if (daysBeforeValue)
    updates.days_before = parseInt(daysBeforeValue.toString());
  if (sendHourValue) updates.send_hour = parseInt(sendHourValue.toString());
  if (isEnabledValue !== null) updates.is_enabled = isEnabledValue === 'true';

  const { error } = await supabase
    .from('reminder_rules')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/settings');
}

export async function deleteReminderRule(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('reminder_rules')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/settings');
}
