import { OrderOutput } from '@/orders/application/dtos/order-output';
import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { OrderWebhooksController } from '../../order-webhooks.controller';
import { OrderPresenter } from '../../presenters/order.presenter';

describe('OrderWebhooksController unit tests', () => {
  let sut: OrderWebhooksController;
  let input: CreateOrderUseCase.Input;
  let output: OrderOutput;
  let mapper: {
    platform: string;
    toCreateOrderInput: ReturnType<typeof vi.fn>;
  };
  let mockRegistry: { resolve: ReturnType<typeof vi.fn> };
  let mockCreateOrderUseCase: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sut = new OrderWebhooksController();
    input = {
      externalId: 'ORD-98432',
      platform: 'ecommerce',
      customer: { name: 'Maria Souza', email: 'maria@email.com' },
      items: [
        { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
      ],
      totalAmount: 9980,
      placedAt: new Date(),
    };
    output = { id: 'df96ae94', ...input, createdAt: new Date() };
    mapper = {
      platform: 'ecommerce',
      toCreateOrderInput: vi.fn().mockReturnValue(input),
    };
    mockRegistry = { resolve: vi.fn().mockReturnValue(mapper) };
    mockCreateOrderUseCase = { execute: vi.fn().mockResolvedValue(output) };
    sut['mapperRegistry'] = mockRegistry as any;
    sut['createOrderUseCase'] = mockCreateOrderUseCase as any;
  });

  it('should map the payload of the platform and create the order', async () => {
    const payload = { id: 'ORD-98432' };

    const presenter = await sut.receiveFromPlatform('ecommerce', payload);

    expect(mockRegistry.resolve).toHaveBeenCalledWith('ecommerce');
    expect(mapper.toCreateOrderInput).toHaveBeenCalledWith(payload);
    expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toStrictEqual(new OrderPresenter(output));
  });

  it('should use the default platform when none is given', async () => {
    await sut.receive({});

    expect(mockRegistry.resolve).toHaveBeenCalledWith(
      OrderWebhooksController.DEFAULT_PLATFORM,
    );
  });
});
