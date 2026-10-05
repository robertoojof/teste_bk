import { DashboardSummaryCalculator } from '@/dashboard/domain/services/dashboard-summary.calculator';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { ProductCostRepository } from '@/product-costs/domain/repositories/product-cost.repository';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import {
  DashboardSummaryOutput,
  DashboardSummaryOutputMapper,
} from '../dtos/dashboard-summary-output';

export namespace GetDashboardSummaryUseCase {
  export type Input = {
    startDate: Date;
    endDate: Date;
  };

  export type Output = DashboardSummaryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository.Repository,
      private productRepository: ProductRepository.Repository,
      private productCostRepository: ProductCostRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { startDate, endDate } = input;
      if (startDate.getTime() > endDate.getTime()) {
        throw new BadRequestError(
          'startDate must be before or equal to endDate',
        );
      }

      const orders = await this.orderRepository.findByPeriod(
        startDate,
        endDate,
      );
      const unitCostBySku = await this.unitCostBySku(orders);
      const summary = DashboardSummaryCalculator.calculate(
        orders,
        unitCostBySku,
      );

      return DashboardSummaryOutputMapper.toOutput(summary, input);
    }

    private async unitCostBySku(
      orders: OrderEntity[],
    ): Promise<Map<string, number>> {
      const skus = [
        ...new Set(orders.flatMap(order => order.items.map(item => item.sku))),
      ];
      if (!skus.length) {
        return new Map();
      }

      const products = await this.productRepository.findBySkus(skus);
      const costs = await this.productCostRepository.findByProductIds(
        products.map(product => product.id),
      );
      const unitCostByProductId = new Map(
        costs.map(cost => [cost.productId, cost.unitCost]),
      );

      const unitCostBySku = new Map<string, number>();
      for (const product of products) {
        const unitCost = unitCostByProductId.get(product.id);
        if (unitCost !== undefined) {
          unitCostBySku.set(product.sku, unitCost);
        }
      }
      return unitCostBySku;
    }
  }
}
