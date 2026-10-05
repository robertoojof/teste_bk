import type { Product } from '@/models/product.model';
import { formatCurrency } from '@/utils/format-currency';

type ProductsListProps = {
  products: Product[];
};

export function ProductsList({ products }: ProductsListProps) {
  return (
    <ul className='divide-y'>
      {products.map(product => (
        <li
          key={product.id}
          className='flex items-center justify-between gap-4 py-3'
        >
          <div className='min-w-0'>
            <p className='truncate font-medium'>{product.name}</p>
            <p className='text-xs text-muted-foreground'>{product.sku}</p>
          </div>
          <span className='font-medium tabular-nums'>
            {formatCurrency(product.price)}
          </span>
        </li>
      ))}
    </ul>
  );
}
