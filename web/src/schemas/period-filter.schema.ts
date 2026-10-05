import { z } from 'zod';

const dateField = (label: string) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, `Informe a data ${label}`);

export const PeriodFilterSchema = z
  .object({
    startDate: dateField('inicial'),
    endDate: dateField('final'),
  })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    path: ['endDate'],
    message: 'A data final deve ser igual ou posterior à inicial',
  });

export type PeriodFilterValues = z.infer<typeof PeriodFilterSchema>;
