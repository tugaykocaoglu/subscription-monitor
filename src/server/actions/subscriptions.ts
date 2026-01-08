'use server';

import { createClient } from '@/lib/supabase/server';
import { subscriptionSchema } from '@/lib/validators/subscription';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());
  const validated = subscriptionSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('subscriptions').insert({
    ...validated.data,
    user_id: user.id,
    next_renew_at: validated.data.next_renew_at || null,
    started_at: validated.data.started_at || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/subscriptions');
  revalidatePath('/');
  redirect('/subscriptions');
}

export async function updateSubscription(id: string, formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());
  const validated = subscriptionSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({
      ...validated.data,
      next_renew_at: validated.data.next_renew_at || null,
      started_at: validated.data.started_at || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/subscriptions');
  revalidatePath('/');
  redirect('/subscriptions');
}

export async function deleteSubscription(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('subscriptions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/subscriptions');
  revalidatePath('/');
}
