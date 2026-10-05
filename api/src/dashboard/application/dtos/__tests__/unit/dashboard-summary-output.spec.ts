import { DashboardSummaryOutputMapper } from '../../dashboard-summary-output';

describe('DashboardSummaryOutputMapper unit tests', () => {
  it('should add the period to the summary', () => {
    const period = {
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-01-31T23:59:59.999Z'),
    };
    const summary = {
      ordersCount: 1,
      revenue: 22970,
      totalCost: 3600,
      profit: 19370,
      skusWithoutCost: ['P-002'],
    };

    expect(
      DashboardSummaryOutputMapper.toOutput(summary, period),
    ).toStrictEqual({ ...period, ...summary });
  });
});
