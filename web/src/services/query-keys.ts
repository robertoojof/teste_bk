import type { Period } from '@/models/dashboard.model';
import type { SearchParams } from '@/models/pagination.model';

export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    summary: (period: Period) => ['dashboard', 'summary', period] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params: SearchParams) => ['orders', 'list', params] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: SearchParams) => ['products', 'list', params] as const,
  },
  productCosts: {
    all: ['product-costs'] as const,
    list: (params: SearchParams) => ['product-costs', 'list', params] as const,
  },
};
