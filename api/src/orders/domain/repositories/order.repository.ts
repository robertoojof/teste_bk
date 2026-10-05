import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { OrderEntity } from '../entities/order.entity';

export namespace OrderRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<OrderEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      OrderEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByExternalId(
      platform: string,
      externalId: string,
    ): Promise<OrderEntity | null>;
    findByPeriod(start: Date, end: Date): Promise<OrderEntity[]>;
  }
}
