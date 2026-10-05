import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardSummaryOutput } from '../application/dtos/dashboard-summary-output';
import { GetDashboardSummaryUseCase } from '../application/usecases/get-dashboard-summary.usecase';
import { GetDashboardSummaryDto } from './dtos/get-dashboard-summary.dto';
import { DashboardSummaryPresenter } from './presenters/dashboard-summary.presenter';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  @Inject(GetDashboardSummaryUseCase.UseCase)
  private getDashboardSummaryUseCase: GetDashboardSummaryUseCase.UseCase;

  static summaryToResponse(output: DashboardSummaryOutput) {
    return new DashboardSummaryPresenter(output);
  }

  static toPeriod(
    dto: GetDashboardSummaryDto,
  ): GetDashboardSummaryUseCase.Input {
    return {
      startDate: new Date(`${dto.startDate}T00:00:00.000Z`),
      endDate: new Date(`${dto.endDate}T23:59:59.999Z`),
    };
  }

  @ApiResponse({ status: 200, type: DashboardSummaryPresenter })
  @ApiResponse({
    status: 400,
    description: 'Data inicial posterior à data final',
  })
  @ApiResponse({ status: 422, description: 'Datas ausentes ou inválidas' })
  @Get()
  async summary(@Query() query: GetDashboardSummaryDto) {
    const output = await this.getDashboardSummaryUseCase.execute(
      DashboardController.toPeriod(query),
    );
    return DashboardController.summaryToResponse(output);
  }
}
