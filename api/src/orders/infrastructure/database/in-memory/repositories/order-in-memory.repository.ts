import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';

export class OrderInMemoryRepository
  extends InMemorySearchableRepository<OrderEntity>
  implements OrderRepository.Repository
{
  sortableFields: string[] = ['placedAt', 'totalAmount', 'createdAt'];

  async findByExternalId(
    platform: string,
    externalId: string,
  ): Promise<OrderEntity | null> {
    return (
      this.items.find(
        item => item.platform === platform && item.externalId === externalId,
      ) ?? null
    );
  }

  async findByPeriod(start: Date, end: Date): Promise<OrderEntity[]> {
    const startTime = start.getTime();
    const endTime = end.getTime();
    return this.items.filter(item => {
      const placedAt = item.placedAt.getTime();
      return placedAt >= startTime && placedAt <= endTime;
    });
  }

  protected async applyFilter(
    items: OrderEntity[],
    filter: OrderRepository.Filter | null,
  ): Promise<OrderEntity[]> {
    if (!filter) {
      return items;
    }
    const term = filter.toLowerCase();
    return items.filter(
      item =>
        item.externalId.toLowerCase().includes(term) ||
        item.customer.name.toLowerCase().includes(term) ||
        item.customer.email.toLowerCase().includes(term),
    );
  }

  protected async applySort(
    items: OrderEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<OrderEntity[]> {
    return !sort
      ? super.applySort(items, 'placedAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
