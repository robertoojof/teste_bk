import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { OrderOutput } from '../application/dtos/order-output';
import { GetOrderUseCase } from '../application/usecases/get-order.usecase';
import { ListOrdersUseCase } from '../application/usecases/list-orders.usecase';
import { ListOrdersDto } from './dtos/list-orders.dto';
import {
  OrderCollectionPresenter,
  OrderPresenter,
} from './presenters/order.presenter';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  @Inject(GetOrderUseCase.UseCase)
  private getOrderUseCase: GetOrderUseCase.UseCase;

  @Inject(ListOrdersUseCase.UseCase)
  private listOrdersUseCase: ListOrdersUseCase.UseCase;

  static orderToResponse(output: OrderOutput) {
    return new OrderPresenter(output);
  }

  static listOrdersToResponse(output: ListOrdersUseCase.Output) {
    return new OrderCollectionPresenter(output);
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
          items: { $ref: getSchemaPath(OrderPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @Get()
  async search(@Query() searchParams: ListOrdersDto) {
    const output = await this.listOrdersUseCase.execute(searchParams);
    return OrdersController.listOrdersToResponse(output);
  }

  @ApiResponse({ status: 404, description: 'Id não encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getOrderUseCase.execute({ id });
    return OrdersController.orderToResponse(output);
  }
}
