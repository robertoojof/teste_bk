import {
  OrderDataBuilder,
  OrderItemDataBuilder,
} from '@/orders/domain/testing/helpers/order-data-builder';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderEntity } from '../../order.entity';

describe('OrderEntity integration tests', () => {
  it('Should throw an error when the externalId is invalid', () => {
    expect(
      () => new OrderEntity({ ...OrderDataBuilder({}), externalId: '' }),
    ).toThrow(EntityValidationError);
  });

  it('Should throw an error when the customer is invalid', () => {
    expect(
      () =>
        new OrderEntity({
          ...OrderDataBuilder({}),
          customer: { name: 'Maria', email: 'invalid' },
        }),
    ).toThrow(EntityValidationError);
    expect(
      () => new OrderEntity({ ...OrderDataBuilder({}), customer: null as any }),
    ).toThrow(EntityValidationError);
  });

  it('Should throw an error when the items are invalid', () => {
    expect(
      () => new OrderEntity({ ...OrderDataBuilder({}), items: [] }),
    ).toThrow(EntityValidationError);
    expect(
      () =>
        new OrderEntity(
          OrderDataBuilder({ items: [OrderItemDataBuilder({ quantity: 0 })] }),
        ),
    ).toThrow(EntityValidationError);
    expect(
      () =>
        new OrderEntity(
          OrderDataBuilder({
            items: [OrderItemDataBuilder({ unitPrice: 49.9 })],
          }),
        ),
    ).toThrow(EntityValidationError);
  });

  it('Should throw an error when the totalAmount does not match the items', () => {
    const props = OrderDataBuilder({
      items: [OrderItemDataBuilder({ quantity: 2, unitPrice: 4990 })],
      totalAmount: 1000,
    });

    try {
      new OrderEntity(props);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect((error as EntityValidationError).errors).toStrictEqual({
        totalAmount: ['totalAmount must be equal to the sum of the items'],
      });
    }
  });

  it('Should throw an error when placedAt is invalid', () => {
    expect(
      () =>
        new OrderEntity({ ...OrderDataBuilder({}), placedAt: '2025' as any }),
    ).toThrow(EntityValidationError);
  });

  it('Should create a valid order', () => {
    expect.assertions(0);
    new OrderEntity(OrderDataBuilder({}));
  });
});
