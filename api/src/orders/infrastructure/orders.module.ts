import { Module } from '@nestjs/common';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { GetOrderUseCase } from '../application/usecases/get-order.usecase';
import { ListOrdersUseCase } from '../application/usecases/list-orders.usecase';
import { OrderRepository } from '../domain/repositories/order.repository';
import { OrderInMemoryRepository } from './database/in-memory/repositories/order-in-memory.repository';
import { OrderWebhooksController } from './order-webhooks.controller';
import { OrdersController } from './orders.controller';
import { OrderWebhookMapperRegistry } from './webhooks/order-webhook-mapper.registry';
import { EcommerceOrderWebhookMapper } from './webhooks/platforms/ecommerce/ecommerce-order-webhook.mapper';

@Module({
  controllers: [OrdersController, OrderWebhooksController],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: OrderInMemoryRepository,
    },
    {
      provide: OrderWebhookMapperRegistry,
      useFactory: () => {
        return new OrderWebhookMapperRegistry([
          new EcommerceOrderWebhookMapper(),
        ]);
      },
    },
    {
      provide: CreateOrderUseCase.UseCase,
      useFactory: (orderRepository: OrderRepository.Repository) => {
        return new CreateOrderUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
    {
      provide: GetOrderUseCase.UseCase,
      useFactory: (orderRepository: OrderRepository.Repository) => {
        return new GetOrderUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
    {
      provide: ListOrdersUseCase.UseCase,
      useFactory: (orderRepository: OrderRepository.Repository) => {
        return new ListOrdersUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
  ],
  exports: ['OrderRepository'],
})
export class OrdersModule {}
