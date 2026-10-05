import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BadRequestErrorFilter } from './shared/infrastructure/exception-filters/bad-request-error/bad-request-error.filter';
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { EntityValidationErrorFilter } from './shared/infrastructure/exception-filters/entity-validation-error/entity-validation-error.filter';
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new BadRequestErrorFilter(),
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  );
}
