import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import { instanceToPlain } from 'class-transformer';
import {
  ProductCostPresenter,
  ProductWithCostCollectionPresenter,
  ProductWithCostPresenter,
} from '../../product-cost.presenter';

describe('ProductCost presenters unit tests', () => {
  const createdAt = new Date('2025-02-01T10:00:00Z');
  const updatedAt = new Date('2025-02-10T10:00:00Z');

  describe('ProductCostPresenter', () => {
    const props = {
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      productId: 'df96ae94-6128-486e-840c-b6f78abb4801',
      unitCost: 1800,
      createdAt,
      updatedAt,
    };

    it('constructor', () => {
      const sut = new ProductCostPresenter(props);
      expect(sut).toMatchObject(props);
    });

    it('should presenter data', () => {
      expect(instanceToPlain(new ProductCostPresenter(props))).toStrictEqual({
        ...props,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      });
    });
  });

  describe('ProductWithCostPresenter', () => {
    const withCost = {
      productId: 'df96ae94-6128-486e-840c-b6f78abb4801',
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
      unitCost: 1800,
      margin: 3190,
      costUpdatedAt: updatedAt,
    };
    const withoutCost = {
      ...withCost,
      unitCost: null,
      margin: null,
      costUpdatedAt: null,
    };

    it('should presenter a product with cost', () => {
      expect(
        instanceToPlain(new ProductWithCostPresenter(withCost)),
      ).toStrictEqual({ ...withCost, costUpdatedAt: updatedAt.toISOString() });
    });

    it('should presenter a product without cost', () => {
      expect(
        instanceToPlain(new ProductWithCostPresenter(withoutCost)),
      ).toStrictEqual(withoutCost);
    });

    it('should presenter a collection', () => {
      const sut = new ProductWithCostCollectionPresenter({
        items: [withCost],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.data).toStrictEqual([new ProductWithCostPresenter(withCost)]);
      expect(instanceToPlain(sut)).toStrictEqual({
        data: [{ ...withCost, costUpdatedAt: updatedAt.toISOString() }],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      });
    });
  });
});
