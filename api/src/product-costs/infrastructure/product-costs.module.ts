import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductsModule } from '@/products/infrastructure/products.module';
import { Module } from '@nestjs/common';
import { ListProductCostsUseCase } from '../application/usecases/list-product-costs.usecase';
import { UpsertProductCostUseCase } from '../application/usecases/upsert-product-cost.usecase';
import { ProductCostRepository } from '../domain/repositories/product-cost.repository';
import { ProductCostInMemoryRepository } from './database/in-memory/repositories/product-cost-in-memory.repository';
import { ProductCostsController } from './product-costs.controller';

@Module({
  imports: [ProductsModule],
  controllers: [ProductCostsController],
  providers: [
    {
      provide: 'ProductCostRepository',
      useClass: ProductCostInMemoryRepository,
    },
    {
      provide: UpsertProductCostUseCase.UseCase,
      useFactory: (
        productRepository: ProductRepository.Repository,
        productCostRepository: ProductCostRepository.Repository,
      ) => {
        return new UpsertProductCostUseCase.UseCase(
          productRepository,
          productCostRepository,
        );
      },
      inject: ['ProductRepository', 'ProductCostRepository'],
    },
    {
      provide: ListProductCostsUseCase.UseCase,
      useFactory: (
        productRepository: ProductRepository.Repository,
        productCostRepository: ProductCostRepository.Repository,
      ) => {
        return new ListProductCostsUseCase.UseCase(
          productRepository,
          productCostRepository,
        );
      },
      inject: ['ProductRepository', 'ProductCostRepository'],
    },
  ],
  exports: ['ProductCostRepository'],
})
export class ProductCostsModule {}
