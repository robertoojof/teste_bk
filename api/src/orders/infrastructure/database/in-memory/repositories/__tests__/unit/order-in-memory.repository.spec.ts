import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderInMemoryRepository } from '../../order-in-memory.repository';

describe('OrderInMemoryRepository unit tests', () => {
  let sut: OrderInMemoryRepository;

  beforeEach(() => {
    sut = new OrderInMemoryRepository();
  });

  describe('findByExternalId method', () => {
    it('Should return null when not found', async () => {
      await expect(
        sut.findByExternalId('ecommerce', 'ORD-1'),
      ).resolves.toBeNull();
    });

    it('Should find an order by platform and externalId', async () => {
      const entity = new OrderEntity(
        OrderDataBuilder({ platform: 'ecommerce', externalId: 'ORD-1' }),
      );
      await sut.insert(entity);

      await expect(sut.findByExternalId('ecommerce', 'ORD-1')).resolves.toBe(
        entity,
      );
      await expect(sut.findByExternalId('other', 'ORD-1')).resolves.toBeNull();
    });
  });

  describe('findByPeriod method', () => {
    it('Should return the orders placed inside the period, inclusive', async () => {
      const at = (iso: string) =>
        new OrderEntity(OrderDataBuilder({ placedAt: new Date(iso) }));
      const before = at('2025-01-31T23:59:59.999Z');
      const start = at('2025-02-01T00:00:00.000Z');
      const middle = at('2025-02-15T12:00:00.000Z');
      const end = at('2025-02-28T23:59:59.999Z');
      const after = at('2025-03-01T00:00:00.000Z');
      sut.items = [before, start, middle, end, after];

      const result = await sut.findByPeriod(
        new Date('2025-02-01T00:00:00.000Z'),
        new Date('2025-02-28T23:59:59.999Z'),
      );

      expect(result).toStrictEqual([start, middle, end]);
    });
  });

  describe('applyFilter method', () => {
    it('Should no filter items when filter is null', async () => {
      const items = [new OrderEntity(OrderDataBuilder({}))];
      const spyFilter = vi.spyOn(items, 'filter');

      const result = await sut['applyFilter'](items, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(result).toStrictEqual(items);
    });

    it('Should filter by externalId, customer name or email', async () => {
      const items = [
        new OrderEntity(
          OrderDataBuilder({
            externalId: 'ORD-98432',
            customer: { name: 'Maria', email: 'maria@email.com' },
          }),
        ),
        new OrderEntity(
          OrderDataBuilder({
            externalId: 'ORD-1',
            customer: { name: 'João Silva', email: 'joao@email.com' },
          }),
        ),
        new OrderEntity(
          OrderDataBuilder({
            externalId: 'ORD-2',
            customer: { name: 'Ana', email: 'ana@silva.com' },
          }),
        ),
      ];

      expect(await sut['applyFilter'](items, 'ord-98')).toStrictEqual([
        items[0],
      ]);
      expect(await sut['applyFilter'](items, 'SILVA')).toStrictEqual([
        items[1],
        items[2],
      ]);
    });
  });

  describe('applySort method', () => {
    it('Should sort by placedAt desc when sort param is null', async () => {
      const items = ['2025-02-01', '2025-02-03', '2025-02-02'].map(
        date => new OrderEntity(OrderDataBuilder({ placedAt: new Date(date) })),
      );

      const result = await sut['applySort'](items, null, null);

      expect(result).toStrictEqual([items[1], items[2], items[0]]);
    });
  });
});
