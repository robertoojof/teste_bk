import { normalizeSpaces } from '@/test/normalize-spaces';
import { formatCurrency } from '../format-currency';

describe('formatCurrency', () => {
  it.each([
    [0, 'R$ 0,00'],
    [4990, 'R$ 49,90'],
    [22970, 'R$ 229,70'],
    [14755000, 'R$ 147.550,00'],
    [-1500, '-R$ 15,00'],
  ])('formats %d cents as %s', (cents, expected) => {
    expect(normalizeSpaces(formatCurrency(cents))).toBe(expected);
  });
});
