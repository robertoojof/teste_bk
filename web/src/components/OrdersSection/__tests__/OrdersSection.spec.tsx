import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Order } from '@/models/order.model';
import { ordersService } from '@/services/orders.service';
import { renderWithProviders } from '@/test/render-with-providers';
import { ORDERS_PER_PAGE, OrdersSection } from '..';

const order: Order = {
  id: 'order-1',
  externalId: 'ORD-98432',
  platform: 'ecommerce',
  customer: { name: 'Maria Souza', email: 'maria@email.com' },
  items: [
    { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
    { sku: 'P-002', name: 'Calça Jeans', quantity: 1, unitPrice: 12990 },
  ],
  totalAmount: 22970,
  placedAt: '2025-02-10T14:32:00',
  createdAt: '2025-02-10T14:32:05',
};

describe('OrdersSection', () => {
  it('shows an empty state without orders', async () => {
    vi.spyOn(ordersService, 'list').mockResolvedValue({
      data: [],
      meta: { currentPage: 1, perPage: 5, lastPage: 0, total: 0 },
    });

    renderWithProviders(<OrdersSection />);

    expect(
      await screen.findByText('Nenhum pedido recebido'),
    ).toBeInTheDocument();
  });

  it('lists the orders and opens the details with the items', async () => {
    const list = vi.spyOn(ordersService, 'list').mockResolvedValue({
      data: [order],
      meta: { currentPage: 1, perPage: 5, lastPage: 1, total: 1 },
    });

    renderWithProviders(<OrdersSection />);

    const row = await screen.findByRole('row', {
      name: 'Ver detalhes do pedido ORD-98432',
    });
    expect(within(row).getByText('Maria Souza')).toBeInTheDocument();
    expect(within(row).getByText('10/02/2025')).toBeInTheDocument();
    expect(list).toHaveBeenCalledWith({ page: 1, perPage: ORDERS_PER_PAGE });

    await userEvent.click(row);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Pedido ORD-98432')).toBeInTheDocument();
    expect(within(dialog).getByText('maria@email.com')).toBeInTheDocument();
    expect(within(dialog).getByText('Camiseta Básica')).toBeInTheDocument();
    expect(within(dialog).getByText('Calça Jeans')).toBeInTheDocument();
  });

  it('navigates between pages', async () => {
    const list = vi.spyOn(ordersService, 'list').mockResolvedValue({
      data: [order],
      meta: { currentPage: 1, perPage: 5, lastPage: 2, total: 6 },
    });

    renderWithProviders(<OrdersSection />);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Próxima página' }),
    );

    await waitFor(() =>
      expect(list).toHaveBeenLastCalledWith({ page: 2, perPage: 5 }),
    );
  });
});
