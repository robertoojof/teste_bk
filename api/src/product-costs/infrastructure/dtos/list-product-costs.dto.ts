import { ListProductCostsUseCase } from '@/product-costs/application/usecases/list-product-costs.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListProductCostsDto implements ListProductCostsUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Coluna do produto usada para ordenar: "name", "sku", "price" ou "createdAt"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({ description: 'Filtra pelo nome ou SKU do produto' })
  @IsOptional()
  filter?: string;
}
