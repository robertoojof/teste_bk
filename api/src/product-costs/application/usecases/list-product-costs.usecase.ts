import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import {
  ProductWithCostOutput,
  ProductWithCostOutputMapper,
} from '../dtos/product-with-cost-output';

export namespace ListProductCostsUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<ProductWithCostOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private productRepository: ProductRepository.Repository,
      private productCostRepository: ProductCostRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const params = new ProductRepository.SearchParams(input);
      const searchResult = await this.productRepository.search(params);
      const costs = await this.productCostRepository.findByProductIds(
        searchResult.items.map(product => product.id),
      );
      const costsByProductId = new Map(
        costs.map(cost => [cost.productId, cost]),
      );

      const items = searchResult.items.map(product =>
        ProductWithCostOutputMapper.toOutput(
          product,
          costsByProductId.get(product.id) ?? null,
        ),
      );
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
