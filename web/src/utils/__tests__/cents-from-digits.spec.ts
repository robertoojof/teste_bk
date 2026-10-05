import { centsFromDigits } from '../cents-from-digits';

describe('centsFromDigits', () => {
  it.each([
    ['', 0],
    ['R$ 0,00', 0],
    ['R$ 0,004', 4],
    ['R$ 49,905', 49905],
    ['R$ 49,9', 499],
    ['abc', 0],
    ['1.234,56', 123456],
  ])('converts "%s" to %d cents', (text, expected) => {
    expect(centsFromDigits(text)).toBe(expected);
  });

  it('limits the amount of digits', () => {
    expect(centsFromDigits('9'.repeat(20))).toBe(999_999_999_999);
  });
});
