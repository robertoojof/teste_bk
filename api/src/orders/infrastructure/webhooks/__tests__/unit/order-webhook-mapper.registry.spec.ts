import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { OrderWebhookMapper } from '../../order-webhook-mapper';
import { OrderWebhookMapperRegistry } from '../../order-webhook-mapper.registry';

function stubMapper(platform: string): OrderWebhookMapper {
  return { platform, toCreateOrderInput: vi.fn() };
}

describe('OrderWebhookMapperRegistry unit tests', () => {
  it('should resolve the mapper of a registered platform', () => {
    const ecommerce = stubMapper('ecommerce');
    const other = stubMapper('other');
    const sut = new OrderWebhookMapperRegistry([ecommerce, other]);

    expect(sut.resolve('ecommerce')).toBe(ecommerce);
    expect(sut.resolve('other')).toBe(other);
    expect(sut.platforms).toStrictEqual(['ecommerce', 'other']);
  });

  it('should throw a NotFoundError for an unknown platform', () => {
    const sut = new OrderWebhookMapperRegistry([stubMapper('ecommerce')]);

    expect(() => sut.resolve('shopify')).toThrow(
      new NotFoundError('Platform shopify is not supported'),
    );
  });
});
