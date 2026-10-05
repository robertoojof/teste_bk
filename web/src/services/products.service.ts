import type { Paginated, SearchParams } from '@/models/pagination.model';
import type { CreateProductInput, Product } from '@/models/product.model';
import { apiRequest } from './http/api-request';
import { buildQueryString } from './http/build-query-string';

export const productsService = {
  list(params: SearchParams = {}) {
    return apiRequest<Paginated<Product>>(
      `/products${buildQueryString(params)}`,
    );
  },

  async create(input: CreateProductInput) {
    const response = await apiRequest<{ data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.data;
  },
};
