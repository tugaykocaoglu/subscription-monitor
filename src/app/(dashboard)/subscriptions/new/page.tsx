import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { getCategories, getProviders } from '@/server/queries/subscriptions';

export default async function NewSubscriptionPage() {
  const [categories, providers] = await Promise.all([
    getCategories(),
    getProviders(),
  ]);

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Add Subscription</h1>
      <SubscriptionForm categories={categories} providers={providers} />
    </div>
  );
}
