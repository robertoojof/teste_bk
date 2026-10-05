import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { ListProductsUseCase } from '../application/usecases/list-products.usecase';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductInMemoryRepository } from './database/in-memory/repositories/product-in-memory.repository';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductInMemoryRepository,
    },
    {
      provide: CreateProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new CreateProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: GetProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new GetProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: ListProductsUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new ListProductsUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductsModule {}
