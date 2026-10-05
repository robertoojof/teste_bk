import { useQuery } from '@tanstack/react-query';
import type { Period } from '@/models/dashboard.model';
import { dashboardService } from '@/services/dashboard.service';
import { queryKeys } from '@/services/query-keys';

export const LIVE_REFRESH_INTERVAL = 15_000;

export function useDashboardSummary(period: Period) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(period),
    queryFn: () => dashboardService.getSummary(period),
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}
