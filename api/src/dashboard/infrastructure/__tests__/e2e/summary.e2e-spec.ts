import { applyGlobalConfig } from '@/global-config';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrdersModule } from '@/orders/infrastructure/orders.module';
import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductCostsModule } from '@/product-costs/infrastructure/product-costs.module';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductsModule } from '@/products/infrastructure/products.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DashboardModule } from '../../dashboard.module';

function webhookPayload(id: string, createdAt: string) {
  return {
    id,
    buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
      { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
    ],
    totalAmount: 229.7,
    createdAt,
  };
}

describe('DashboardController e2e tests - GET /dashboard', () => {
  let app: INestApplication;
  let module: TestingModule;
  let productRepository: ProductRepository.Repository & {
    items: ProductEntity[];
  };
  let productCostRepository: ProductCostRepository.Repository & {
    items: ProductCostEntity[];
  };
  let orderRepository: OrderRepository.Repository & { items: OrderEntity[] };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ProductsModule,
        ProductCostsModule,
        OrdersModule,
        DashboardModule,
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    productRepository = module.get('ProductRepository');
    productCostRepository = module.get('ProductCostRepository');
    orderRepository = module.get('OrderRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    productRepository.items = [];
    productCostRepository.items = [];
    orderRepository.items = [];
  });

  it('should consolidate the period: product -> cost -> webhook -> dashboard', async () => {
    const server = app.getHttpServer();

    const shirt = await request(server)
      .post('/products')
      .send({ name: 'Camiseta Básica', sku: 'P-001', price: 4990 })
      .expect(201);
    const jeans = await request(server)
      .post('/products')
      .send({ name: 'Calça Jeans', sku: 'P-002', price: 12990 })
      .expect(201);
    await request(server)
      .put(`/product-costs/${shirt.body.data.id}`)
      .send({ unitCost: 1800 })
      .expect(200);
    await request(server)
      .put(`/product-costs/${jeans.body.data.id}`)
      .send({ unitCost: 5200 })
      .expect(200);

    await request(server)
      .post('/webhooks/orders')
      .send(webhookPayload('ORD-98432', '2025-02-10T14:32:00Z'))
      .expect(200);
    await request(server)
      .post('/webhooks/orders')
      .send(webhookPayload('ORD-98433', '2025-02-28T23:59:59Z'))
      .expect(200);
    await request(server)
      .post('/webhooks/orders')
      .send(webhookPayload('ORD-98434', '2025-03-01T00:00:00Z'))
      .expect(200);

    const res = await request(server)
      .get('/dashboard')
      .query({ startDate: '2025-02-01', endDate: '2025-02-28' })
      .expect(200);

    expect(res.body).toStrictEqual({
      data: {
        startDate: '2025-02-01T00:00:00.000Z',
        endDate: '2025-02-28T23:59:59.999Z',
        ordersCount: 2,
        revenue: 2 * 22970,
        totalCost: 2 * (2 * 1800 + 5200),
        profit: 2 * (22970 - 8800),
        skusWithoutCost: [],
      },
    });
  });

  it('should list the skus that have no cost registered', async () => {
    await request(app.getHttpServer())
      .post('/webhooks/orders')
      .send(webhookPayload('ORD-1', '2025-02-10T14:32:00Z'))
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/dashboard')
      .query({ startDate: '2025-02-10', endDate: '2025-02-10' })
      .expect(200);

    expect(res.body.data).toMatchObject({
      ordersCount: 1,
      revenue: 22970,
      totalCost: 0,
      profit: 22970,
      skusWithoutCost: ['P-001', 'P-002'],
    });
  });

  it('should return a error with 422 code when the dates are missing or invalid', async () => {
    let res = await request(app.getHttpServer()).get('/dashboard').expect(422);
    expect(res.body.message).toEqual([
      'startDate must be in the format YYYY-MM-DD',
      'startDate must be a valid ISO 8601 date string',
      'endDate must be in the format YYYY-MM-DD',
      'endDate must be a valid ISO 8601 date string',
    ]);

    res = await request(app.getHttpServer())
      .get('/dashboard')
      .query({ startDate: '2025-02-30', endDate: '2025-02-28' })
      .expect(422);
    expect(res.body.message).toEqual([
      'startDate must be a valid ISO 8601 date string',
    ]);
  });

  it('should return a error with 400 code when startDate is after endDate', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard')
      .query({ startDate: '2025-03-01', endDate: '2025-02-01' })
      .expect(400);

    expect(res.body).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'startDate must be before or equal to endDate',
    });
  });
});
