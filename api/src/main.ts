import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BK Dashboard API')
    .setDescription(
      'API de produtos, custos, pedidos (webhook) e dashboard de faturamento',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);
  await app.listen(process.env.PORT ?? 3000, process.env.ADDRESS ?? '0.0.0.0');
}
void bootstrap();
