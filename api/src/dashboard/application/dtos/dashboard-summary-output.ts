import { DashboardSummary } from '@/dashboard/domain/services/dashboard-summary.calculator';

export type DashboardSummaryOutput = DashboardSummary & {
  startDate: Date;
  endDate: Date;
};

export class DashboardSummaryOutputMapper {
  static toOutput(
    summary: DashboardSummary,
    period: { startDate: Date; endDate: Date },
  ): DashboardSummaryOutput {
    return {
      startDate: period.startDate,
      endDate: period.endDate,
      ...summary,
    };
  }
}
