import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import {
  getCategories,
  getProviders,
  getCurrencies,
} from '@/server/queries/subscriptions';

export default async function NewSubscriptionPage() {
  const [categories, providers, currencies] = await Promise.all([
    getCategories(),
    getProviders(),
    getCurrencies(),
  ]);
  console.log('currencies', currencies);
  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Add Subscription</h1>
      <SubscriptionForm
        categories={categories}
        providers={providers}
        currencies={currencies}
      />
    </div>
  );
}
