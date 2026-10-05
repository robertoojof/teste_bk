import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductEntity } from '@/products/domain/entities/product.entity';

export type ProductWithCostOutput = {
  productId: string;
  name: string;
  sku: string;
  price: number;
  unitCost: number | null;
  margin: number | null;
  costUpdatedAt: Date | null;
};

export class ProductWithCostOutputMapper {
  static toOutput(
    product: ProductEntity,
    cost: ProductCostEntity | null,
  ): ProductWithCostOutput {
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      unitCost: cost?.unitCost ?? null,
      margin: cost ? product.price - cost.unitCost : null,
      costUpdatedAt: cost?.updatedAt ?? null,
    };
  }
}
