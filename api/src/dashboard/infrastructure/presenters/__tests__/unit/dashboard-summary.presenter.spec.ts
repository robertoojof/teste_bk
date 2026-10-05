import { instanceToPlain } from 'class-transformer';
import { DashboardSummaryPresenter } from '../../dashboard-summary.presenter';

describe('DashboardSummaryPresenter unit tests', () => {
  const props = {
    startDate: new Date('2025-02-01T00:00:00.000Z'),
    endDate: new Date('2025-02-28T23:59:59.999Z'),
    ordersCount: 1,
    revenue: 22970,
    totalCost: 3600,
    profit: 19370,
    skusWithoutCost: ['P-002'],
  };

  it('constructor', () => {
    expect(new DashboardSummaryPresenter(props)).toMatchObject(props);
  });

  it('should presenter data', () => {
    expect(instanceToPlain(new DashboardSummaryPresenter(props))).toStrictEqual(
      {
        ...props,
        startDate: '2025-02-01T00:00:00.000Z',
        endDate: '2025-02-28T23:59:59.999Z',
      },
    );
  });
});
