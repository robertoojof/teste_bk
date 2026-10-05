import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Period } from '@/models/dashboard.model';
import {
  PeriodFilterSchema,
  type PeriodFilterValues,
} from '@/schemas/period-filter.schema';

type PeriodFilterProps = {
  defaultValues: Period;
  onFilter: (period: Period) => void;
  isLoading?: boolean;
};

export function PeriodFilter({
  defaultValues,
  onFilter,
  isLoading = false,
}: PeriodFilterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeriodFilterValues>({
    resolver: zodResolver(PeriodFilterSchema),
    defaultValues,
  });

  const error = errors.startDate?.message ?? errors.endDate?.message;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onFilter)}
      aria-label='Filtro de período'
      className='flex flex-col gap-2'
    >
      <div className='flex flex-wrap items-end gap-3'>
        <div className='flex flex-col gap-1'>
          <Label htmlFor='period-start'>Data Inicial</Label>
          <Input
            id='period-start'
            type='date'
            className='w-40'
            aria-invalid={!!errors.startDate}
            {...register('startDate')}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <Label htmlFor='period-end'>Data Final</Label>
          <Input
            id='period-end'
            type='date'
            className='w-40'
            aria-invalid={!!errors.endDate}
            {...register('endDate')}
          />
        </div>
        <Button type='submit' disabled={isLoading}>
          <Search aria-hidden='true' />
          Filtrar
        </Button>
      </div>
      {error && (
        <p role='alert' className='text-sm text-destructive'>
          {error}
        </p>
      )}
    </form>
  );
}
