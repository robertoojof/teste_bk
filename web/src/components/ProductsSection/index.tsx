import { PackageOpen, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateProductDialog } from '@/components/CreateProductDialog';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Pagination } from '@/components/Pagination';
import { ProductsList } from '@/components/ProductsList';
import { Section } from '@/components/Section';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

export const PRODUCTS_PER_PAGE = 5;

export function ProductsSection() {
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const { data, isPending, isFetching, error, refetch } = useProducts({
    page,
    perPage: PRODUCTS_PER_PAGE,
    sort: 'name',
    sortDir: 'asc',
  });

  return (
    <Section
      id='products'
      title='Produtos'
      description='Catálogo de produtos cadastrados'
      action={
        <Button onClick={() => setIsCreating(true)}>
          <Plus aria-hidden='true' />
          Novo
        </Button>
      }
    >
      {isPending && <TableSkeleton rows={PRODUCTS_PER_PAGE} />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && !data.data.length && (
        <EmptyState
          icon={PackageOpen}
          title='Nenhum produto cadastrado'
          description='Cadastre o primeiro produto para montar o catálogo.'
        />
      )}
      {data && data.data.length > 0 && (
        <>
          <ProductsList products={data.data} />
          <Pagination
            meta={data.meta}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
      <CreateProductDialog open={isCreating} onOpenChange={setIsCreating} />
    </Section>
  );
}
