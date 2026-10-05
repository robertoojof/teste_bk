import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostInMemoryRepository } from '@/product-costs/infrastructure/database/in-memory/repositories/product-cost-in-memory.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { ProductWithCostOutputMapper } from '../../../dtos/product-with-cost-output';
import { ListProductCostsUseCase } from '../../list-product-costs.usecase';

describe('ListProductCostsUseCase unit tests', () => {
  let sut: ListProductCostsUseCase.UseCase;
  let productRepository: ProductInMemoryRepository;
  let productCostRepository: ProductCostInMemoryRepository;

  beforeEach(() => {
    productRepository = new ProductInMemoryRepository();
    productCostRepository = new ProductCostInMemoryRepository();
    sut = new ListProductCostsUseCase.UseCase(
      productRepository,
      productCostRepository,
    );
  });

  it('should return an empty page when there are no products', async () => {
    const output = await sut.execute({});
    expect(output).toStrictEqual({
      items: [],
      total: 0,
      currentPage: 1,
      lastPage: 0,
      perPage: 15,
    });
  });

  it('should return the products with their costs or null', async () => {
    const createdAt = new Date();
    const withCost = new ProductEntity(
      ProductDataBuilder({ sku: 'P-001', createdAt }),
    );
    const withoutCost = new ProductEntity(
      ProductDataBuilder({
        sku: 'P-002',
        createdAt: new Date(createdAt.getTime() + 1),
      }),
    );
    productRepository.items = [withCost, withoutCost];
    const cost = new ProductCostEntity({
      productId: withCost.id,
      unitCost: 1800,
    });
    productCostRepository.items = [cost];

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [
        ProductWithCostOutputMapper.toOutput(withoutCost, null),
        ProductWithCostOutputMapper.toOutput(withCost, cost),
      ],
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('should only look up the costs of the current page', async () => {
    productRepository.items = ['a', 'b', 'c'].map(
      (name, index) =>
        new ProductEntity(ProductDataBuilder({ name, sku: `P-00${index}` })),
    );
    const spyFindByProductIds = vi.spyOn(
      productCostRepository,
      'findByProductIds',
    );

    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
    });

    expect(output.items.map(item => item.name)).toStrictEqual(['a', 'b']);
    expect(spyFindByProductIds).toHaveBeenCalledWith([
      productRepository.items[0].id,
      productRepository.items[1].id,
    ]);
  });
});
