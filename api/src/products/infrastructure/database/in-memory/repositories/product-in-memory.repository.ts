import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';

export class ProductInMemoryRepository
  extends InMemorySearchableRepository<ProductEntity>
  implements ProductRepository.Repository
{
  sortableFields: string[] = ['name', 'sku', 'price', 'createdAt'];

  async findBySku(sku: string): Promise<ProductEntity> {
    const entity = this.items.find(item => item.sku === sku);
    if (!entity) {
      throw new NotFoundError(`Entity not found using sku ${sku}`);
    }
    return entity;
  }

  async findBySkus(skus: string[]): Promise<ProductEntity[]> {
    const wanted = new Set(skus);
    return this.items.filter(item => wanted.has(item.sku));
  }

  async skuExists(sku: string): Promise<void> {
    const entity = this.items.find(item => item.sku === sku);
    if (entity) {
      throw new ConflictError('SKU already used');
    }
  }

  protected async applyFilter(
    items: ProductEntity[],
    filter: ProductRepository.Filter | null,
  ): Promise<ProductEntity[]> {
    if (!filter) {
      return items;
    }
    const term = filter.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term),
    );
  }

  protected async applySort(
    items: ProductEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<ProductEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
