import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { OrdersController } from './orders.controller';
import { OrderWebhookMapperRegistry } from './webhooks/order-webhook-mapper.registry';
import { EcommerceOrderWebhookMapper } from './webhooks/platforms/ecommerce/ecommerce-order-webhook.mapper';
import { EcommerceOrderWebhookPayload } from './webhooks/platforms/ecommerce/ecommerce-order-webhook.payload';

@ApiTags('webhooks')
@Controller('webhooks/orders')
export class OrderWebhooksController {
  static readonly DEFAULT_PLATFORM = EcommerceOrderWebhookMapper.PLATFORM;

  @Inject(OrderWebhookMapperRegistry)
  private mapperRegistry: OrderWebhookMapperRegistry;

  @Inject(CreateOrderUseCase.UseCase)
  private createOrderUseCase: CreateOrderUseCase.UseCase;

  @ApiBody({ type: EcommerceOrderWebhookPayload })
  @ApiResponse({
    status: 200,
    description:
      'Pedido registrado (ou já existente, caso o webhook seja reenviado)',
  })
  @ApiResponse({ status: 422, description: 'Payload do webhook inválido' })
  @HttpCode(200)
  @Post()
  async receive(@Body() payload: unknown) {
    return this.receiveFromPlatform(
      OrderWebhooksController.DEFAULT_PLATFORM,
      payload,
    );
  }

  @ApiBody({
    type: EcommerceOrderWebhookPayload,
    description: 'O formato do corpo depende da plataforma informada',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pedido registrado (ou já existente, caso o webhook seja reenviado)',
  })
  @ApiResponse({ status: 404, description: 'Plataforma não suportada' })
  @ApiResponse({ status: 422, description: 'Payload do webhook inválido' })
  @HttpCode(200)
  @Post(':platform')
  async receiveFromPlatform(
    @Param('platform') platform: string,
    @Body() payload: unknown,
  ) {
    const mapper = this.mapperRegistry.resolve(platform);
    const input = mapper.toCreateOrderInput(payload);
    const output = await this.createOrderUseCase.execute(input);
    return OrdersController.orderToResponse(output);
  }
}
