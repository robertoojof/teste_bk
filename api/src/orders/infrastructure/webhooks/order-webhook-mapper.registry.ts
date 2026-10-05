import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { OrderWebhookMapper } from './order-webhook-mapper';

export class OrderWebhookMapperRegistry {
  private readonly mappers = new Map<string, OrderWebhookMapper>();

  constructor(mappers: OrderWebhookMapper[]) {
    for (const mapper of mappers) {
      this.mappers.set(mapper.platform, mapper);
    }
  }

  get platforms(): string[] {
    return [...this.mappers.keys()];
  }

  resolve(platform: string): OrderWebhookMapper {
    const mapper = this.mappers.get(platform);
    if (!mapper) {
      throw new NotFoundError(`Platform ${platform} is not supported`);
    }
    return mapper;
  }
}
