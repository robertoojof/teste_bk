import { DashboardSummaryCalculator } from '@/dashboard/domain/services/dashboard-summary.calculator';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import {
  OrderDataBuilder,
  OrderItemDataBuilder,
} from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderInMemoryRepository } from '@/orders/infrastructure/database/in-memory/repositories/order-in-memory.repository';
import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostInMemoryRepository } from '@/product-costs/infrastructure/database/in-memory/repositories/product-cost-in-memory.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { GetDashboardSummaryUseCase } from '../../get-dashboard-summary.usecase';

describe('GetDashboardSummaryUseCase unit tests', () => {
  let sut: GetDashboardSummaryUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  let productRepository: ProductInMemoryRepository;
  let productCostRepository: ProductCostInMemoryRepository;
  const period = {
    startDate: new Date('2025-02-01T00:00:00.000Z'),
    endDate: new Date('2025-02-28T23:59:59.999Z'),
  };

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    productRepository = new ProductInMemoryRepository();
    productCostRepository = new ProductCostInMemoryRepository();
    sut = new GetDashboardSummaryUseCase.UseCase(
      orderRepository,
      productRepository,
      productCostRepository,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw a BadRequestError when startDate is after endDate', async () => {
    await expect(() =>
      sut.execute({ startDate: period.endDate, endDate: period.startDate }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should return zeroed indicators without querying costs when there are no orders', async () => {
    const spyFindBySkus = vi.spyOn(productRepository, 'findBySkus');

    const output = await sut.execute(period);

    expect(spyFindBySkus).not.toHaveBeenCalled();
    expect(output).toStrictEqual({
      ...period,
      ordersCount: 0,
      revenue: 0,
      totalCost: 0,
      profit: 0,
      skusWithoutCost: [],
    });
  });

  it('should consolidate only the orders of the period using the current costs', async () => {
    const shirt = new ProductEntity(ProductDataBuilder({ sku: 'P-001' }));
    const jeans = new ProductEntity(ProductDataBuilder({ sku: 'P-002' }));
    productRepository.items = [shirt, jeans];
    productCostRepository.items = [
      new ProductCostEntity({ productId: shirt.id, unitCost: 1800 }),
    ];
    const inside = new OrderEntity(
      OrderDataBuilder({
        placedAt: new Date('2025-02-10T14:32:00Z'),
        items: [
          OrderItemDataBuilder({ sku: 'P-001', quantity: 2, unitPrice: 4990 }),
          OrderItemDataBuilder({ sku: 'P-002', quantity: 1, unitPrice: 12990 }),
        ],
      }),
    );
    const outside = new OrderEntity(
      OrderDataBuilder({ placedAt: new Date('2025-03-01T00:00:00Z') }),
    );
    orderRepository.items = [inside, outside];
    const spyCalculate = vi.spyOn(DashboardSummaryCalculator, 'calculate');

    const output = await sut.execute(period);

    expect(spyCalculate).toHaveBeenCalledWith(
      [inside],
      new Map([['P-001', 1800]]),
    );
    expect(output).toStrictEqual({
      ...period,
      ordersCount: 1,
      revenue: 22970,
      totalCost: 3600,
      profit: 19370,
      skusWithoutCost: ['P-002'],
    });
  });

  it('should report skus sold that are not in the catalog', async () => {
    orderRepository.items = [
      new OrderEntity(
        OrderDataBuilder({
          placedAt: new Date('2025-02-10T00:00:00Z'),
          items: [OrderItemDataBuilder({ sku: 'P-404' })],
        }),
      ),
    ];

    const output = await sut.execute(period);

    expect(output.totalCost).toBe(0);
    expect(output.skusWithoutCost).toStrictEqual(['P-404']);
  });
});
