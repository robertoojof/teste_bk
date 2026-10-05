import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductProps } from '../entities/product.entity';

export class ProductRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ name, sku, price, createdAt }: ProductProps) {
    Object.assign(this, { name, sku, price, createdAt });
  }
}

export class ProductValidator extends ClassValidatorFields<ProductRules> {
  validate(data: ProductProps): boolean {
    return super.validate(new ProductRules(data ?? ({} as ProductProps)));
  }
}

export class ProductValidatorFactory {
  static create(): ProductValidator {
    return new ProductValidator();
  }
}
