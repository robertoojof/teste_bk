import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/http/api-error';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        retry: (failureCount, error) =>
          !(
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) && failureCount < 2,
      },
    },
  });
}
