import { Inbox } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { OrderDetailsDialog } from '@/components/OrderDetailsDialog';
import { OrdersTable } from '@/components/OrdersTable';
import { Pagination } from '@/components/Pagination';
import { Section } from '@/components/Section';
import { TableSkeleton } from '@/components/TableSkeleton';
import { useOrders } from '@/hooks/useOrders';
import type { Order } from '@/models/order.model';

export const ORDERS_PER_PAGE = 5;

export function OrdersSection() {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data, isPending, isFetching, error, refetch } = useOrders({
    page,
    perPage: ORDERS_PER_PAGE,
  });

  return (
    <Section
      id='orders'
      title='Pedidos Recentes'
      description='Últimos pedidos recebidos via webhook'
    >
      {isPending && <TableSkeleton rows={ORDERS_PER_PAGE} />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && !data.data.length && (
        <EmptyState
          icon={Inbox}
          title='Nenhum pedido recebido'
          description='Os pedidos aparecem aqui assim que a plataforma enviar o webhook.'
        />
      )}
      {data && data.data.length > 0 && (
        <>
          <OrdersTable orders={data.data} onSelect={setSelectedOrder} />
          <Pagination
            meta={data.meta}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
      <OrderDetailsDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Section>
  );
}
