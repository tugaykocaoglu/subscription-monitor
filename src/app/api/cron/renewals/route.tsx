import { createClient } from '@/lib/supabase/server';
import {
  getSubscriptionsToRollover,
  calculateNextRenewal,
} from '@/server/queries/renewals';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SubscriptionRenewedEmail } from '@/components/emails/SubscriptionRenewedEmail';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = [];

  try {
    const supabase = await createClient();
    const subscriptionsToRollover = await getSubscriptionsToRollover();

    console.log(
      `[CRON] Found ${subscriptionsToRollover.length} subscriptions to rollover`
    );

    for (const sub of subscriptionsToRollover) {
      if (!sub.next_renew_at) continue;

      const previousDate = new Date(sub.next_renew_at);
      const nextDate = calculateNextRenewal(previousDate, sub.billing_cycle);

      // 1. Update database
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          next_renew_at: nextDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', sub.id);

      if (updateError) {
        console.error(
          `[CRON] Failed to update subscription ${sub.id}:`,
          updateError
        );
        results.push({
          id: sub.id,
          status: 'failed',
          error: updateError.message,
        });
        continue;
      }

      // 2. Send email
      // Cast profile to any to avoid TS issues with Supabase join types for now
      const profile = sub.profile as any;
      const userEmail = Array.isArray(profile)
        ? profile[0]?.email
        : profile?.email;

      if (userEmail) {
        try {
          await resend.emails.send({
            from: 'SubMonitor <onboarding@resend.dev>',
            to: [userEmail],
            subject: 'Subscription Renewed',
            react: (
              <SubscriptionRenewedEmail
                subscriptionName={
                  // Cast provider to any to avoid TS issues
                  (Array.isArray(sub.provider)
                    ? sub.provider[0]?.display_name
                    : (sub.provider as any)?.display_name) ||
                  sub.custom_name ||
                  'Subscription'
                }
                amount={sub.amount}
                currency={sub.currency}
                previousDate={previousDate.toLocaleDateString()}
                nextDate={nextDate.toLocaleDateString()}
              />
            ),
          });
          console.log(`[CRON] Rollover email sent to ${userEmail}`);
        } catch (emailError) {
          console.error(
            `[CRON] Failed to send email for ${sub.id}:`,
            emailError
          );
        }
      }

      results.push({
        id: sub.id,
        status: 'success',
        previous: previousDate.toISOString(),
        next: nextDate.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
