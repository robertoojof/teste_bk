import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { SearchParams } from '@/models/pagination.model';
import { ordersService } from '@/services/orders.service';
import { queryKeys } from '@/services/query-keys';
import { LIVE_REFRESH_INTERVAL } from './useDashboardSummary';

export function useOrders(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersService.list(params),
    placeholderData: keepPreviousData,
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}
