import { OrderEntity } from '@/orders/domain/entities/order.entity';
import {
  OrderDataBuilder,
  OrderItemDataBuilder,
} from '@/orders/domain/testing/helpers/order-data-builder';
import { DashboardSummaryCalculator } from '../../dashboard-summary.calculator';

function order(items: { sku: string; quantity: number; unitPrice: number }[]) {
  return new OrderEntity(
    OrderDataBuilder({ items: items.map(item => OrderItemDataBuilder(item)) }),
  );
}

describe('DashboardSummaryCalculator unit tests', () => {
  it('should return zeroed indicators when there are no orders', () => {
    expect(DashboardSummaryCalculator.calculate([], new Map())).toStrictEqual({
      ordersCount: 0,
      revenue: 0,
      totalCost: 0,
      profit: 0,
      skusWithoutCost: [],
    });
  });

  it('should consolidate orders count, revenue, cost and profit', () => {
    const orders = [
      order([
        { sku: 'P-001', quantity: 2, unitPrice: 4990 },
        { sku: 'P-002', quantity: 1, unitPrice: 12990 },
      ]),
      order([{ sku: 'P-001', quantity: 1, unitPrice: 4990 }]),
    ];
    const unitCostBySku = new Map([
      ['P-001', 1800],
      ['P-002', 5200],
    ]);

    expect(
      DashboardSummaryCalculator.calculate(orders, unitCostBySku),
    ).toStrictEqual({
      ordersCount: 2,
      revenue: 22970 + 4990,
      totalCost: 3 * 1800 + 5200,
      profit: 27960 - 10600,
      skusWithoutCost: [],
    });
  });

  it('should count items without cost as zero and report their skus', () => {
    const orders = [
      order([
        { sku: 'P-003', quantity: 1, unitPrice: 19990 },
        { sku: 'P-001', quantity: 1, unitPrice: 4990 },
      ]),
      order([{ sku: 'P-002', quantity: 2, unitPrice: 12990 }]),
      order([{ sku: 'P-003', quantity: 1, unitPrice: 19990 }]),
    ];

    const result = DashboardSummaryCalculator.calculate(
      orders,
      new Map([['P-001', 1800]]),
    );

    expect(result.totalCost).toBe(1800);
    expect(result.profit).toBe(result.revenue - 1800);
    expect(result.skusWithoutCost).toStrictEqual(['P-002', 'P-003']);
  });

  it('should treat a zero cost as registered', () => {
    const result = DashboardSummaryCalculator.calculate(
      [order([{ sku: 'P-001', quantity: 1, unitPrice: 4990 }])],
      new Map([['P-001', 0]]),
    );

    expect(result.totalCost).toBe(0);
    expect(result.skusWithoutCost).toStrictEqual([]);
  });
});
