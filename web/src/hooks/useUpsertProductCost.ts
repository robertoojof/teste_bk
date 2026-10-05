import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpsertProductCostInput } from '@/models/product-cost.model';
import { productCostsService } from '@/services/product-costs.service';
import { queryKeys } from '@/services/query-keys';

export function useUpsertProductCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertProductCostInput) =>
      productCostsService.upsert(input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCosts.all,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      ]),
  });
}
