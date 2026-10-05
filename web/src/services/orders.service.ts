import type { Order } from '@/models/order.model';
import type { Paginated, SearchParams } from '@/models/pagination.model';
import { apiRequest } from './http/api-request';
import { buildQueryString } from './http/build-query-string';

export const ordersService = {
  list(params: SearchParams = {}) {
    return apiRequest<Paginated<Order>>(`/orders${buildQueryString(params)}`);
  },
};
