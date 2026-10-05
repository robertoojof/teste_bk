import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dashboardService } from '@/services/dashboard.service';
import { ApiError } from '@/services/http/api-error';
import { normalizeSpaces } from '@/test/normalize-spaces';
import { renderWithProviders } from '@/test/render-with-providers';
import { DashboardOverview } from '..';

const initialPeriod = { startDate: '2025-02-01', endDate: '2025-02-28' };

const summary = {
  ...initialPeriod,
  ordersCount: 1248,
  revenue: 24589000,
  totalCost: 9834000,
  profit: 14755000,
  skusWithoutCost: [],
};

function metric(label: string) {
  return normalizeSpaces(screen.getByLabelText(label).textContent);
}

describe('DashboardOverview', () => {
  it('shows the indicators of the initial period', async () => {
    const getSummary = vi
      .spyOn(dashboardService, 'getSummary')
      .mockResolvedValue(summary);

    renderWithProviders(<DashboardOverview initialPeriod={initialPeriod} />);

    await waitFor(() => expect(metric('Lucro')).toBe('R$ 147.550,00'));
    expect(metric('Faturamento')).toBe('R$ 245.890,00');
    expect(metric('Custo Total')).toBe('R$ 98.340,00');
    expect(metric('Total de Pedidos')).toBe('1.248');
    expect(getSummary).toHaveBeenCalledWith(initialPeriod);
  });

  it('queries the indicators again when the period is filtered', async () => {
    const getSummary = vi
      .spyOn(dashboardService, 'getSummary')
      .mockResolvedValue(summary);
    renderWithProviders(<DashboardOverview initialPeriod={initialPeriod} />);

    fireEvent.change(screen.getByLabelText('Data Inicial'), {
      target: { value: '2025-01-01' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    await waitFor(() =>
      expect(getSummary).toHaveBeenLastCalledWith({
        startDate: '2025-01-01',
        endDate: '2025-02-28',
      }),
    );
  });

  it('warns about skus sold without cost', async () => {
    vi.spyOn(dashboardService, 'getSummary').mockResolvedValue({
      ...summary,
      skusWithoutCost: ['P-002', 'P-005'],
    });

    renderWithProviders(<DashboardOverview initialPeriod={initialPeriod} />);

    expect(
      await screen.findByText('Produtos vendidos sem custo cadastrado'),
    ).toBeInTheDocument();
    expect(screen.getByText(/P-002, P-005/)).toBeInTheDocument();
  });

  it('shows the error and retries', async () => {
    const getSummary = vi
      .spyOn(dashboardService, 'getSummary')
      .mockRejectedValueOnce(
        new ApiError(0, ['Erro ao conectar com o servidor.']),
      )
      .mockResolvedValue(summary);

    renderWithProviders(<DashboardOverview initialPeriod={initialPeriod} />);

    expect(
      await screen.findByText('Erro ao conectar com o servidor.'),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    );

    await waitFor(() => expect(metric('Lucro')).toBe('R$ 147.550,00'));
    expect(getSummary).toHaveBeenCalledTimes(2);
  });
});
