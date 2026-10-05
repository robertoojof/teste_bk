import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductCostProps } from '../entities/product-cost.entity';

export class ProductCostRules {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  unitCost: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor({ productId, unitCost, createdAt, updatedAt }: ProductCostProps) {
    Object.assign(this, { productId, unitCost, createdAt, updatedAt });
  }
}

export class ProductCostValidator extends ClassValidatorFields<ProductCostRules> {
  validate(data: ProductCostProps): boolean {
    return super.validate(
      new ProductCostRules(data ?? ({} as ProductCostProps)),
    );
  }
}

export class ProductCostValidatorFactory {
  static create(): ProductCostValidator {
    return new ProductCostValidator();
  }
}
