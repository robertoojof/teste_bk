import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';

export namespace CreateProductUseCase {
  export type Input = {
    name: string;
    sku: string;
    price: number;
  };

  export type Output = ProductOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.productRepository.skuExists(input.sku);

      const entity = new ProductEntity({
        name: input.name,
        sku: input.sku,
        price: input.price,
      });

      await this.productRepository.insert(entity);
      return ProductOutputMapper.toOutput(entity);
    }
  }
}
