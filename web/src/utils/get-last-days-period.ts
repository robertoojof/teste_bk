import { format, subDays } from 'date-fns';
import type { Period } from '@/models/dashboard.model';

export const API_DATE_FORMAT = 'yyyy-MM-dd';

export function getLastDaysPeriod(days: number, today = new Date()): Period {
  return {
    startDate: format(subDays(today, days - 1), API_DATE_FORMAT),
    endDate: format(today, API_DATE_FORMAT),
  };
}
