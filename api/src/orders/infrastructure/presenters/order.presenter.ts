import { OrderOutput } from '@/orders/application/dtos/order-output';
import { ListOrdersUseCase } from '@/orders/application/usecases/list-orders.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class OrderCustomerPresenter {
  @ApiProperty({ description: 'Nome do cliente' })
  name: string;

  @ApiProperty({ description: 'E-mail do cliente' })
  email: string;
}

export class OrderItemPresenter {
  @ApiProperty({ description: 'SKU do produto' })
  sku: string;

  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'Quantidade' })
  quantity: number;

  @ApiProperty({ description: 'Preço unitário em centavos' })
  unitPrice: number;
}

export class OrderPresenter {
  @ApiProperty({ description: 'Identificação do pedido' })
  id: string;

  @ApiProperty({ description: 'Código do pedido na plataforma de origem' })
  externalId: string;

  @ApiProperty({ description: 'Plataforma de origem do pedido' })
  platform: string;

  @ApiProperty({ description: 'Cliente', type: OrderCustomerPresenter })
  customer: OrderCustomerPresenter;

  @ApiProperty({ description: 'Itens do pedido', type: [OrderItemPresenter] })
  items: OrderItemPresenter[];

  @ApiProperty({ description: 'Valor total em centavos' })
  totalAmount: number;

  @ApiProperty({ description: 'Data em que o pedido foi realizado' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  placedAt: Date;

  @ApiProperty({ description: 'Data em que o pedido foi recebido' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: OrderOutput) {
    this.id = output.id;
    this.externalId = output.externalId;
    this.platform = output.platform;
    this.customer = output.customer;
    this.items = output.items;
    this.totalAmount = output.totalAmount;
    this.placedAt = output.placedAt;
    this.createdAt = output.createdAt;
  }
}

export class OrderCollectionPresenter extends CollectionPresenter {
  data: OrderPresenter[];

  constructor(output: ListOrdersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new OrderPresenter(item));
  }
}
