import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderInMemoryRepository } from '@/orders/infrastructure/database/in-memory/repositories/order-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { GetOrderUseCase } from '../../get-order.usecase';

describe('GetOrderUseCase unit tests', () => {
  let sut: GetOrderUseCase.UseCase;
  let repository: OrderInMemoryRepository;

  beforeEach(() => {
    repository = new OrderInMemoryRepository();
    sut = new GetOrderUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('Should be able to get an order', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    repository.items = [entity];

    const result = await sut.execute({ id: entity.id });

    expect(result).toStrictEqual(entity.toJSON());
  });
});
