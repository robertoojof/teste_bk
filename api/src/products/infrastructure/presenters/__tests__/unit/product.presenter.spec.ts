import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import { instanceToPlain } from 'class-transformer';
import {
  ProductCollectionPresenter,
  ProductPresenter,
} from '../../product.presenter';

describe('ProductPresenter unit tests', () => {
  const createdAt = new Date();
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'Camiseta Básica',
    sku: 'P-001',
    price: 4990,
    createdAt,
  };

  describe('ProductPresenter', () => {
    it('constructor', () => {
      const sut = new ProductPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.sku).toEqual(props.sku);
      expect(sut.price).toEqual(props.price);
      expect(sut.createdAt).toEqual(props.createdAt);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(new ProductPresenter(props));
      expect(output).toStrictEqual({
        ...props,
        createdAt: createdAt.toISOString(),
      });
    });
  });

  describe('ProductCollectionPresenter', () => {
    it('constructor', () => {
      const sut = new ProductCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new ProductPresenter(props)]);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(
        new ProductCollectionPresenter({
          items: [props],
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(output).toStrictEqual({
        data: [{ ...props, createdAt: createdAt.toISOString() }],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      });
    });
  });
});
