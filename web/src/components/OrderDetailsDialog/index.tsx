import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/models/order.model';
import { formatCurrency } from '@/utils/format-currency';
import { formatDateTime } from '@/utils/format-date';

type OrderDetailsDialogProps = {
  order: Order | null;
  onClose: () => void;
};

export function OrderDetailsDialog({
  order,
  onClose,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={!!order} onOpenChange={open => !open && onClose()}>
      {order && (
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              Pedido {order.externalId}
              <Badge variant='secondary'>{order.platform}</Badge>
            </DialogTitle>
            <DialogDescription>
              {formatDateTime(order.placedAt)}
            </DialogDescription>
          </DialogHeader>

          <dl className='grid gap-1 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>Cliente</dt>
              <dd className='font-medium'>{order.customer.name}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>E-mail</dt>
              <dd className='font-medium'>{order.customer.email}</dd>
            </div>
          </dl>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className='text-right'>Qtd.</TableHead>
                <TableHead className='text-right'>Unitário</TableHead>
                <TableHead className='text-right'>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.sku}>
                  <TableCell>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {item.sku}
                    </div>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {item.quantity}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrency(order.totalAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      )}
    </Dialog>
  );
}
