import { applyGlobalConfig } from '@/global-config';
import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { ProductCostsController } from '../../product-costs.controller';
import { ProductCostsModule } from '../../product-costs.module';

describe('ProductCostsController e2e tests - PUT /product-costs/:productId', () => {
  let app: INestApplication;
  let module: TestingModule;
  let productRepository: ProductRepository.Repository & {
    items: ProductEntity[];
  };
  let productCostRepository: ProductCostRepository.Repository & {
    items: ProductCostEntity[];
  };
  let product: ProductEntity;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ProductCostsModule],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    productRepository = module.get('ProductRepository');
    productCostRepository = module.get('ProductCostRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    productRepository.items = [];
    productCostRepository.items = [];
    product = new ProductEntity(ProductDataBuilder({}));
    await productRepository.insert(product);
  });

  it('should create the cost of a product', async () => {
    const res = await request(app.getHttpServer())
      .put(`/product-costs/${product.id}`)
      .send({ unitCost: 1800 })
      .expect(200);

    expect(Object.keys(res.body)).toStrictEqual(['data']);
    const cost = await productCostRepository.findByProductId(product.id);
    expect(cost?.unitCost).toBe(1800);
    expect(res.body.data).toStrictEqual(
      instanceToPlain(
        ProductCostsController.productCostToResponse(
          (cost as ProductCostEntity).toJSON(),
        ),
      ),
    );
  });

  it('should update the cost of a product keeping a single record', async () => {
    await request(app.getHttpServer())
      .put(`/product-costs/${product.id}`)
      .send({ unitCost: 1800 })
      .expect(200);

    const res = await request(app.getHttpServer())
      .put(`/product-costs/${product.id}`)
      .send({ unitCost: 2000 })
      .expect(200);

    expect(res.body.data.unitCost).toBe(2000);
    expect(productCostRepository.items).toHaveLength(1);
  });

  it('should return a error with 404 code when the product is not found', async () => {
    const res = await request(app.getHttpServer())
      .put('/product-costs/fakeId')
      .send({ unitCost: 1800 })
      .expect(404);

    expect(res.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Entity not found',
    });
  });

  it('should return a error with 422 code when the request body is invalid', async () => {
    const res = await request(app.getHttpServer())
      .put(`/product-costs/${product.id}`)
      .send({})
      .expect(422);

    expect(res.body.error).toBe('Unprocessable Entity');
    expect(res.body.message).toEqual([
      'unitCost must be an integer number',
      'unitCost must not be less than 0',
    ]);
  });

  it('should return a error with 422 code when the cost is not in cents', async () => {
    const res = await request(app.getHttpServer())
      .put(`/product-costs/${product.id}`)
      .send({ unitCost: 18.5 })
      .expect(422);

    expect(res.body.message).toEqual(['unitCost must be an integer number']);
  });
});
