import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { ProductCostEntity } from '../entities/product-cost.entity';

export namespace ProductCostRepository {
  export interface Repository extends RepositoryInterface<ProductCostEntity> {
    findByProductId(productId: string): Promise<ProductCostEntity | null>;
    findByProductIds(productIds: string[]): Promise<ProductCostEntity[]>;
  }
}
