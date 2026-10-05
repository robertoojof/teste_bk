import {
  OrderCustomerProps,
  OrderEntity,
  OrderItemProps,
} from '@/orders/domain/entities/order.entity';

export type OrderOutput = {
  id: string;
  externalId: string;
  platform: string;
  customer: OrderCustomerProps;
  items: OrderItemProps[];
  totalAmount: number;
  placedAt: Date;
  createdAt: Date;
};

export class OrderOutputMapper {
  static toOutput(entity: OrderEntity): OrderOutput {
    const json = entity.toJSON();
    return {
      ...json,
      customer: { ...json.customer },
      items: json.items.map(item => ({ ...item })),
    };
  }
}
