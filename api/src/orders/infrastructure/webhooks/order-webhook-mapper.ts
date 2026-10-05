import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';

export interface OrderWebhookMapper {
  readonly platform: string;

  toCreateOrderInput(payload: unknown): CreateOrderUseCase.Input;
}
