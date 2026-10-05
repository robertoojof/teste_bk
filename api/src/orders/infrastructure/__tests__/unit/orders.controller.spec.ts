import { OrderOutput } from '@/orders/application/dtos/order-output';
import { ListOrdersUseCase } from '@/orders/application/usecases/list-orders.usecase';
import { OrdersController } from '../../orders.controller';
import {
  OrderCollectionPresenter,
  OrderPresenter,
} from '../../presenters/order.presenter';

describe('OrdersController unit tests', () => {
  let sut: OrdersController;
  const id = 'df96ae94-6128-486e-840c-b6f78abb4801';
  const props: OrderOutput = {
    id,
    externalId: 'ORD-98432',
    platform: 'ecommerce',
    customer: { name: 'Maria Souza', email: 'maria@email.com' },
    items: [
      { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
    ],
    totalAmount: 9980,
    placedAt: new Date(),
    createdAt: new Date(),
  };

  beforeEach(() => {
    sut = new OrdersController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should search orders', async () => {
    const output: ListOrdersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockListOrdersUseCase = {
      execute: vi.fn().mockResolvedValue(output),
    };
    sut['listOrdersUseCase'] = mockListOrdersUseCase as any;
    const searchParams = { page: 1, perPage: 1 };

    const presenter = await sut.search(searchParams);

    expect(presenter).toBeInstanceOf(OrderCollectionPresenter);
    expect(presenter).toEqual(new OrderCollectionPresenter(output));
    expect(mockListOrdersUseCase.execute).toHaveBeenCalledWith(searchParams);
  });

  it('should get an order', async () => {
    const mockGetOrderUseCase = {
      execute: vi.fn().mockResolvedValue(props),
    };
    sut['getOrderUseCase'] = mockGetOrderUseCase as any;

    const presenter = await sut.findOne(id);

    expect(presenter).toBeInstanceOf(OrderPresenter);
    expect(presenter).toStrictEqual(new OrderPresenter(props));
    expect(mockGetOrderUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
