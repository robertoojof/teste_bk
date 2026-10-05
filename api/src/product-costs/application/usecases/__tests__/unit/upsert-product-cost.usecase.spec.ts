import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostInMemoryRepository } from '@/product-costs/infrastructure/database/in-memory/repositories/product-cost-in-memory.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UpsertProductCostUseCase } from '../../upsert-product-cost.usecase';

describe('UpsertProductCostUseCase unit tests', () => {
  let sut: UpsertProductCostUseCase.UseCase;
  let productRepository: ProductInMemoryRepository;
  let productCostRepository: ProductCostInMemoryRepository;
  let product: ProductEntity;

  beforeEach(async () => {
    productRepository = new ProductInMemoryRepository();
    productCostRepository = new ProductCostInMemoryRepository();
    sut = new UpsertProductCostUseCase.UseCase(
      productRepository,
      productCostRepository,
    );
    product = new ProductEntity(ProductDataBuilder({}));
    await productRepository.insert(product);
  });

  it('Should throws error when product not found', async () => {
    await expect(() =>
      sut.execute({ productId: 'fakeId', unitCost: 100 }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(productCostRepository.items).toHaveLength(0);
  });

  it('Should create the cost when the product has none', async () => {
    const spyInsert = vi.spyOn(productCostRepository, 'insert');
    const spyUpdate = vi.spyOn(productCostRepository, 'update');

    const result = await sut.execute({ productId: product.id, unitCost: 1800 });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(spyUpdate).not.toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result).toMatchObject({ productId: product.id, unitCost: 1800 });
    expect(productCostRepository.items).toHaveLength(1);
  });

  it('Should update the cost when the product already has one', async () => {
    const current = new ProductCostEntity({
      productId: product.id,
      unitCost: 1800,
    });
    productCostRepository.items = [current];
    const spyInsert = vi.spyOn(productCostRepository, 'insert');
    const spyUpdate = vi.spyOn(productCostRepository, 'update');

    const result = await sut.execute({ productId: product.id, unitCost: 2000 });

    expect(spyInsert).not.toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(current.id);
    expect(result.unitCost).toBe(2000);
    expect(productCostRepository.items).toHaveLength(1);
  });

  it('Should throw an error when the unit cost is invalid', async () => {
    await expect(() =>
      sut.execute({ productId: product.id, unitCost: -1 }),
    ).rejects.toBeInstanceOf(EntityValidationError);
  });
});
