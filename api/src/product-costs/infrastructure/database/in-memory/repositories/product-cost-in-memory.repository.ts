import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export class ProductCostInMemoryRepository
  extends InMemoryRepository<ProductCostEntity>
  implements ProductCostRepository.Repository
{
  async findByProductId(productId: string): Promise<ProductCostEntity | null> {
    return this.items.find(item => item.productId === productId) ?? null;
  }

  async findByProductIds(productIds: string[]): Promise<ProductCostEntity[]> {
    const ids = new Set(productIds);
    return this.items.filter(item => ids.has(item.productId));
  }
}
