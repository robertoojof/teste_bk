import { OrderEntity } from '@/orders/domain/entities/order.entity';

export type DashboardSummary = {
  ordersCount: number;
  revenue: number;
  totalCost: number;
  profit: number;
  skusWithoutCost: string[];
};

export class DashboardSummaryCalculator {
  static calculate(
    orders: OrderEntity[],
    unitCostBySku: ReadonlyMap<string, number>,
  ): DashboardSummary {
    let revenue = 0;
    let totalCost = 0;
    const skusWithoutCost = new Set<string>();

    for (const order of orders) {
      revenue += order.totalAmount;

      for (const item of order.items) {
        const unitCost = unitCostBySku.get(item.sku);
        if (unitCost === undefined) {
          skusWithoutCost.add(item.sku);
          continue;
        }
        totalCost += unitCost * item.quantity;
      }
    }

    return {
      ordersCount: orders.length,
      revenue,
      totalCost,
      profit: revenue - totalCost,
      skusWithoutCost: [...skusWithoutCost].sort(),
    };
  }
}
