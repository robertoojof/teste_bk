import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { SearchParams } from '@/models/pagination.model';
import { productCostsService } from '@/services/product-costs.service';
import { queryKeys } from '@/services/query-keys';

export function useProductCosts(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.productCosts.list(params),
    queryFn: () => productCostsService.list(params),
    placeholderData: keepPreviousData,
  });
}
