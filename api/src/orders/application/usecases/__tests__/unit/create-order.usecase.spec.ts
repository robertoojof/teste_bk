import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderInMemoryRepository } from '@/orders/infrastructure/database/in-memory/repositories/order-in-memory.repository';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { CreateOrderUseCase } from '../../create-order.usecase';

describe('CreateOrderUseCase unit tests', () => {
  let sut: CreateOrderUseCase.UseCase;
  let repository: OrderInMemoryRepository;
  let input: CreateOrderUseCase.Input;

  beforeEach(() => {
    repository = new OrderInMemoryRepository();
    sut = new CreateOrderUseCase.UseCase(repository);
    const { createdAt: _, ...props } = OrderDataBuilder({});
    input = props;
  });

  it('Should create an order', async () => {
    const spyInsert = vi.spyOn(repository, 'insert');

    const result = await sut.execute(input);

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result).toMatchObject(input);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('Should not duplicate an order received twice', async () => {
    const first = await sut.execute(input);
    const spyInsert = vi.spyOn(repository, 'insert');

    const second = await sut.execute(input);

    expect(spyInsert).not.toHaveBeenCalled();
    expect(second).toStrictEqual(first);
    expect(repository.items).toHaveLength(1);
  });

  it('Should create orders with the same externalId from different platforms', async () => {
    await sut.execute(input);
    await sut.execute({ ...input, platform: 'other-platform' });

    expect(repository.items).toHaveLength(2);
  });

  it('Should throw an error when the order is invalid', async () => {
    await expect(() =>
      sut.execute({ ...input, totalAmount: input.totalAmount + 1 }),
    ).rejects.toBeInstanceOf(EntityValidationError);
    expect(repository.items).toHaveLength(0);
  });
});
