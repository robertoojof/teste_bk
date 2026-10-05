import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrdersModule } from '@/orders/infrastructure/orders.module';
import { UpsertProductCostUseCase } from '@/product-costs/application/usecases/upsert-product-cost.usecase';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductCostsModule } from '@/product-costs/infrastructure/product-costs.module';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductsModule } from '@/products/infrastructure/products.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    ProductsModule,
    ProductCostsModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: SeedService,
      useFactory: (
        envConfig: EnvConfigService,
        productRepository: ProductRepository.Repository,
        productCostRepository: ProductCostRepository.Repository,
        orderRepository: OrderRepository.Repository,
      ) => {
        return new SeedService(
          envConfig,
          new CreateProductUseCase.UseCase(productRepository),
          new UpsertProductCostUseCase.UseCase(
            productRepository,
            productCostRepository,
          ),
          new CreateOrderUseCase.UseCase(orderRepository),
        );
      },
      inject: [
        EnvConfigService,
        'ProductRepository',
        'ProductCostRepository',
        'OrderRepository',
      ],
    },
  ],
})
export class SeedModule {}
