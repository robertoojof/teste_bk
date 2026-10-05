import type { DashboardSummary, Period } from '@/models/dashboard.model';
import { apiRequest } from './http/api-request';
import { buildQueryString } from './http/build-query-string';

export const dashboardService = {
  async getSummary(period: Period) {
    const response = await apiRequest<{ data: DashboardSummary }>(
      `/dashboard${buildQueryString(period)}`,
    );
    return response.data;
  },
};
