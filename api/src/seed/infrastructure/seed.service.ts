import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { UpsertProductCostUseCase } from '@/product-costs/application/usecases/upsert-product-cost.usecase';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { EnvConfig } from '@/shared/infrastructure/env-config/env-config.interface';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SeedOrder, SeedProduct, seedOrders, seedProducts } from './seed-data';

export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly envConfig: EnvConfig,
    private readonly createProductUseCase: CreateProductUseCase.UseCase,
    private readonly upsertProductCostUseCase: UpsertProductCostUseCase.UseCase,
    private readonly createOrderUseCase: CreateOrderUseCase.UseCase,
    private readonly products: SeedProduct[] = seedProducts,
    private readonly orders: SeedOrder[] = seedOrders,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.envConfig.getNodeEnv() !== 'development') {
      return;
    }
    await this.run();
    this.logger.log(
      `Seeded ${this.products.length} products and ${this.orders.length} orders`,
    );
  }

  async run(): Promise<void> {
    for (const product of this.products) {
      const { id } = await this.createProductUseCase.execute({
        name: product.name,
        sku: product.sku,
        price: product.price,
      });
      if (product.unitCost !== null) {
        await this.upsertProductCostUseCase.execute({
          productId: id,
          unitCost: product.unitCost,
        });
      }
    }

    const now = this.now().getTime();
    const productsBySku = new Map(
      this.products.map(product => [product.sku, product]),
    );
    for (const order of this.orders) {
      const items = order.items.map(item => {
        const product = productsBySku.get(item.sku);
        if (!product) {
          throw new Error(`Seed order uses an unknown sku: ${item.sku}`);
        }
        return {
          sku: product.sku,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      });

      await this.createOrderUseCase.execute({
        externalId: order.externalId,
        platform: 'ecommerce',
        customer: order.customer,
        items,
        totalAmount: items.reduce(
          (total, item) => total + item.quantity * item.unitPrice,
          0,
        ),
        placedAt: new Date(now - order.hoursAgo * 60 * 60 * 1000),
      });
    }
  }
}
