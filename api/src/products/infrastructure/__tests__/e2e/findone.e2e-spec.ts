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

describe('ProductsController e2e tests - GET /products/:id', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository & { items: ProductEntity[] };
  let entity: ProductEntity;

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

  beforeEach(async () => {
    repository.items = [];
    entity = new ProductEntity(ProductDataBuilder({}));
    await repository.insert(entity);
  });

  it('should get a product', async () => {
    const res = await request(app.getHttpServer())
      .get(`/products/${entity.id}`)
      .expect(200);

    expect(Object.keys(res.body)).toStrictEqual(['data']);
    expect(res.body.data).toStrictEqual(
      instanceToPlain(ProductsController.productToResponse(entity.toJSON())),
    );
  });

  it('should return a error with 404 code when the product is not found', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/fakeId')
      .expect(404);

    expect(res.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Entity not found',
    });
  });
});
