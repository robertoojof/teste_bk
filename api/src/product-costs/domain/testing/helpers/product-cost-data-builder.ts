import { faker } from '@faker-js/faker';
import { ProductCostProps } from '../../entities/product-cost.entity';

type Props = {
  productId?: string;
  unitCost?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export function ProductCostDataBuilder(props: Props): ProductCostProps {
  const createdAt = props.createdAt ?? new Date();
  return {
    productId: props.productId ?? faker.string.uuid(),
    unitCost: props.unitCost ?? faker.number.int({ min: 100, max: 50000 }),
    createdAt,
    updatedAt: props.updatedAt ?? createdAt,
  };
}
