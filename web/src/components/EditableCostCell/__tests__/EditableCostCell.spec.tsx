import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showMessage } from '@/adapters/showMessage';
import type { ProductWithCost } from '@/models/product-cost.model';
import { ApiError } from '@/services/http/api-error';
import { productCostsService } from '@/services/product-costs.service';
import { normalizeSpaces } from '@/test/normalize-spaces';
import { renderWithProviders } from '@/test/render-with-providers';
import { EditableCostCell } from '..';

const product: ProductWithCost = {
  productId: 'product-1',
  name: 'Camiseta Básica',
  sku: 'P-001',
  price: 4990,
  unitCost: 1800,
  margin: 3190,
  costUpdatedAt: '2025-02-10T14:32:00.000Z',
};

describe('EditableCostCell', () => {
  beforeEach(() => {
    vi.spyOn(showMessage, 'success').mockImplementation(() => '');
    vi.spyOn(showMessage, 'error').mockImplementation(() => '');
  });

  it('shows the current cost', () => {
    renderWithProviders(<EditableCostCell product={product} />);

    expect(normalizeSpaces(screen.getByText(/R\$/).textContent)).toBe(
      'R$ 18,00',
    );
  });

  it('shows a badge when the product has no cost', () => {
    renderWithProviders(
      <EditableCostCell
        product={{ ...product, unitCost: null, margin: null }}
      />,
    );

    expect(screen.getByText('Sem custo')).toBeInTheDocument();
  });

  it('saves the new cost with Enter', async () => {
    const upsert = vi.spyOn(productCostsService, 'upsert').mockResolvedValue({
      id: 'cost-1',
      productId: product.productId,
      unitCost: 2000,
      createdAt: '',
      updatedAt: '',
    });
    const { queryClient } = renderWithProviders(
      <EditableCostCell product={product} />,
    );
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    await userEvent.click(
      screen.getByRole('button', { name: 'Editar custo de Camiseta Básica' }),
    );
    const input = screen.getByLabelText('Custo de Camiseta Básica');
    await userEvent.clear(input);
    await userEvent.type(input, '2000{Enter}');

    await waitFor(() =>
      expect(upsert).toHaveBeenCalledWith({
        productId: 'product-1',
        unitCost: 2000,
      }),
    );
    await waitFor(() =>
      expect(showMessage.success).toHaveBeenCalledWith(
        'Custo de Camiseta Básica atualizado',
      ),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['product-costs'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(
      screen.queryByLabelText('Custo de Camiseta Básica'),
    ).not.toBeInTheDocument();
  });

  it('cancels the edition with Escape without saving', async () => {
    const upsert = vi.spyOn(productCostsService, 'upsert');
    renderWithProviders(<EditableCostCell product={product} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Editar custo de Camiseta Básica' }),
    );
    await userEvent.type(
      screen.getByLabelText('Custo de Camiseta Básica'),
      '9{Escape}',
    );

    expect(upsert).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Editar custo de Camiseta Básica' }),
    ).toBeInTheDocument();
  });

  it('does not call the API when the cost did not change', async () => {
    const upsert = vi.spyOn(productCostsService, 'upsert');
    renderWithProviders(<EditableCostCell product={product} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Editar custo de Camiseta Básica' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Salvar custo' }));

    expect(upsert).not.toHaveBeenCalled();
  });

  it('keeps editing and shows the error when the API fails', async () => {
    vi.spyOn(productCostsService, 'upsert').mockRejectedValue(
      new ApiError(404, ['Entity not found']),
    );
    renderWithProviders(<EditableCostCell product={product} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Editar custo de Camiseta Básica' }),
    );
    await userEvent.type(
      screen.getByLabelText('Custo de Camiseta Básica'),
      '1{Enter}',
    );

    await waitFor(() =>
      expect(showMessage.error).toHaveBeenCalledWith('Entity not found'),
    );
    expect(
      screen.getByLabelText('Custo de Camiseta Básica'),
    ).toBeInTheDocument();
  });
});
