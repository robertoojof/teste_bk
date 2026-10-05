import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, Matches } from 'class-validator';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export class GetDashboardSummaryDto {
  @ApiProperty({
    description: 'Data inicial do período (inclusive), no formato YYYY-MM-DD',
    example: '2025-01-01',
  })
  @IsISO8601({ strict: true })
  @Matches(DATE_ONLY, { message: 'startDate must be in the format YYYY-MM-DD' })
  startDate: string;

  @ApiProperty({
    description: 'Data final do período (inclusive), no formato YYYY-MM-DD',
    example: '2025-01-31',
  })
  @IsISO8601({ strict: true })
  @Matches(DATE_ONLY, { message: 'endDate must be in the format YYYY-MM-DD' })
  endDate: string;
}
