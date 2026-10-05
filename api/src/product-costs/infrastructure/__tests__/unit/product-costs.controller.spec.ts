import { ListProductCostsUseCase } from '@/product-costs/application/usecases/list-product-costs.usecase';
import { UpsertProductCostUseCase } from '@/product-costs/application/usecases/upsert-product-cost.usecase';
import {
  ProductCostPresenter,
  ProductWithCostCollectionPresenter,
} from '../../presenters/product-cost.presenter';
import { ProductCostsController } from '../../product-costs.controller';

describe('ProductCostsController unit tests', () => {
  let sut: ProductCostsController;
  const productId = 'df96ae94-6128-486e-840c-b6f78abb4801';

  beforeEach(() => {
    sut = new ProductCostsController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should upsert a product cost', async () => {
    const output: UpsertProductCostUseCase.Output = {
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      productId,
      unitCost: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockUpsertProductCostUseCase = {
      execute: vi.fn().mockResolvedValue(output),
    };
    sut['upsertProductCostUseCase'] = mockUpsertProductCostUseCase as any;

    const presenter = await sut.upsert(productId, { unitCost: 1800 });

    expect(presenter).toBeInstanceOf(ProductCostPresenter);
    expect(presenter).toStrictEqual(new ProductCostPresenter(output));
    expect(mockUpsertProductCostUseCase.execute).toHaveBeenCalledWith({
      productId,
      unitCost: 1800,
    });
  });

  it('should search the products with costs', async () => {
    const output: ListProductCostsUseCase.Output = {
      items: [
        {
          productId,
          name: 'Camiseta Básica',
          sku: 'P-001',
          price: 4990,
          unitCost: null,
          margin: null,
          costUpdatedAt: null,
        },
      ],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockListProductCostsUseCase = {
      execute: vi.fn().mockResolvedValue(output),
    };
    sut['listProductCostsUseCase'] = mockListProductCostsUseCase as any;
    const searchParams = { page: 1, perPage: 1 };

    const presenter = await sut.search(searchParams);

    expect(presenter).toBeInstanceOf(ProductWithCostCollectionPresenter);
    expect(presenter).toEqual(new ProductWithCostCollectionPresenter(output));
    expect(mockListProductCostsUseCase.execute).toHaveBeenCalledWith(
      searchParams,
    );
  });
});
