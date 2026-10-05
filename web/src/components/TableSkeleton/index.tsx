import { Skeleton } from '@/components/ui/skeleton';

type TableSkeletonProps = {
  rows?: number;
};

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  const keys = Array.from({ length: rows }, (_, index) => `skeleton-${index}`);

  return (
    <div role='status' aria-label='Carregando' className='flex flex-col gap-3'>
      {keys.map(key => (
        <Skeleton key={key} className='h-8 w-full' />
      ))}
    </div>
  );
}
