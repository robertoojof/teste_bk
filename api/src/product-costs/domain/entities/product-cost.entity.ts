import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { ProductCostValidatorFactory } from '../validators/product-cost.validator';

export type ProductCostProps = {
  productId: string;
  unitCost: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ProductCostEntity extends Entity<ProductCostProps> {
  constructor(props: ProductCostProps, id?: string) {
    ProductCostEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? this.props.createdAt;
  }

  updateCost(value: number): void {
    ProductCostEntity.validate({
      ...this.props,
      unitCost: value,
    });
    this.unitCost = value;
    this.props.updatedAt = new Date();
  }

  get productId(): string {
    return this.props.productId;
  }

  get unitCost(): number {
    return this.props.unitCost;
  }

  private set unitCost(value: number) {
    this.props.unitCost = value;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  static validate(props: ProductCostProps) {
    const validator = ProductCostValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
