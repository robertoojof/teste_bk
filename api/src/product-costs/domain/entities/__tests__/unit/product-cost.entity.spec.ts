import { ProductCostDataBuilder } from '@/product-costs/domain/testing/helpers/product-cost-data-builder';
import { ProductCostEntity, ProductCostProps } from '../../product-cost.entity';

describe('ProductCostEntity unit tests', () => {
  let props: ProductCostProps;
  let sut: ProductCostEntity;

  beforeEach(() => {
    vi.spyOn(ProductCostEntity, 'validate').mockImplementation(() => undefined);
    props = ProductCostDataBuilder({});
    sut = new ProductCostEntity(props);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('Constructor method', () => {
    expect(ProductCostEntity.validate).toHaveBeenCalled();
    expect(sut.props.productId).toEqual(props.productId);
    expect(sut.props.unitCost).toEqual(props.unitCost);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
  });

  it('should default updatedAt to createdAt', () => {
    const createdAt = new Date('2025-01-01T00:00:00Z');
    const entity = new ProductCostEntity({
      productId: props.productId,
      unitCost: props.unitCost,
      createdAt,
    });
    expect(entity.updatedAt).toEqual(createdAt);
  });

  it('Getter of productId field', () => {
    expect(sut.productId).toEqual(props.productId);
    expect(typeof sut.productId).toBe('string');
  });

  it('Getter of unitCost field', () => {
    expect(sut.unitCost).toEqual(props.unitCost);
    expect(typeof sut.unitCost).toBe('number');
  });

  it('Setter of unitCost field', () => {
    sut['unitCost'] = 1234;
    expect(sut.props.unitCost).toEqual(1234);
  });

  it('Getter of createdAt and updatedAt fields', () => {
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it('Should update the unit cost and the updatedAt field', () => {
    vi.useFakeTimers();
    const now = new Date('2030-01-01T00:00:00Z');
    vi.setSystemTime(now);

    sut.updateCost(999);

    expect(ProductCostEntity.validate).toHaveBeenCalledWith({
      ...props,
      unitCost: 999,
    });
    expect(sut.unitCost).toEqual(999);
    expect(sut.updatedAt).toEqual(now);
  });
});
