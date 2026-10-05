import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';

export namespace GetOrderUseCase {
  export type Input = {
    id: string;
  };

  export type Output = OrderOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.orderRepository.findById(input.id);
      return OrderOutputMapper.toOutput(entity);
    }
  }
}
