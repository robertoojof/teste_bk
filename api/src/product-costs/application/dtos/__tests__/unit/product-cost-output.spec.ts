import { ProductCostEntity } from '@/product-costs/domain/entities/product-cost.entity';
import { ProductCostDataBuilder } from '@/product-costs/domain/testing/helpers/product-cost-data-builder';
import { ProductCostOutputMapper } from '../../product-cost-output';

describe('ProductCostOutputMapper unit tests', () => {
  it('should convert a product cost in output', () => {
    const entity = new ProductCostEntity(ProductCostDataBuilder({}));
    const spyToJson = vi.spyOn(entity, 'toJSON');
    const sut = ProductCostOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
