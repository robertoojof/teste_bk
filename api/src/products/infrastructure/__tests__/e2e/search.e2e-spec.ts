import { applyGlobalConfig } from '@/global-config';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { ProductsController } from '../../products.controller';
import { ProductsModule } from '../../products.module';

describe('ProductsController e2e tests - GET /products', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository & { items: ProductEntity[] };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get('ProductRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    repository.items = [];
  });

  it('should return the products ordered by createdAt', async () => {
    const createdAt = new Date();
    const entities = [0, 1, 2].map(
      index =>
        new ProductEntity(
          ProductDataBuilder({
            sku: `P-00${index}`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        ),
    );
    repository.items = [...entities];

    const res = await request(app.getHttpServer()).get('/products').expect(200);

    expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
    expect(res.body).toStrictEqual({
      data: [...entities]
        .reverse()
        .map(item =>
          instanceToPlain(ProductsController.productToResponse(item.toJSON())),
        ),
      meta: { total: 3, currentPage: 1, perPage: 15, lastPage: 1 },
    });
  });

  it('should return the products filtered, sorted and paginated', async () => {
    const entities = ['a', 'AA', 'Aa', 'b', 'c'].map(
      (name, index) =>
        new ProductEntity(ProductDataBuilder({ name, sku: `P-00${index}` })),
    );
    repository.items = [...entities];

    const res = await request(app.getHttpServer())
      .get('/products')
      .query({ page: 1, perPage: 2, sort: 'name', sortDir: 'asc', filter: 'a' })
      .expect(200);

    expect(res.body).toStrictEqual({
      data: [entities[1], entities[2]].map(item =>
        instanceToPlain(ProductsController.productToResponse(item.toJSON())),
      ),
      meta: { total: 3, currentPage: 1, perPage: 2, lastPage: 2 },
    });
  });

  it('should return a error with 422 code when an invalid query param is provided', async () => {
    const res = await request(app.getHttpServer())
      .get('/products')
      .query({ fakeId: 10 })
      .expect(422);

    expect(res.body.error).toBe('Unprocessable Entity');
    expect(res.body.message).toEqual(['property fakeId should not exist']);
  });
});
