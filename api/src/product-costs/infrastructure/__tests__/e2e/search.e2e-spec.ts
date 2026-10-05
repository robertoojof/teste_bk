import { applyGlobalConfig } from '@/global-config';
import { ProductWithCostOutputMapper } from '@/product-costs/application/dtos/product-with-cost-output';
import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { ProductWithCostPresenter } from '../../presenters/product-cost.presenter';
import { ProductCostsModule } from '../../product-costs.module';

describe('ProductCostsController e2e tests - GET /product-costs', () => {
  let app: INestApplication;
  let module: TestingModule;
  let productRepository: ProductRepository.Repository & {
    items: ProductEntity[];
  };
  let productCostRepository: ProductCostRepository.Repository & {
    items: ProductCostEntity[];
  };

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

  beforeEach(() => {
    productRepository.items = [];
    productCostRepository.items = [];
  });

  it('should list the products with their costs', async () => {
    const createdAt = new Date();
    const withCost = new ProductEntity(
      ProductDataBuilder({ sku: 'P-001', price: 4990, createdAt }),
    );
    const withoutCost = new ProductEntity(
      ProductDataBuilder({
        sku: 'P-002',
        createdAt: new Date(createdAt.getTime() + 1),
      }),
    );
    productRepository.items = [withCost, withoutCost];
    const cost = new ProductCostEntity({
      productId: withCost.id,
      unitCost: 1800,
    });
    productCostRepository.items = [cost];

    const res = await request(app.getHttpServer())
      .get('/product-costs')
      .expect(200);

    expect(res.body).toStrictEqual({
      data: [
        ProductWithCostOutputMapper.toOutput(withoutCost, null),
        ProductWithCostOutputMapper.toOutput(withCost, cost),
      ].map(item => instanceToPlain(new ProductWithCostPresenter(item))),
      meta: { total: 2, currentPage: 1, perPage: 15, lastPage: 1 },
    });
    expect(res.body.data[1]).toMatchObject({ unitCost: 1800, margin: 3190 });
    expect(res.body.data[0]).toMatchObject({ unitCost: null, margin: null });
  });

  it('should return a error with 422 code when an invalid query param is provided', async () => {
    const res = await request(app.getHttpServer())
      .get('/product-costs')
      .query({ fakeId: 10 })
      .expect(422);

    expect(res.body.message).toEqual(['property fakeId should not exist']);
  });
});
