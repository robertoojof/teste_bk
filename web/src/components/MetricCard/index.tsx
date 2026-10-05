import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  isLoading?: boolean;
  tone?: 'default' | 'positive' | 'negative';
};

const toneClasses = {
  default: 'text-foreground',
  positive: 'text-emerald-600',
  negative: 'text-destructive',
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  isLoading = false,
  tone = 'default',
}: MetricCardProps) {
  return (
    <Card size='sm'>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex items-center justify-between text-muted-foreground'>
          <span className='text-sm'>{label}</span>
          <Icon aria-hidden='true' className='size-4' />
        </div>
        {isLoading ? (
          <Skeleton className='h-8 w-36' />
        ) : (
          <output
            aria-label={label}
            className={cn(
              'text-2xl font-semibold tracking-tight tabular-nums',
              toneClasses[tone],
            )}
          >
            {value}
          </output>
        )}
      </CardContent>
    </Card>
  );
}
