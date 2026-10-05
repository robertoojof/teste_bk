import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { ProductEntity } from '../entities/product.entity';

export namespace ProductRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<
    ProductEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      ProductEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findBySku(sku: string): Promise<ProductEntity>;
    findBySkus(skus: string[]): Promise<ProductEntity[]>;
    skuExists(sku: string): Promise<void>;
  }
}
