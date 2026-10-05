import { GetDashboardSummaryUseCase } from '@/dashboard/application/usecases/get-dashboard-summary.usecase';
import { DashboardController } from '../../dashboard.controller';
import { DashboardSummaryPresenter } from '../../presenters/dashboard-summary.presenter';

describe('DashboardController unit tests', () => {
  let sut: DashboardController;

  beforeEach(() => {
    sut = new DashboardController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should convert the dates into a period covering whole days (UTC)', () => {
    expect(
      DashboardController.toPeriod({
        startDate: '2025-02-01',
        endDate: '2025-02-28',
      }),
    ).toStrictEqual({
      startDate: new Date('2025-02-01T00:00:00.000Z'),
      endDate: new Date('2025-02-28T23:59:59.999Z'),
    });
  });

  it('should return the dashboard summary', async () => {
    const output: GetDashboardSummaryUseCase.Output = {
      startDate: new Date('2025-02-01T00:00:00.000Z'),
      endDate: new Date('2025-02-28T23:59:59.999Z'),
      ordersCount: 1,
      revenue: 22970,
      totalCost: 3600,
      profit: 19370,
      skusWithoutCost: [],
    };
    const mockUseCase = { execute: vi.fn().mockResolvedValue(output) };
    sut['getDashboardSummaryUseCase'] = mockUseCase as any;

    const presenter = await sut.summary({
      startDate: '2025-02-01',
      endDate: '2025-02-28',
    });

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      startDate: output.startDate,
      endDate: output.endDate,
    });
    expect(presenter).toBeInstanceOf(DashboardSummaryPresenter);
    expect(presenter).toStrictEqual(new DashboardSummaryPresenter(output));
  });
});
