import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ProductCostOutput } from '../application/dtos/product-cost-output';
import { ListProductCostsUseCase } from '../application/usecases/list-product-costs.usecase';
import { UpsertProductCostUseCase } from '../application/usecases/upsert-product-cost.usecase';
import { ListProductCostsDto } from './dtos/list-product-costs.dto';
import { UpsertProductCostDto } from './dtos/upsert-product-cost.dto';
import {
  ProductCostPresenter,
  ProductWithCostCollectionPresenter,
  ProductWithCostPresenter,
} from './presenters/product-cost.presenter';

@ApiTags('product-costs')
@Controller('product-costs')
export class ProductCostsController {
  @Inject(UpsertProductCostUseCase.UseCase)
  private upsertProductCostUseCase: UpsertProductCostUseCase.UseCase;

  @Inject(ListProductCostsUseCase.UseCase)
  private listProductCostsUseCase: ListProductCostsUseCase.UseCase;

  static productCostToResponse(output: ProductCostOutput) {
    return new ProductCostPresenter(output);
  }

  static listProductCostsToResponse(output: ListProductCostsUseCase.Output) {
    return new ProductWithCostCollectionPresenter(output);
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
          items: { $ref: getSchemaPath(ProductWithCostPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @Get()
  async search(@Query() searchParams: ListProductCostsDto) {
    const output = await this.listProductCostsUseCase.execute(searchParams);
    return ProductCostsController.listProductCostsToResponse(output);
  }

  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Put(':productId')
  async upsert(
    @Param('productId') productId: string,
    @Body() upsertProductCostDto: UpsertProductCostDto,
  ) {
    const output = await this.upsertProductCostUseCase.execute({
      productId,
      ...upsertProductCostDto,
    });
    return ProductCostsController.productCostToResponse(output);
  }
}
