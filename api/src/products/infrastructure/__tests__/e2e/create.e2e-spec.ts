import { applyGlobalConfig } from '@/global-config';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { CreateProductDto } from '../../dtos/create-product.dto';
import { ProductsController } from '../../products.controller';
import { ProductsModule } from '../../products.module';

describe('ProductsController e2e tests - POST /products', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository & { items: unknown[] };
  let createProductDto: CreateProductDto;

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
    createProductDto = {
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
    };
  });

  it('should create a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    expect(Object.keys(res.body)).toStrictEqual(['data']);
    const product = await repository.findById(res.body.data.id);
    const presenter = ProductsController.productToResponse(product.toJSON());
    expect(res.body.data).toStrictEqual(instanceToPlain(presenter));
  });

  it('should return a error with 422 code when the request body is invalid', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({})
      .expect(422);

    expect(res.body.error).toBe('Unprocessable Entity');
    expect(res.body.message).toEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
      'sku should not be empty',
      'sku must be a string',
      'sku must be shorter than or equal to 50 characters',
      'price must be an integer number',
      'price must not be less than 0',
    ]);
  });

  it('should return a error with 422 code when the price is not in cents', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ ...createProductDto, price: 49.9 })
      .expect(422);

    expect(res.body.message).toEqual(['price must be an integer number']);
  });

  it('should return a error with 422 code with invalid field provided', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ ...createProductDto, xpto: 'fake' })
      .expect(422);

    expect(res.body.message).toEqual(['property xpto should not exist']);
  });

  it('should return a error with 409 code when the sku is duplicated', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(409);

    expect(res.body).toStrictEqual({
      statusCode: 409,
      error: 'Conflict',
      message: 'SKU already used',
    });
  });
});
