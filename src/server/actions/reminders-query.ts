'use server';

import { getReminderRules as getReminderRulesQuery } from '@/server/queries/reminders';

export async function getReminderRules() {
  return await getReminderRulesQuery();
}
