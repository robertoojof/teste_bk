import { ProductCostDataBuilder } from '@/product-costs/domain/testing/helpers/product-cost-data-builder';
import {
  ProductCostRules,
  ProductCostValidator,
  ProductCostValidatorFactory,
} from '../../product-cost.validator';

describe('ProductCostValidator unit tests', () => {
  let sut: ProductCostValidator;

  beforeEach(() => {
    sut = ProductCostValidatorFactory.create();
  });

  it('Invalidation cases for productId field', () => {
    const isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors.productId).toStrictEqual([
      'productId should not be empty',
      'productId must be a string',
    ]);
  });

  it('Invalidation cases for unitCost field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors.unitCost).toStrictEqual([
      'unitCost should not be empty',
      'unitCost must be an integer number',
      'unitCost must not be less than 0',
    ]);

    isValid = sut.validate({ ...ProductCostDataBuilder({}), unitCost: 1.5 });
    expect(isValid).toBeFalsy();
    expect(sut.errors.unitCost).toStrictEqual([
      'unitCost must be an integer number',
    ]);

    isValid = sut.validate({ ...ProductCostDataBuilder({}), unitCost: -1 });
    expect(isValid).toBeFalsy();
    expect(sut.errors.unitCost).toStrictEqual([
      'unitCost must not be less than 0',
    ]);
  });

  it('Invalidation cases for date fields', () => {
    const isValid = sut.validate({
      ...ProductCostDataBuilder({}),
      createdAt: '2025' as any,
      updatedAt: '2025' as any,
    });
    expect(isValid).toBeFalsy();
    expect(sut.errors.createdAt).toStrictEqual([
      'createdAt must be a Date instance',
    ]);
    expect(sut.errors.updatedAt).toStrictEqual([
      'updatedAt must be a Date instance',
    ]);
  });

  it('Valid case for product cost rules', () => {
    const props = ProductCostDataBuilder({});
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.errors).toStrictEqual({});
    expect(sut.validatedData).toStrictEqual(new ProductCostRules(props));
  });
});
