import { OrderOutput } from '@/orders/application/dtos/order-output';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import { instanceToPlain } from 'class-transformer';
import {
  OrderCollectionPresenter,
  OrderPresenter,
} from '../../order.presenter';

describe('OrderPresenter unit tests', () => {
  const placedAt = new Date('2025-02-10T14:32:00Z');
  const createdAt = new Date('2025-02-10T14:32:05Z');
  const props: OrderOutput = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    externalId: 'ORD-98432',
    platform: 'ecommerce',
    customer: { name: 'Maria Souza', email: 'maria@email.com' },
    items: [
      { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
    ],
    totalAmount: 9980,
    placedAt,
    createdAt,
  };
  const plain = {
    ...props,
    placedAt: placedAt.toISOString(),
    createdAt: createdAt.toISOString(),
  };

  it('should presenter an order', () => {
    const sut = new OrderPresenter(props);
    expect(sut).toMatchObject(props);
    expect(instanceToPlain(sut)).toStrictEqual(plain);
  });

  it('should presenter a collection of orders', () => {
    const sut = new OrderCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });

    expect(sut.meta).toBeInstanceOf(PaginationPresenter);
    expect(sut.data).toStrictEqual([new OrderPresenter(props)]);
    expect(instanceToPlain(sut)).toStrictEqual({
      data: [plain],
      meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
    });
  });
});
