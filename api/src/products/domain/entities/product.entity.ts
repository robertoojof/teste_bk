import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { ProductValidatorFactory } from '../validators/product.validator';

export type ProductProps = {
  name: string;
  sku: string;
  price: number;
  createdAt?: Date;
};

export class ProductEntity extends Entity<ProductProps> {
  constructor(props: ProductProps, id?: string) {
    ProductEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  get sku(): string {
    return this.props.sku;
  }

  get price(): number {
    return this.props.price;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  static validate(props: ProductProps) {
    const validator = ProductValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
