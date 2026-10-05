import type { Paginated, SearchParams } from '@/models/pagination.model';
import type {
  ProductCost,
  ProductWithCost,
  UpsertProductCostInput,
} from '@/models/product-cost.model';
import { apiRequest } from './http/api-request';
import { buildQueryString } from './http/build-query-string';

export const productCostsService = {
  list(params: SearchParams = {}) {
    return apiRequest<Paginated<ProductWithCost>>(
      `/product-costs${buildQueryString(params)}`,
    );
  },

  async upsert({ productId, unitCost }: UpsertProductCostInput) {
    const response = await apiRequest<{ data: ProductCost }>(
      `/product-costs/${productId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ unitCost }),
      },
    );
    return response.data;
  },
};
