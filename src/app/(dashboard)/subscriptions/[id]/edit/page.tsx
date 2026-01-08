import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import {
  getCategories,
  getProviders,
  getSubscriptionById,
} from '@/server/queries/subscriptions';
import { notFound } from 'next/navigation';

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subscription, categories, providers] = await Promise.all([
    getSubscriptionById(id),
    getCategories(),
    getProviders(),
  ]);

  if (!subscription) {
    notFound();
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Edit Subscription</h1>
      <SubscriptionForm
        initialData={subscription}
        categories={categories}
        providers={providers}
        isEditing
      />
    </div>
  );
}
