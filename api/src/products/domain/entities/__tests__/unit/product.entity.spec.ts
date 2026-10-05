import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductEntity, ProductProps } from '../../product.entity';

describe('ProductEntity unit tests', () => {
  let props: ProductProps;
  let sut: ProductEntity;

  beforeEach(() => {
    vi.spyOn(ProductEntity, 'validate').mockImplementation(() => undefined);
    props = ProductDataBuilder({});
    sut = new ProductEntity(props);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Constructor method', () => {
    expect(ProductEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.sku).toEqual(props.sku);
    expect(sut.props.price).toEqual(props.price);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('Getter of name field', () => {
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Getter of sku field', () => {
    expect(sut.sku).toEqual(props.sku);
    expect(typeof sut.sku).toBe('string');
  });

  it('Getter of price field', () => {
    expect(sut.price).toEqual(props.price);
    expect(typeof sut.price).toBe('number');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('should set createdAt when it is not provided', () => {
    const { createdAt: _, ...rest } = props;
    const entity = new ProductEntity(rest);
    expect(entity.createdAt).toBeInstanceOf(Date);
  });
});
