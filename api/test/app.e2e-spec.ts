import { AppModule } from '@/app.module';
import { applyGlobalConfig } from '@/global-config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should bootstrap every module of the application', async () => {
    const server = app.getHttpServer();

    await request(server).get('/products').expect(200);
    await request(server).get('/product-costs').expect(200);
    await request(server).get('/orders').expect(200);
    await request(server)
      .get('/dashboard')
      .query({ startDate: '2025-02-01', endDate: '2025-02-28' })
      .expect(200);
  });

  it('should not seed outside development', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);

    expect(res.body.meta.total).toBe(0);
  });
});
