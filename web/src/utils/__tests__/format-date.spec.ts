import { formatDate, formatDateTime } from '../format-date';

describe('formatDate', () => {
  it('formats an ISO date in pt-BR', () => {
    expect(formatDate('2025-02-10T14:32:00')).toBe('10/02/2025');
  });

  it('formats an ISO date with time', () => {
    expect(formatDateTime('2025-02-10T14:32:00')).toBe('10/02/2025 às 14:32');
  });

  it('throws for an invalid date', () => {
    expect(() => formatDate('invalid')).toThrow('Invalid date: invalid');
  });
});
