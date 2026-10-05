import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';

export namespace ListOrdersUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<OrderOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new OrderRepository.SearchParams(input);
      const searchResult = await this.orderRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: OrderRepository.SearchResult): Output {
      const items = searchResult.items.map(item =>
        OrderOutputMapper.toOutput(item),
      );
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
