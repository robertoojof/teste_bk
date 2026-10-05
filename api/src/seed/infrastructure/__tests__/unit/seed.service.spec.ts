import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { OrderInMemoryRepository } from '@/orders/infrastructure/database/in-memory/repositories/order-in-memory.repository';
import { UpsertProductCostUseCase } from '@/product-costs/application/usecases/upsert-product-cost.usecase';
import { ProductCostInMemoryRepository } from '@/product-costs/infrastructure/database/in-memory/repositories/product-cost-in-memory.repository';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { seedOrders, seedProducts } from '../../seed-data';
import { SeedService } from '../../seed.service';

describe('SeedService unit tests', () => {
  let productRepository: ProductInMemoryRepository;
  let productCostRepository: ProductCostInMemoryRepository;
  let orderRepository: OrderInMemoryRepository;

  function makeSut(nodeEnv: string, ...data: [any?, any?, any?]) {
    return new SeedService(
      { getNodeEnv: () => nodeEnv, getAppPort: () => 3000 },
      new CreateProductUseCase.UseCase(productRepository),
      new UpsertProductCostUseCase.UseCase(
        productRepository,
        productCostRepository,
      ),
      new CreateOrderUseCase.UseCase(orderRepository),
      ...data,
    );
  }

  beforeEach(() => {
    productRepository = new ProductInMemoryRepository();
    productCostRepository = new ProductCostInMemoryRepository();
    orderRepository = new OrderInMemoryRepository();
  });

  it('should seed the repositories in development', async () => {
    await makeSut('development').onApplicationBootstrap();

    expect(productRepository.items).toHaveLength(seedProducts.length);
    expect(productCostRepository.items).toHaveLength(
      seedProducts.filter(product => product.unitCost !== null).length,
    );
    expect(orderRepository.items).toHaveLength(seedOrders.length);
  });

  it.each(['test', 'production'])(
    'should not seed when NODE_ENV is %s',
    async nodeEnv => {
      await makeSut(nodeEnv).onApplicationBootstrap();

      expect(productRepository.items).toHaveLength(0);
      expect(orderRepository.items).toHaveLength(0);
    },
  );

  it('should build the orders from the seeded products', async () => {
    const now = new Date('2025-02-10T16:32:00Z');
    await makeSut(
      'development',
      [{ sku: 'P-001', name: 'Camiseta', price: 4990, unitCost: 1800 }],
      [
        {
          externalId: 'ORD-1',
          customer: { name: 'Maria', email: 'maria@email.com' },
          items: [{ sku: 'P-001', quantity: 2 }],
          hoursAgo: 2,
        },
      ],
      () => now,
    ).run();

    const [order] = orderRepository.items;
    expect(order.items).toStrictEqual([
      { sku: 'P-001', name: 'Camiseta', quantity: 2, unitPrice: 4990 },
    ]);
    expect(order.totalAmount).toBe(9980);
    expect(order.placedAt).toStrictEqual(new Date('2025-02-10T14:32:00Z'));
  });

  it('should fail when an order uses a sku that is not seeded', async () => {
    await expect(
      makeSut(
        'development',
        [],
        [
          {
            externalId: 'ORD-1',
            customer: { name: 'Maria', email: 'maria@email.com' },
            items: [{ sku: 'P-404', quantity: 1 }],
            hoursAgo: 2,
          },
        ],
      ).run(),
    ).rejects.toThrow('Seed order uses an unknown sku: P-404');
  });
});
