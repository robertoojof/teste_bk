import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderValidatorFactory } from '../validators/order.validator';

export type OrderCustomerProps = {
  name: string;
  email: string;
};

export type OrderItemProps = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type OrderProps = {
  externalId: string;
  platform: string;
  customer: OrderCustomerProps;
  items: OrderItemProps[];
  totalAmount: number;
  placedAt: Date;
  createdAt?: Date;
};

export class OrderEntity extends Entity<OrderProps> {
  constructor(props: OrderProps, id?: string) {
    OrderEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get externalId(): string {
    return this.props.externalId;
  }

  get platform(): string {
    return this.props.platform;
  }

  get customer(): OrderCustomerProps {
    return this.props.customer;
  }

  get items(): OrderItemProps[] {
    return this.props.items;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get placedAt(): Date {
    return this.props.placedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  static itemsTotal(items: OrderItemProps[]): number {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
  }

  static validate(props: OrderProps) {
    const validator = OrderValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
    if (OrderEntity.itemsTotal(props.items) !== props.totalAmount) {
      throw new EntityValidationError({
        totalAmount: ['totalAmount must be equal to the sum of the items'],
      });
    }
  }
}
