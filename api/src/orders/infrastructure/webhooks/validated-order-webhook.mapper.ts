import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { flattenValidationErrors } from '@/shared/domain/validators/flatten-validation-errors';
import { UnprocessableEntityException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { OrderWebhookMapper } from './order-webhook-mapper';

export abstract class ValidatedOrderWebhookMapper<Payload extends object>
  implements OrderWebhookMapper
{
  abstract readonly platform: string;

  protected abstract readonly payloadClass: ClassConstructor<Payload>;

  protected abstract map(payload: Payload): CreateOrderUseCase.Input;

  toCreateOrderInput(body: unknown): CreateOrderUseCase.Input {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new UnprocessableEntityException(['payload must be an object']);
    }

    const payload = plainToInstance(this.payloadClass, body);
    const errors = validateSync(payload);
    if (errors.length) {
      throw new UnprocessableEntityException(
        Object.values(flattenValidationErrors(errors)).flat(),
      );
    }

    return this.map(payload);
  }
}
