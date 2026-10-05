import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/models/order.model';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

type OrdersTableProps = {
  orders: Order[];
  onSelect: (order: Order) => void;
};

export function OrdersTable({ orders, onSelect }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className='hidden text-right sm:table-cell'>
            Data
          </TableHead>
          <TableHead className='text-right'>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow
            key={order.id}
            tabIndex={0}
            aria-label={`Ver detalhes do pedido ${order.externalId}`}
            className='cursor-pointer'
            onClick={() => onSelect(order)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(order);
              }
            }}
          >
            <TableCell className='font-medium'>{order.externalId}</TableCell>
            <TableCell>{order.customer.name}</TableCell>
            <TableCell className='hidden text-right text-muted-foreground sm:table-cell'>
              {formatDate(order.placedAt)}
            </TableCell>
            <TableCell className='text-right font-medium tabular-nums'>
              {formatCurrency(order.totalAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
