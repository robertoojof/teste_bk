import { applyGlobalConfig } from '@/global-config';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { OrdersController } from '../../orders.controller';
import { OrdersModule } from '../../orders.module';

describe('OrdersController e2e tests - GET /orders/:id', () => {
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

  it('should get an order with its items', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    await repository.insert(entity);

    const res = await request(app.getHttpServer())
      .get(`/orders/${entity.id}`)
      .expect(200);

    expect(res.body.data).toStrictEqual(
      instanceToPlain(OrdersController.orderToResponse(entity.toJSON())),
    );
    expect(res.body.data.items).toHaveLength(entity.items.length);
  });

  it('should return a error with 404 code when the order is not found', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/fakeId')
      .expect(404);

    expect(res.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Entity not found',
    });
  });
});
