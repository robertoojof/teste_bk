import { ProductCostDataBuilder } from '@/product-costs/domain/testing/helpers/product-cost-data-builder';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { ProductCostEntity, ProductCostProps } from '../../product-cost.entity';

describe('ProductCostEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a cost with invalid productId', () => {
      let props: ProductCostProps = {
        ...ProductCostDataBuilder({}),
        productId: null as any,
      };
      expect(() => new ProductCostEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductCostDataBuilder({}), productId: '' };
      expect(() => new ProductCostEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a cost with invalid unitCost', () => {
      let props: ProductCostProps = {
        ...ProductCostDataBuilder({}),
        unitCost: null as any,
      };
      expect(() => new ProductCostEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductCostDataBuilder({}), unitCost: -1 };
      expect(() => new ProductCostEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductCostDataBuilder({}), unitCost: 18.5 };
      expect(() => new ProductCostEntity(props)).toThrow(EntityValidationError);
    });

    it('Should create a valid product cost', () => {
      expect.assertions(0);
      new ProductCostEntity(ProductCostDataBuilder({}));
    });
  });

  describe('updateCost method', () => {
    it('Should throw an error when updating with an invalid unitCost', () => {
      const entity = new ProductCostEntity(ProductCostDataBuilder({}));
      expect(() => entity.updateCost(-10)).toThrow(EntityValidationError);
      expect(() => entity.updateCost(1.5)).toThrow(EntityValidationError);
    });

    it('Should update a valid unitCost', () => {
      const entity = new ProductCostEntity(ProductCostDataBuilder({}));
      entity.updateCost(0);
      expect(entity.unitCost).toBe(0);
    });
  });
});
