import { createClient } from '@/lib/supabase/server';
import { getSubscriptionsDueForReminder } from '@/server/queries/reminders';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const subscriptionsToRemind = await getSubscriptionsDueForReminder();

    const results = [];

    for (const item of subscriptionsToRemind) {
      const { subscription, rule, scheduledAt } = item;

      // Create notification job
      const { data, error } = await supabase
        .from('notification_jobs')
        .insert({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          type: 'renewal_reminder',
          channel: rule.channel,
          scheduled_at: scheduledAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification job:', error);
        results.push({
          subscription_id: subscription.id,
          error: error.message,
        });
        continue;
      }

      // Here you would normally send the actual notification (email, SMS, push)
      // For now, we'll just mark it as sent and log it
      console.log(
        `[REMINDER] Subscription: ${
          subscription.provider?.display_name || subscription.custom_name
        } renews on ${subscription.next_renew_at}. Channel: ${rule.channel}`
      );

      // Update job status to sent
      await supabase
        .from('notification_jobs')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      results.push({
        subscription_id: subscription.id,
        job_id: data.id,
        status: 'sent',
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
