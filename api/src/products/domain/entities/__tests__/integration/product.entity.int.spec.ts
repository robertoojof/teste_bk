import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { ProductEntity, ProductProps } from '../../product.entity';

describe('ProductEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a product with invalid name', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        name: null as any,
      };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), name: '' };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), name: 10 as any };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), name: 'a'.repeat(256) };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a product with invalid sku', () => {
      let props: ProductProps = { ...ProductDataBuilder({}), sku: null as any };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), sku: '' };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), sku: 'a'.repeat(51) };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a product with invalid price', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        price: null as any,
      };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), price: -1 };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), price: 49.9 };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);

      props = { ...ProductDataBuilder({}), price: '4990' as any };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a product with invalid createdAt', () => {
      const props: ProductProps = {
        ...ProductDataBuilder({}),
        createdAt: '2025' as any,
      };
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError);
    });

    it('Should create a valid product', () => {
      expect.assertions(0);
      new ProductEntity(ProductDataBuilder({}));
    });
  });
});
