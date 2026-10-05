import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import {
  ProductCostOutput,
  ProductCostOutputMapper,
} from '../dtos/product-cost-output';

export namespace UpsertProductCostUseCase {
  export type Input = {
    productId: string;
    unitCost: number;
  };

  export type Output = ProductCostOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private productRepository: ProductRepository.Repository,
      private productCostRepository: ProductCostRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const product = await this.productRepository.findById(input.productId);

      const current = await this.productCostRepository.findByProductId(
        product.id,
      );

      if (current) {
        current.updateCost(input.unitCost);
        await this.productCostRepository.update(current);
        return ProductCostOutputMapper.toOutput(current);
      }

      const entity = new ProductCostEntity({
        productId: product.id,
        unitCost: input.unitCost,
      });
      await this.productCostRepository.insert(entity);
      return ProductCostOutputMapper.toOutput(entity);
    }
  }
}
