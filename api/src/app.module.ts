import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/infrastructure/dashboard.module';
import { OrdersModule } from './orders/infrastructure/orders.module';
import { ProductCostsModule } from './product-costs/infrastructure/product-costs.module';
import { ProductsModule } from './products/infrastructure/products.module';
import { SeedModule } from './seed/infrastructure/seed.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    ProductsModule,
    ProductCostsModule,
    OrdersModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
