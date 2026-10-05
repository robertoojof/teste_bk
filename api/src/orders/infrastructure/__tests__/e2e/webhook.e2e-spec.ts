import { applyGlobalConfig } from '@/global-config';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { OrdersController } from '../../orders.controller';
import { OrdersModule } from '../../orders.module';

function payloadFromSpec() {
  return {
    id: 'ORD-98432',
    buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
      { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
    ],
    totalAmount: 229.7,
    createdAt: '2025-02-10T14:32:00Z',
  };
}

describe('OrderWebhooksController e2e tests - POST /webhooks/orders', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: OrderRepository.Repository & { items: OrderEntity[] };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get('OrderRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    repository.items = [];
  });

  it.each(['/webhooks/orders', '/webhooks/orders/ecommerce'])(
    'should register the order of the spec payload (%s)',
    async url => {
      const res = await request(app.getHttpServer())
        .post(url)
        .send(payloadFromSpec())
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const order = await repository.findById(res.body.data.id);
      expect(res.body.data).toStrictEqual(
        instanceToPlain(OrdersController.orderToResponse(order.toJSON())),
      );
      expect(res.body.data).toMatchObject({
        externalId: 'ORD-98432',
        platform: 'ecommerce',
        customer: { name: 'Maria Souza', email: 'maria@email.com' },
        items: [
          {
            sku: 'P-001',
            name: 'Camiseta Básica',
            quantity: 2,
            unitPrice: 4990,
          },
          { sku: 'P-002', name: 'Calça Jeans', quantity: 1, unitPrice: 12990 },
        ],
        totalAmount: 22970,
        placedAt: '2025-02-10T14:32:00.000Z',
      });
    },
  );

  it('should not duplicate the order when the webhook is resent', async () => {
    const first = await request(app.getHttpServer())
      .post('/webhooks/orders')
      .send(payloadFromSpec())
      .expect(200);
    const second = await request(app.getHttpServer())
      .post('/webhooks/orders')
      .send(payloadFromSpec())
      .expect(200);

    expect(second.body.data.id).toBe(first.body.data.id);
    expect(repository.items).toHaveLength(1);
  });

  it('should return a error with 404 code when the platform is not supported', async () => {
    const res = await request(app.getHttpServer())
      .post('/webhooks/orders/shopify')
      .send(payloadFromSpec())
      .expect(404);

    expect(res.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Platform shopify is not supported',
    });
  });

  it('should return a error with 422 code when the payload is invalid', async () => {
    const res = await request(app.getHttpServer())
      .post('/webhooks/orders')
      .send({ ...payloadFromSpec(), buyer: { buyerName: 'Maria' } })
      .expect(422);

    expect(res.body).toStrictEqual({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: [
        'buyer.buyerEmail should not be empty',
        'buyer.buyerEmail must be an email',
      ],
    });
    expect(repository.items).toHaveLength(0);
  });

  it('should return a error with 422 code when the total does not match the items', async () => {
    const res = await request(app.getHttpServer())
      .post('/webhooks/orders')
      .send({ ...payloadFromSpec(), totalAmount: 300 })
      .expect(422);

    expect(res.body).toStrictEqual({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: ['totalAmount must be equal to the sum of the items'],
    });
    expect(repository.items).toHaveLength(0);
  });
});
