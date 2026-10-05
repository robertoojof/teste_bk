import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderOutputMapper } from '../../order-output';

describe('OrderOutputMapper unit tests', () => {
  it('should convert an order in output', () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    const sut = OrderOutputMapper.toOutput(entity);

    expect(sut).toStrictEqual(entity.toJSON());
  });

  it('should not expose the internal references of the entity', () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    const sut = OrderOutputMapper.toOutput(entity);

    sut.items[0].quantity = 999;
    sut.customer.name = 'changed';

    expect(entity.items[0].quantity).not.toBe(999);
    expect(entity.customer.name).not.toBe('changed');
  });
});
