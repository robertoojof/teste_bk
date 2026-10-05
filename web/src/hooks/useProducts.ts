import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { SearchParams } from '@/models/pagination.model';
import { productsService } from '@/services/products.service';
import { queryKeys } from '@/services/query-keys';

export function useProducts(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.list(params),
    placeholderData: keepPreviousData,
  });
}
