import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { GetProductUseCase } from '../../get-product.usecase';

describe('GetProductUseCase unit tests', () => {
  let sut: GetProductUseCase.UseCase;
  let repository: ProductInMemoryRepository;

  beforeEach(() => {
    repository = new ProductInMemoryRepository();
    sut = new GetProductUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('Should be able to get product', async () => {
    const spyFindById = vi.spyOn(repository, 'findById');
    const entity = new ProductEntity(ProductDataBuilder({}));
    repository.items = [entity];

    const result = await sut.execute({ id: entity.id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });
});
