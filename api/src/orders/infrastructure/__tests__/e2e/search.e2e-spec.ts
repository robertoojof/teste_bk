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

describe('OrdersController e2e tests - GET /orders', () => {
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

  const toResponse = (entity: OrderEntity) =>
    instanceToPlain(OrdersController.orderToResponse(entity.toJSON()));

  it('should return the most recent orders first', async () => {
    const entities = ['2025-02-08', '2025-02-10', '2025-02-09'].map(
      date => new OrderEntity(OrderDataBuilder({ placedAt: new Date(date) })),
    );
    repository.items = [...entities];

    const res = await request(app.getHttpServer()).get('/orders').expect(200);

    expect(res.body).toStrictEqual({
      data: [entities[1], entities[2], entities[0]].map(toResponse),
      meta: { total: 3, currentPage: 1, perPage: 15, lastPage: 1 },
    });
  });

  it('should filter and paginate the orders', async () => {
    const entities = [
      new OrderEntity(
        OrderDataBuilder({
          externalId: 'ORD-1',
          customer: { name: 'Maria Souza', email: 'maria@email.com' },
          placedAt: new Date('2025-02-10'),
        }),
      ),
      new OrderEntity(
        OrderDataBuilder({
          externalId: 'ORD-2',
          customer: { name: 'Mariana Lima', email: 'mari@email.com' },
          placedAt: new Date('2025-02-09'),
        }),
      ),
      new OrderEntity(
        OrderDataBuilder({
          externalId: 'ORD-3',
          customer: { name: 'João Silva', email: 'joao@email.com' },
        }),
      ),
    ];
    repository.items = [...entities];

    const res = await request(app.getHttpServer())
      .get('/orders')
      .query({ filter: 'mari', page: 2, perPage: 1 })
      .expect(200);

    expect(res.body).toStrictEqual({
      data: [toResponse(entities[1])],
      meta: { total: 2, currentPage: 2, perPage: 1, lastPage: 2 },
    });
  });

  it('should return a error with 422 code when an invalid query param is provided', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders')
      .query({ fakeId: 10 })
      .expect(422);

    expect(res.body.message).toEqual(['property fakeId should not exist']);
  });
});
