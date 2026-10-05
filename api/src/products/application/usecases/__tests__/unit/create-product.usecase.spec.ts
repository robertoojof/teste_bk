import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { CreateProductUseCase } from '../../create-product.usecase';

describe('CreateProductUseCase unit tests', () => {
  let sut: CreateProductUseCase.UseCase;
  let repository: ProductInMemoryRepository;

  beforeEach(() => {
    repository = new ProductInMemoryRepository();
    sut = new CreateProductUseCase.UseCase(repository);
  });

  it('Should create a product', async () => {
    const spyInsert = vi.spyOn(repository, 'insert');
    const { name, sku, price } = ProductDataBuilder({});
    const result = await sut.execute({ name, sku, price });

    expect(result.id).toBeDefined();
    expect(result).toMatchObject({ name, sku, price });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('Should not be able to register the same sku twice', async () => {
    const { name, sku, price } = ProductDataBuilder({ sku: 'P-001' });
    await sut.execute({ name, sku, price });

    await expect(() =>
      sut.execute({ name: 'other', sku, price }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('Should throw an error when the product is invalid', async () => {
    const { name, sku } = ProductDataBuilder({});

    await expect(() =>
      sut.execute({ name, sku, price: -1 }),
    ).rejects.toBeInstanceOf(EntityValidationError);
  });
});
