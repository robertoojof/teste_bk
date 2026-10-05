import { faker } from '@faker-js/faker';
import { ProductProps } from '../../entities/product.entity';

type Props = {
  name?: string;
  sku?: string;
  price?: number;
  createdAt?: Date;
};

export function ProductDataBuilder(props: Props): ProductProps {
  return {
    name: props.name ?? faker.commerce.productName(),
    sku: props.sku ?? `P-${faker.string.numeric(6)}`,
    price: props.price ?? faker.number.int({ min: 100, max: 100000 }),
    createdAt: props.createdAt ?? new Date(),
  };
}
