import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { toCents } from '@/shared/infrastructure/utils/to-cents';
import { ValidatedOrderWebhookMapper } from '../../validated-order-webhook.mapper';
import { EcommerceOrderWebhookPayload } from './ecommerce-order-webhook.payload';

export class EcommerceOrderWebhookMapper extends ValidatedOrderWebhookMapper<EcommerceOrderWebhookPayload> {
  static readonly PLATFORM = 'ecommerce';

  readonly platform = EcommerceOrderWebhookMapper.PLATFORM;

  protected readonly payloadClass = EcommerceOrderWebhookPayload;

  protected map(
    payload: EcommerceOrderWebhookPayload,
  ): CreateOrderUseCase.Input {
    return {
      externalId: payload.id,
      platform: this.platform,
      customer: {
        name: payload.buyer.buyerName,
        email: payload.buyer.buyerEmail,
      },
      items: payload.lineItems.map(item => ({
        sku: item.itemId,
        name: item.itemName,
        quantity: item.qty,
        unitPrice: toCents(item.unitPrice),
      })),
      totalAmount: toCents(payload.totalAmount),
      placedAt: new Date(payload.createdAt),
    };
  }
}
