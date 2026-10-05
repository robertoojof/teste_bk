import { ListOrdersUseCase } from '@/orders/application/usecases/list-orders.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListOrdersDto implements ListOrdersUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Coluna definida para ordenar os dados: "placedAt", "totalAmount" ou "createdAt"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Filtra pelo código do pedido, nome ou e-mail do cliente',
  })
  @IsOptional()
  filter?: string;
}
