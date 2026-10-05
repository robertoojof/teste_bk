import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrdersModule } from '@/orders/infrastructure/orders.module';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductCostsModule } from '@/product-costs/infrastructure/product-costs.module';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductsModule } from '@/products/infrastructure/products.module';
import { Module } from '@nestjs/common';
import { GetDashboardSummaryUseCase } from '../application/usecases/get-dashboard-summary.usecase';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [OrdersModule, ProductsModule, ProductCostsModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: GetDashboardSummaryUseCase.UseCase,
      useFactory: (
        orderRepository: OrderRepository.Repository,
        productRepository: ProductRepository.Repository,
        productCostRepository: ProductCostRepository.Repository,
      ) => {
        return new GetDashboardSummaryUseCase.UseCase(
          orderRepository,
          productRepository,
          productCostRepository,
        );
      },
      inject: ['OrderRepository', 'ProductRepository', 'ProductCostRepository'],
    },
  ],
})
export class DashboardModule {}
