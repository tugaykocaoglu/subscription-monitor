import { createClient } from '@/lib/supabase/server';

export async function getSubscriptions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      *,
      category:categories(name),
      provider:subscription_providers(display_name, logo_url)
    `
    )
    .is('deleted_at', null)
    .order('next_renew_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSubscriptionById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  return data || [];
}

export async function getProviders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('subscription_providers')
    .select('*')
    .eq('is_active', true)
    .order('display_name');
  return data || [];
}
