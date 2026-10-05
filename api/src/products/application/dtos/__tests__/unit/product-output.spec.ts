import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductOutputMapper } from '../../product-output';

describe('ProductOutputMapper unit tests', () => {
  it('should convert a product in output', () => {
    const entity = new ProductEntity(ProductDataBuilder({}));
    const spyToJson = vi.spyOn(entity, 'toJSON');
    const sut = ProductOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
