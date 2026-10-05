import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import {
  ProductRules,
  ProductValidator,
  ProductValidatorFactory,
} from '../../product.validator';

describe('ProductValidator unit tests', () => {
  let sut: ProductValidator;

  beforeEach(() => {
    sut = ProductValidatorFactory.create();
  });

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors.name).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...ProductDataBuilder({}), name: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors.name).toStrictEqual(['name should not be empty']);
  });

  it('Invalidation cases for sku field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors.sku).toStrictEqual([
      'sku should not be empty',
      'sku must be a string',
      'sku must be shorter than or equal to 50 characters',
    ]);

    isValid = sut.validate({ ...ProductDataBuilder({}), sku: 'a'.repeat(51) });
    expect(isValid).toBeFalsy();
    expect(sut.errors.sku).toStrictEqual([
      'sku must be shorter than or equal to 50 characters',
    ]);
  });

  it('Invalidation cases for price field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors.price).toStrictEqual([
      'price should not be empty',
      'price must be an integer number',
      'price must not be less than 0',
    ]);

    isValid = sut.validate({ ...ProductDataBuilder({}), price: 49.9 });
    expect(isValid).toBeFalsy();
    expect(sut.errors.price).toStrictEqual(['price must be an integer number']);

    isValid = sut.validate({ ...ProductDataBuilder({}), price: -10 });
    expect(isValid).toBeFalsy();
    expect(sut.errors.price).toStrictEqual(['price must not be less than 0']);
  });

  it('Invalidation cases for createdAt field', () => {
    const isValid = sut.validate({
      ...ProductDataBuilder({}),
      createdAt: '2025' as any,
    });
    expect(isValid).toBeFalsy();
    expect(sut.errors.createdAt).toStrictEqual([
      'createdAt must be a Date instance',
    ]);
  });

  it('Valid case for product rules', () => {
    const props = ProductDataBuilder({});
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.errors).toStrictEqual({});
    expect(sut.validatedData).toStrictEqual(new ProductRules(props));
  });
});
