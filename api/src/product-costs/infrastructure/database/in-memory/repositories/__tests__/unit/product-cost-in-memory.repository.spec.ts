import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostDataBuilder } from '@/product-costs/domain/testing/helpers/product-cost-data-builder';
import { ProductCostInMemoryRepository } from '../../product-cost-in-memory.repository';

describe('ProductCostInMemoryRepository unit tests', () => {
  let sut: ProductCostInMemoryRepository;

  beforeEach(() => {
    sut = new ProductCostInMemoryRepository();
  });

  it('Should return null when not found - findByProductId method', async () => {
    await expect(sut.findByProductId('fakeId')).resolves.toBeNull();
  });

  it('Should find a cost by productId - findByProductId method', async () => {
    const entity = new ProductCostEntity(ProductCostDataBuilder({}));
    await sut.insert(entity);

    await expect(sut.findByProductId(entity.productId)).resolves.toBe(entity);
  });

  it('Should find the costs of the given products - findByProductIds method', async () => {
    const entities = [0, 1, 2].map(
      () => new ProductCostEntity(ProductCostDataBuilder({})),
    );
    sut.items = entities;

    const result = await sut.findByProductIds([
      entities[0].productId,
      entities[2].productId,
      'fakeId',
    ]);

    expect(result).toStrictEqual([entities[0], entities[2]]);
  });

  it('Should return an empty list when no ids are given - findByProductIds method', async () => {
    sut.items = [new ProductCostEntity(ProductCostDataBuilder({}))];
    await expect(sut.findByProductIds([])).resolves.toStrictEqual([]);
  });
});
