import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderInMemoryRepository } from '@/orders/infrastructure/database/in-memory/repositories/order-in-memory.repository';
import { ListOrdersUseCase } from '../../list-orders.usecase';

describe('ListOrdersUseCase unit tests', () => {
  let sut: ListOrdersUseCase.UseCase;
  let repository: OrderInMemoryRepository;

  beforeEach(() => {
    repository = new OrderInMemoryRepository();
    sut = new ListOrdersUseCase.UseCase(repository);
  });

  it('toOutput method', () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    const result = new OrderRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });

    expect(sut['toOutput'](result)).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });
  });

  it('should return the most recent orders first', async () => {
    const placedAt = new Date('2025-02-10T10:00:00Z');
    const older = new OrderEntity(OrderDataBuilder({ placedAt }));
    const newer = new OrderEntity(
      OrderDataBuilder({ placedAt: new Date('2025-02-11T10:00:00Z') }),
    );
    repository.items = [older, newer];

    const output = await sut.execute({});

    expect(output.items).toStrictEqual([newer.toJSON(), older.toJSON()]);
    expect(output.total).toBe(2);
  });

  it('should filter, sort and paginate the orders', async () => {
    const items = [
      new OrderEntity(OrderDataBuilder({ externalId: 'ORD-1' })),
      new OrderEntity(
        OrderDataBuilder({
          customer: { name: 'Maria Souza', email: 'maria@email.com' },
          items: [{ sku: 'P-001', name: 'A', quantity: 1, unitPrice: 300 }],
        }),
      ),
      new OrderEntity(
        OrderDataBuilder({
          customer: { name: 'Mariana Lima', email: 'mari@email.com' },
          items: [{ sku: 'P-001', name: 'A', quantity: 1, unitPrice: 100 }],
        }),
      ),
    ];
    repository.items = items;

    const output = await sut.execute({
      page: 1,
      perPage: 1,
      sort: 'totalAmount',
      sortDir: 'asc',
      filter: 'mari',
    });

    expect(output).toStrictEqual({
      items: [items[2].toJSON()],
      total: 2,
      currentPage: 1,
      lastPage: 2,
      perPage: 1,
    });
  });
});
