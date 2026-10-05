import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { EntityValidationErrorFilter } from '../../entity-validation-error.filter';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError({
      name: ['name should not be empty'],
      price: ['price must be a positive number'],
    });
  }
}

describe('EntityValidationErrorFilter (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(new EntityValidationErrorFilter()).toBeDefined();
  });

  it('should catch an EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: [
          'name should not be empty',
          'price must be a positive number',
        ],
      });
  });
});
