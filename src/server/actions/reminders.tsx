'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { RuleCreatedEmail } from '@/components/emails/RuleCreatedEmail';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const sendHour = sendHourValue ? sendHourValue.toString() : '09:00:00';

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

  const html = await render(
    <RuleCreatedEmail
      daysBefore={daysBefore}
      channel={channel}
      sendHour={sendHour}
    />
  );

  // Send confirmation email if channel is email
  if (channel === 'email' && user.email) {
    try {
      await resend.emails.send({
        from: 'SubMonitor <noreply@submonitor.com>',
        to: [user.email],
        subject: 'New Reminder Rule Created',
        html: html,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // We don't return error here because the rule was successfully created
    }
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
  if (sendHourValue) updates.send_hour = sendHourValue.toString();
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
