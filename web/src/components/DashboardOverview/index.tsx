import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ErrorState } from '@/components/ErrorState';
import { MetricCard } from '@/components/MetricCard';
import { PeriodFilter } from '@/components/PeriodFilter';
import { SkusWithoutCostAlert } from '@/components/SkusWithoutCostAlert';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import type { Period } from '@/models/dashboard.model';
import { formatCurrency } from '@/utils/format-currency';
import { formatNumber } from '@/utils/format-number';
import { getLastDaysPeriod } from '@/utils/get-last-days-period';

export const DEFAULT_PERIOD_DAYS = 30;

type DashboardOverviewProps = {
  initialPeriod?: Period;
};

export function DashboardOverview({
  initialPeriod = getLastDaysPeriod(DEFAULT_PERIOD_DAYS),
}: DashboardOverviewProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const { data, isPending, isFetching, error, refetch } =
    useDashboardSummary(period);

  return (
    <section
      aria-labelledby='dashboard-heading'
      className='flex flex-col gap-4'
    >
      <header className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <h1 id='dashboard-heading' className='text-2xl font-semibold'>
            Dashboard
          </h1>
          <p className='text-sm text-muted-foreground'>
            Visão geral da sua loja
          </p>
        </div>
        <PeriodFilter
          defaultValues={initialPeriod}
          onFilter={setPeriod}
          isLoading={isFetching}
        />
      </header>

      {error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <MetricCard
              label='Lucro'
              icon={TrendingUp}
              isLoading={isPending}
              value={formatCurrency(data?.profit ?? 0)}
              tone={(data?.profit ?? 0) < 0 ? 'negative' : 'positive'}
            />
            <MetricCard
              label='Faturamento'
              icon={DollarSign}
              isLoading={isPending}
              value={formatCurrency(data?.revenue ?? 0)}
            />
            <MetricCard
              label='Custo Total'
              icon={Package}
              isLoading={isPending}
              value={formatCurrency(data?.totalCost ?? 0)}
            />
            <MetricCard
              label='Total de Pedidos'
              icon={ShoppingCart}
              isLoading={isPending}
              value={formatNumber(data?.ordersCount ?? 0)}
            />
          </div>
          <SkusWithoutCostAlert skus={data?.skusWithoutCost ?? []} />
        </>
      )}
    </section>
  );
}
