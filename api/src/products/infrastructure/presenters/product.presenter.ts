import { ProductOutput } from '@/products/application/dtos/product-output';
import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductPresenter {
  @ApiProperty({ description: 'Identificação do produto' })
  id: string;

  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'SKU do produto' })
  sku: string;

  @ApiProperty({ description: 'Preço de venda em centavos' })
  price: number;

  @ApiProperty({ description: 'Data de criação do produto' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: ProductOutput) {
    this.id = output.id;
    this.name = output.name;
    this.sku = output.sku;
    this.price = output.price;
    this.createdAt = output.createdAt;
  }
}

export class ProductCollectionPresenter extends CollectionPresenter {
  data: ProductPresenter[];

  constructor(output: ListProductsUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new ProductPresenter(item));
  }
}
