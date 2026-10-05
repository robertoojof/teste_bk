import { UpsertProductCostUseCase } from '@/product-costs/application/usecases/upsert-product-cost.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpsertProductCostDto
  implements Omit<UpsertProductCostUseCase.Input, 'productId'>
{
  @ApiProperty({ description: 'Custo unitário em centavos', example: 1800 })
  @Min(0)
  @IsInt()
  unitCost: number;
}
