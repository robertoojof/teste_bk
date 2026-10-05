import { toCents } from '../../to-cents';

describe('toCents unit tests', () => {
  it.each([
    [0, 0],
    [49.9, 4990],
    [129.9, 12990],
    [229.7, 22970],
    [0.1 + 0.2, 30],
    [10, 1000],
  ])('should convert %d to %d cents', (value, expected) => {
    expect(toCents(value)).toBe(expected);
  });
});
