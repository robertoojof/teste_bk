import { faker } from '@faker-js/faker';
import {
  OrderCustomerProps,
  OrderEntity,
  OrderItemProps,
  OrderProps,
} from '../../entities/order.entity';

type Props = {
  externalId?: string;
  platform?: string;
  customer?: OrderCustomerProps;
  items?: OrderItemProps[];
  totalAmount?: number;
  placedAt?: Date;
  createdAt?: Date;
};

export function OrderItemDataBuilder(
  props: Partial<OrderItemProps>,
): OrderItemProps {
  return {
    sku: props.sku ?? `P-${faker.string.numeric(3)}`,
    name: props.name ?? faker.commerce.productName(),
    quantity: props.quantity ?? faker.number.int({ min: 1, max: 5 }),
    unitPrice: props.unitPrice ?? faker.number.int({ min: 100, max: 50000 }),
  };
}

export function OrderDataBuilder(props: Props): OrderProps {
  const items = props.items ?? [
    OrderItemDataBuilder({}),
    OrderItemDataBuilder({}),
  ];
  return {
    externalId: props.externalId ?? `ORD-${faker.string.numeric(5)}`,
    platform: props.platform ?? 'ecommerce',
    customer: props.customer ?? {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    items,
    totalAmount: props.totalAmount ?? OrderEntity.itemsTotal(items),
    placedAt: props.placedAt ?? faker.date.recent(),
    createdAt: props.createdAt ?? new Date(),
  };
}
