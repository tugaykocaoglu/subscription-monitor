import { createAdminClient } from '@/lib/supabase/server';
import { getSubscriptionsDueForReminder } from '@/server/queries/reminders';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { RenewalReminderEmail } from '@/components/emails/RenewalReminderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const subscriptionsToRemind =
      await getSubscriptionsDueForReminder(supabase);

    console.log(
      `[CRON] Found ${subscriptionsToRemind.length} subscriptions to remind`
    );

    const results = [];

    for (const item of subscriptionsToRemind) {
      const { subscription, rule, scheduledAt } = item;
      const userEmail = subscription.profile?.email;

      if (!userEmail) {
        console.error(`[CRON] No email found for user ${subscription.user_id}`);
        continue;
      }

      // Create notification job
      const { data: jobData, error: jobError } = await supabase
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

      if (jobError) {
        console.error('Error creating notification job:', jobError);
        results.push({
          subscription_id: subscription.id,
          error: jobError.message,
        });
        continue;
      }

      try {
        // Send actual email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send(
          {
            from: 'SubMonitor <onboarding@resend.dev>', // Use verified domain in production
            to: [userEmail],
            subject: `Reminder: ${
              subscription.provider?.display_name || subscription.custom_name
            } is renewing soon`,
            react: (
              <RenewalReminderEmail
                subscriptionName={
                  subscription.provider?.display_name ||
                  subscription.custom_name
                }
                amount={subscription.amount}
                currency={subscription.currency}
                renewDate={new Date(
                  subscription.next_renew_at
                ).toLocaleDateString()}
              />
            ),
          }
        );

        if (emailError) {
          throw new Error(emailError.message);
        }

        // Update job status to sent
        await supabase
          .from('notification_jobs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', jobData.id);

        results.push({
          subscription_id: subscription.id,
          job_id: jobData.id,
          email_id: emailData?.id,
          status: 'sent',
        });

        console.log(
          `[CRON] Email sent to ${userEmail} for ${
            subscription.custom_name || subscription.id
          }`
        );
      } catch (err: any) {
        console.error(`[CRON] Failed to send email to ${userEmail}:`, err);

        // Update job status to failed
        await supabase
          .from('notification_jobs')
          .update({
            status: 'failed',
          })
          .eq('id', jobData.id);

        results.push({
          subscription_id: subscription.id,
          job_id: jobData.id,
          error: err.message,
          status: 'failed',
        });
      }
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
