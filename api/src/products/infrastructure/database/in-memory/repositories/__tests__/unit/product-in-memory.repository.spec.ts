import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ProductInMemoryRepository } from '../../product-in-memory.repository';

describe('ProductInMemoryRepository unit tests', () => {
  let sut: ProductInMemoryRepository;

  beforeEach(() => {
    sut = new ProductInMemoryRepository();
  });

  it('Should throw error when not found - findBySku method', async () => {
    await expect(sut.findBySku('P-404')).rejects.toThrow(
      new NotFoundError('Entity not found using sku P-404'),
    );
  });

  it('Should find a entity by sku - findBySku method', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findBySku(entity.sku);
    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should find the products of the given skus - findBySkus method', async () => {
    const items = ['P-001', 'P-002', 'P-003'].map(
      sku => new ProductEntity(ProductDataBuilder({ sku })),
    );
    sut.items = items;

    await expect(
      sut.findBySkus(['P-001', 'P-003', 'P-404']),
    ).resolves.toStrictEqual([items[0], items[2]]);
    await expect(sut.findBySkus([])).resolves.toStrictEqual([]);
  });

  it('Should throw error when found - skuExists method', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.skuExists(entity.sku)).rejects.toThrow(
      new ConflictError('SKU already used'),
    );
  });

  it('Should not throw when sku is free - skuExists method', async () => {
    await expect(sut.skuExists('P-001')).resolves.toBeUndefined();
  });

  it('Should no filter items when filter object is null', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findAll();
    const spyFilter = vi.spyOn(result, 'filter');
    const itemsFiltered = await sut['applyFilter'](result, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(result);
  });

  it('Should filter by name or sku using a case insensitive term', async () => {
    const items = [
      new ProductEntity(ProductDataBuilder({ name: 'Camiseta', sku: 'P-001' })),
      new ProductEntity(ProductDataBuilder({ name: 'Calça', sku: 'P-002' })),
      new ProductEntity(ProductDataBuilder({ name: 'Tênis', sku: 'CAM-01' })),
    ];
    const spyFilter = vi.spyOn(items, 'filter');

    let itemsFiltered = await sut['applyFilter'](items, 'cam');
    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[0], items[2]]);

    itemsFiltered = await sut['applyFilter'](items, 'p-002');
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date();
    const items = [
      new ProductEntity(ProductDataBuilder({ name: 'Test', createdAt })),
      new ProductEntity(
        ProductDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new ProductEntity(
        ProductDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];
    const itemsSorted = await sut['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('Should sort by price field', async () => {
    const items = [
      new ProductEntity(ProductDataBuilder({ price: 300 })),
      new ProductEntity(ProductDataBuilder({ price: 100 })),
      new ProductEntity(ProductDataBuilder({ price: 200 })),
    ];

    let itemsSorted = await sut['applySort'](items, 'price', 'asc');
    expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]]);

    itemsSorted = await sut['applySort'](items, 'price', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]]);
  });
});
