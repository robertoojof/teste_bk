import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PeriodFilter } from '..';

const defaultValues = { startDate: '2025-02-01', endDate: '2025-02-28' };

describe('PeriodFilter', () => {
  it('submits the selected period', async () => {
    const onFilter = vi.fn();
    render(<PeriodFilter defaultValues={defaultValues} onFilter={onFilter} />);

    fireEvent.change(screen.getByLabelText('Data Inicial'), {
      target: { value: '2025-01-01' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    await waitFor(() =>
      expect(onFilter).toHaveBeenCalledWith(
        { startDate: '2025-01-01', endDate: '2025-02-28' },
        expect.anything(),
      ),
    );
  });

  it('does not submit when the end date is before the start date', async () => {
    const onFilter = vi.fn();
    render(<PeriodFilter defaultValues={defaultValues} onFilter={onFilter} />);

    fireEvent.change(screen.getByLabelText('Data Final'), {
      target: { value: '2025-01-01' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A data final deve ser igual ou posterior à inicial',
    );
    expect(onFilter).not.toHaveBeenCalled();
  });

  it('requires both dates', async () => {
    const onFilter = vi.fn();
    render(<PeriodFilter defaultValues={defaultValues} onFilter={onFilter} />);

    fireEvent.change(screen.getByLabelText('Data Inicial'), {
      target: { value: '' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Informe a data inicial',
    );
    expect(onFilter).not.toHaveBeenCalled();
  });
});
