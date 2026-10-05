import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class EcommerceBuyerPayload {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  @IsNotEmpty()
  buyerEmail: string;
}

export class EcommerceLineItemPayload {
  @ApiProperty({ example: 'P-001' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ example: 'Camiseta Básica' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ example: 2 })
  @Min(1)
  @IsInt()
  qty: number;

  @ApiProperty({ example: 49.9 })
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  unitPrice: number;
}

export class EcommerceOrderWebhookPayload {
  @ApiProperty({ example: 'ORD-98432' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: EcommerceBuyerPayload })
  @ValidateNested()
  @Type(() => EcommerceBuyerPayload)
  @IsNotEmpty()
  buyer: EcommerceBuyerPayload;

  @ApiProperty({ type: [EcommerceLineItemPayload] })
  @ValidateNested({ each: true })
  @Type(() => EcommerceLineItemPayload)
  @ArrayNotEmpty()
  @IsArray()
  lineItems: EcommerceLineItemPayload[];

  @ApiProperty({ example: 229.7 })
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount: number;

  @ApiProperty({ example: '2025-02-10T14:32:00Z' })
  @IsISO8601()
  createdAt: string;
}
