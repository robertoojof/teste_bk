import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto implements CreateProductUseCase.Input {
  @ApiProperty({ description: 'Nome do produto', example: 'Camiseta Básica' })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'SKU do produto (mesmo código enviado no webhook)',
    example: 'P-001',
  })
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Preço de venda em centavos',
    example: 4990,
  })
  @Min(0)
  @IsInt()
  price: number;
}
