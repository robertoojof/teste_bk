import { UnprocessableEntityException } from '@nestjs/common';
import { EcommerceOrderWebhookMapper } from '../../ecommerce-order-webhook.mapper';

function payloadFromSpec() {
  return {
    id: 'ORD-98432',
    buyer: {
      buyerName: 'Maria Souza',
      buyerEmail: 'maria@email.com',
    },
    lineItems: [
      {
        itemId: 'P-001',
        itemName: 'Camiseta Básica',
        qty: 2,
        unitPrice: 49.9,
      },
      {
        itemId: 'P-002',
        itemName: 'Calça Jeans',
        qty: 1,
        unitPrice: 129.9,
      },
    ],
    totalAmount: 229.7,
    createdAt: '2025-02-10T14:32:00Z',
  };
}

function messagesOf(fn: () => unknown): string[] {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(UnprocessableEntityException);
    return (
      (error as UnprocessableEntityException).getResponse() as {
        message: string[];
      }
    ).message;
  }
  throw new Error('expected the mapper to throw');
}

describe('EcommerceOrderWebhookMapper unit tests', () => {
  let sut: EcommerceOrderWebhookMapper;

  beforeEach(() => {
    sut = new EcommerceOrderWebhookMapper();
  });

  it('should identify the platform', () => {
    expect(sut.platform).toBe('ecommerce');
  });

  it('should map the payload of the spec to the domain input', () => {
    expect(sut.toCreateOrderInput(payloadFromSpec())).toStrictEqual({
      externalId: 'ORD-98432',
      platform: 'ecommerce',
      customer: { name: 'Maria Souza', email: 'maria@email.com' },
      items: [
        { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
        { sku: 'P-002', name: 'Calça Jeans', quantity: 1, unitPrice: 12990 },
      ],
      totalAmount: 22970,
      placedAt: new Date('2025-02-10T14:32:00Z'),
    });
  });

  it('should ignore unknown fields sent by the platform', () => {
    const input = sut.toCreateOrderInput({
      ...payloadFromSpec(),
      status: 'paid',
    });
    expect(input).not.toHaveProperty('status');
  });

  it.each([null, 'payload', 10, []])(
    'should reject a payload that is not an object (%s)',
    payload => {
      expect(messagesOf(() => sut.toCreateOrderInput(payload))).toStrictEqual([
        'payload must be an object',
      ]);
    },
  );

  it('should reject an invalid payload listing every invalid field', () => {
    const messages = messagesOf(() =>
      sut.toCreateOrderInput({
        id: '',
        buyer: { buyerName: 'Maria', buyerEmail: 'invalid' },
        lineItems: [
          { itemId: 'P-001', itemName: 'A', qty: 0, unitPrice: 1.999 },
        ],
        totalAmount: -1,
        createdAt: 'yesterday',
      }),
    );

    expect(messages).toStrictEqual([
      'id should not be empty',
      'buyer.buyerEmail must be an email',
      'lineItems.0.qty must not be less than 1',
      'lineItems.0.unitPrice must be a number conforming to the specified constraints',
      'totalAmount must not be less than 0',
      'createdAt must be a valid ISO 8601 date string',
    ]);
  });

  it('should reject a payload without line items', () => {
    expect(
      messagesOf(() =>
        sut.toCreateOrderInput({ ...payloadFromSpec(), lineItems: [] }),
      ),
    ).toStrictEqual(['lineItems should not be empty']);
  });
});
