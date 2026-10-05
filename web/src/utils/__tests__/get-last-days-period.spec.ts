import { getLastDaysPeriod } from '../get-last-days-period';

describe('getLastDaysPeriod', () => {
  it('returns the period ending today with the given amount of days', () => {
    expect(getLastDaysPeriod(30, new Date(2025, 1, 10))).toStrictEqual({
      startDate: '2025-01-12',
      endDate: '2025-02-10',
    });
  });

  it('returns only today for a single day', () => {
    expect(getLastDaysPeriod(1, new Date(2025, 1, 10))).toStrictEqual({
      startDate: '2025-02-10',
      endDate: '2025-02-10',
    });
  });
});
