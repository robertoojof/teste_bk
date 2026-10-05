import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProductInput } from '@/models/product.model';
import { productsService } from '@/services/products.service';
import { queryKeys } from '@/services/query-keys';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productsService.create(input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCosts.all,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      ]),
  });
}
