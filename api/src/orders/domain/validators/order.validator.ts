import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  OrderCustomerProps,
  OrderItemProps,
  OrderProps,
} from '../entities/order.entity';

export class OrderCustomerRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor({ name, email }: OrderCustomerProps) {
    Object.assign(this, { name, email });
  }
}

export class OrderItemRules {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  sku: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Min(1)
  @IsInt()
  quantity: number;

  @Min(0)
  @IsInt()
  unitPrice: number;

  constructor({ sku, name, quantity, unitPrice }: OrderItemProps) {
    Object.assign(this, { sku, name, quantity, unitPrice });
  }
}

export class OrderRules {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ValidateNested()
  @IsNotEmpty()
  customer: OrderCustomerRules;

  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  items: OrderItemRules[];

  @Min(0)
  @IsInt()
  totalAmount: number;

  @IsDate()
  placedAt: Date;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({
    externalId,
    platform,
    customer,
    items,
    totalAmount,
    placedAt,
    createdAt,
  }: OrderProps) {
    Object.assign(this, {
      externalId,
      platform,
      customer: customer ? new OrderCustomerRules(customer) : customer,
      items: Array.isArray(items)
        ? items.map(item => new OrderItemRules(item ?? ({} as OrderItemProps)))
        : items,
      totalAmount,
      placedAt,
      createdAt,
    });
  }
}

export class OrderValidator extends ClassValidatorFields<OrderRules> {
  validate(data: OrderProps): boolean {
    return super.validate(new OrderRules(data ?? ({} as OrderProps)));
  }
}

export class OrderValidatorFactory {
  static create(): OrderValidator {
    return new OrderValidator();
  }
}
