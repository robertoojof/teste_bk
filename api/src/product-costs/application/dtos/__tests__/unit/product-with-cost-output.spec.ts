import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductWithCostOutputMapper } from '../../product-with-cost-output';

describe('ProductWithCostOutputMapper unit tests', () => {
  const product = new ProductEntity(
    ProductDataBuilder({ name: 'Camiseta Básica', sku: 'P-001', price: 4990 }),
  );

  it('should convert a product with cost in output', () => {
    const cost = new ProductCostEntity({
      productId: product.id,
      unitCost: 1800,
    });

    const sut = ProductWithCostOutputMapper.toOutput(product, cost);

    expect(sut).toStrictEqual({
      productId: product.id,
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
      unitCost: 1800,
      margin: 3190,
      costUpdatedAt: cost.updatedAt,
    });
  });

  it('should convert a product without cost in output', () => {
    const sut = ProductWithCostOutputMapper.toOutput(product, null);

    expect(sut).toStrictEqual({
      productId: product.id,
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
      unitCost: null,
      margin: null,
      costUpdatedAt: null,
    });
  });
});
