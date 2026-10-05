import { DashboardSummaryOutput } from '@/dashboard/application/dtos/dashboard-summary-output';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DashboardSummaryPresenter {
  @ApiProperty({ description: 'Início do período consultado' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  startDate: Date;

  @ApiProperty({ description: 'Fim do período consultado' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  endDate: Date;

  @ApiProperty({ description: 'Quantidade de pedidos' })
  ordersCount: number;

  @ApiProperty({ description: 'Faturamento total em centavos' })
  revenue: number;

  @ApiProperty({ description: 'Custo total dos produtos vendidos em centavos' })
  totalCost: number;

  @ApiProperty({ description: 'Lucro (faturamento - custo) em centavos' })
  profit: number;

  @ApiProperty({
    description: 'SKUs vendidos no período sem custo cadastrado',
    type: [String],
  })
  skusWithoutCost: string[];

  constructor(output: DashboardSummaryOutput) {
    this.startDate = output.startDate;
    this.endDate = output.endDate;
    this.ordersCount = output.ordersCount;
    this.revenue = output.revenue;
    this.totalCost = output.totalCost;
    this.profit = output.profit;
    this.skusWithoutCost = output.skusWithoutCost;
  }
}
