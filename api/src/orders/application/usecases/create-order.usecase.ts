import { OrderEntity, OrderProps } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';

export namespace CreateOrderUseCase {
  export type Input = Omit<OrderProps, 'createdAt'>;

  export type Output = OrderOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const existing = await this.orderRepository.findByExternalId(
        input.platform,
        input.externalId,
      );
      if (existing) {
        return OrderOutputMapper.toOutput(existing);
      }

      const entity = new OrderEntity({
        externalId: input.externalId,
        platform: input.platform,
        customer: input.customer,
        items: input.items,
        totalAmount: input.totalAmount,
        placedAt: input.placedAt,
      });

      await this.orderRepository.insert(entity);
      return OrderOutputMapper.toOutput(entity);
    }
  }
}
