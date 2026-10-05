import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ProductOutput } from '../application/dtos/product-output';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { ListProductsUseCase } from '../application/usecases/list-products.usecase';
import { CreateProductDto } from './dtos/create-product.dto';
import { ListProductsDto } from './dtos/list-products.dto';
import {
  ProductCollectionPresenter,
  ProductPresenter,
} from './presenters/product.presenter';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Inject(CreateProductUseCase.UseCase)
  private createProductUseCase: CreateProductUseCase.UseCase;

  @Inject(GetProductUseCase.UseCase)
  private getProductUseCase: GetProductUseCase.UseCase;

  @Inject(ListProductsUseCase.UseCase)
  private listProductsUseCase: ListProductsUseCase.UseCase;

  static productToResponse(output: ProductOutput) {
    return new ProductPresenter(output);
  }

  static listProductsToResponse(output: ListProductsUseCase.Output) {
    return new ProductCollectionPresenter(output);
  }

  @ApiResponse({ status: 409, description: 'SKU já cadastrado' })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const output = await this.createProductUseCase.execute(createProductDto);
    return ProductsController.productToResponse(output);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            currentPage: { type: 'number' },
            lastPage: { type: 'number' },
            perPage: { type: 'number' },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ProductPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @Get()
  async search(@Query() searchParams: ListProductsDto) {
    const output = await this.listProductsUseCase.execute(searchParams);
    return ProductsController.listProductsToResponse(output);
  }

  @ApiResponse({ status: 404, description: 'Id não encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getProductUseCase.execute({ id });
    return ProductsController.productToResponse(output);
  }
}
