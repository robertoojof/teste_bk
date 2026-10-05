import {
  OrderDataBuilder,
  OrderItemDataBuilder,
} from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderEntity, OrderProps } from '../../order.entity';

describe('OrderEntity unit tests', () => {
  let props: OrderProps;
  let sut: OrderEntity;

  beforeEach(() => {
    vi.spyOn(OrderEntity, 'validate').mockImplementation(() => undefined);
    props = OrderDataBuilder({});
    sut = new OrderEntity(props);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Constructor method', () => {
    expect(OrderEntity.validate).toHaveBeenCalled();
    expect(sut.props).toStrictEqual(props);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should set createdAt when it is not provided', () => {
    const { createdAt: _, ...rest } = props;
    expect(new OrderEntity(rest).createdAt).toBeInstanceOf(Date);
  });

  it('Getters', () => {
    expect(sut.externalId).toEqual(props.externalId);
    expect(sut.platform).toEqual(props.platform);
    expect(sut.customer).toStrictEqual(props.customer);
    expect(sut.items).toStrictEqual(props.items);
    expect(sut.totalAmount).toEqual(props.totalAmount);
    expect(sut.placedAt).toEqual(props.placedAt);
    expect(sut.createdAt).toEqual(props.createdAt);
  });

  it('itemsTotal method', () => {
    expect(OrderEntity.itemsTotal([])).toBe(0);
    expect(
      OrderEntity.itemsTotal([
        OrderItemDataBuilder({ quantity: 2, unitPrice: 4990 }),
        OrderItemDataBuilder({ quantity: 1, unitPrice: 12990 }),
      ]),
    ).toBe(22970);
  });
});
