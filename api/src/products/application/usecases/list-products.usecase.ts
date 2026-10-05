import { ProductRepository } from '@/products/domain/repositories/product.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';

export namespace ListProductsUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<ProductOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new ProductRepository.SearchParams(input);
      const searchResult = await this.productRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: ProductRepository.SearchResult): Output {
      const items = searchResult.items.map(item =>
        ProductOutputMapper.toOutput(item),
      );
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
