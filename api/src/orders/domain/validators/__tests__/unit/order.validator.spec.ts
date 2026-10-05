import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import {
  OrderRules,
  OrderValidator,
  OrderValidatorFactory,
} from '../../order.validator';

describe('OrderValidator unit tests', () => {
  let sut: OrderValidator;

  beforeEach(() => {
    sut = OrderValidatorFactory.create();
  });

  it('Invalidation cases for an empty payload', () => {
    const isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(Object.keys(sut.errors)).toStrictEqual([
      'externalId',
      'platform',
      'customer',
      'items',
      'totalAmount',
      'placedAt',
    ]);
  });

  it('Invalidation cases for the customer fields', () => {
    const isValid = sut.validate({
      ...OrderDataBuilder({}),
      customer: { name: '', email: 'invalid' },
    });
    expect(isValid).toBeFalsy();
    expect(sut.errors).toStrictEqual({
      'customer.name': ['customer.name should not be empty'],
      'customer.email': ['customer.email must be an email'],
    });
  });

  it('Invalidation cases for the items fields', () => {
    let isValid = sut.validate({ ...OrderDataBuilder({}), items: [] });
    expect(isValid).toBeFalsy();
    expect(sut.errors).toStrictEqual({
      items: ['items should not be empty'],
    });

    isValid = sut.validate({
      ...OrderDataBuilder({}),
      items: [{ sku: '', name: 'Camiseta', quantity: 0, unitPrice: 49.9 }],
    });
    expect(isValid).toBeFalsy();
    expect(sut.errors).toStrictEqual({
      'items.0.sku': ['items.0.sku should not be empty'],
      'items.0.quantity': ['items.0.quantity must not be less than 1'],
      'items.0.unitPrice': ['items.0.unitPrice must be an integer number'],
    });
  });

  it('Invalidation cases for totalAmount and placedAt', () => {
    const isValid = sut.validate({
      ...OrderDataBuilder({}),
      totalAmount: -1,
      placedAt: '2025-02-10' as any,
    });
    expect(isValid).toBeFalsy();
    expect(sut.errors).toStrictEqual({
      totalAmount: ['totalAmount must not be less than 0'],
      placedAt: ['placedAt must be a Date instance'],
    });
  });

  it('Valid case for order rules', () => {
    const props = OrderDataBuilder({});
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.errors).toStrictEqual({});
    expect(sut.validatedData).toStrictEqual(new OrderRules(props));
  });
});
