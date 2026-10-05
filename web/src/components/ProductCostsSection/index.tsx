import { Calculator } from 'lucide-react';
import { useState } from 'react';
import { EditableCostCell } from '@/components/EditableCostCell';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Pagination } from '@/components/Pagination';
import { Section } from '@/components/Section';
import { TableSkeleton } from '@/components/TableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductCosts } from '@/hooks/useProductCosts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format-currency';

export const PRODUCT_COSTS_PER_PAGE = 5;

export function ProductCostsSection() {
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, error, refetch } = useProductCosts({
    page,
    perPage: PRODUCT_COSTS_PER_PAGE,
    sort: 'name',
    sortDir: 'asc',
  });

  return (
    <Section
      id='product-costs'
      title='Custos de Produto'
      description='Custo unitário de cada produto, usado no cálculo do lucro'
    >
      {isPending && <TableSkeleton rows={PRODUCT_COSTS_PER_PAGE} />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && !data.data.length && (
        <EmptyState
          icon={Calculator}
          title='Nenhum produto cadastrado'
          description='Cadastre produtos para informar o custo de cada um.'
        />
      )}
      {data && data.data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className='hidden text-right sm:table-cell'>
                  Margem
                </TableHead>
                <TableHead className='text-right'>Custo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map(product => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div className='font-medium'>{product.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {product.sku} · venda {formatCurrency(product.price)}
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'hidden text-right tabular-nums sm:table-cell',
                      product.margin !== null &&
                        product.margin < 0 &&
                        'text-destructive',
                    )}
                  >
                    {product.margin === null
                      ? '—'
                      : formatCurrency(product.margin)}
                  </TableCell>
                  <TableCell>
                    <EditableCostCell
                      key={`${product.productId}-${product.unitCost}`}
                      product={product}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            meta={data.meta}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
    </Section>
  );
}
