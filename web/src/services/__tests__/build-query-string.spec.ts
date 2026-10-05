import { buildQueryString } from '../http/build-query-string';

describe('buildQueryString', () => {
  it('returns an empty string without params', () => {
    expect(buildQueryString()).toBe('');
    expect(buildQueryString({ filter: '', page: undefined })).toBe('');
  });

  it('serializes the defined params', () => {
    expect(
      buildQueryString({ page: 2, perPage: 5, filter: 'maria souza' }),
    ).toBe('?page=2&perPage=5&filter=maria+souza');
  });
});
