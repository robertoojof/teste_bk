import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/models/pagination.model';
import { formatNumber } from '@/utils/format-number';

type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({
  meta,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (meta.lastPage <= 1) return null;

  const { currentPage, lastPage, total } = meta;

  return (
    <nav
      aria-label='Paginação'
      className='flex items-center justify-between gap-2 pt-4 text-sm text-muted-foreground'
    >
      <span>
        Página {currentPage} de {lastPage} · {formatNumber(total)} registros
      </span>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          aria-label='Página anterior'
        >
          <ChevronLeft aria-hidden='true' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= lastPage}
          aria-label='Próxima página'
        >
          <ChevronRight aria-hidden='true' />
        </Button>
      </div>
    </nav>
  );
}
