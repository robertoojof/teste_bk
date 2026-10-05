import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';

export type ProductCostOutput = {
  id: string;
  productId: string;
  unitCost: number;
  createdAt: Date;
  updatedAt: Date;
};

export class ProductCostOutputMapper {
  static toOutput(entity: ProductCostEntity): ProductCostOutput {
    return entity.toJSON();
  }
}
