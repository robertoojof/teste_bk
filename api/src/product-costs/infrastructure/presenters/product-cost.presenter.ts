import { ProductCostOutput } from '@/product-costs/application/dtos/product-cost-output';
import { ProductWithCostOutput } from '@/product-costs/application/dtos/product-with-cost-output';
import { ListProductCostsUseCase } from '@/product-costs/application/usecases/list-product-costs.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductCostPresenter {
  @ApiProperty({ description: 'Identificação do custo' })
  id: string;

  @ApiProperty({ description: 'Identificação do produto' })
  productId: string;

  @ApiProperty({ description: 'Custo unitário em centavos' })
  unitCost: number;

  @ApiProperty({ description: 'Data de criação do custo' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'Data da última alteração do custo' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: ProductCostOutput) {
    this.id = output.id;
    this.productId = output.productId;
    this.unitCost = output.unitCost;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}

export class ProductWithCostPresenter {
  @ApiProperty({ description: 'Identificação do produto' })
  productId: string;

  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'SKU do produto' })
  sku: string;

  @ApiProperty({ description: 'Preço de venda em centavos' })
  price: number;

  @ApiProperty({
    description: 'Custo unitário em centavos (null se não cadastrado)',
    type: Number,
    nullable: true,
  })
  unitCost: number | null;

  @ApiProperty({
    description: 'Margem (preço - custo) em centavos (null se sem custo)',
    type: Number,
    nullable: true,
  })
  margin: number | null;

  @ApiProperty({
    description: 'Data da última alteração do custo',
    type: String,
    nullable: true,
  })
  @Transform(
    ({ value }: { value: Date | null }) => value?.toISOString() ?? null,
  )
  costUpdatedAt: Date | null;

  constructor(output: ProductWithCostOutput) {
    this.productId = output.productId;
    this.name = output.name;
    this.sku = output.sku;
    this.price = output.price;
    this.unitCost = output.unitCost;
    this.margin = output.margin;
    this.costUpdatedAt = output.costUpdatedAt;
  }
}

export class ProductWithCostCollectionPresenter extends CollectionPresenter {
  data: ProductWithCostPresenter[];

  constructor(output: ListProductCostsUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new ProductWithCostPresenter(item));
  }
}
