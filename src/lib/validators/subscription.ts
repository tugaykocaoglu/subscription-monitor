import { z } from 'zod';

export const subscriptionSchema = z.object({
  custom_name: z.string().optional(),
  provider_id: z.coerce.number().optional(),
  category_id: z.coerce.number().optional(),
  plan_name: z.string().optional(),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  billing_cycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  next_renew_at: z.string().optional().nullable(), // Form sends string date
  status: z.enum(['active', 'paused', 'canceled']).default('active'),
  started_at: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
