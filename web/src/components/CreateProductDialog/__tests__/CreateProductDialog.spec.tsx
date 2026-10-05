import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showMessage } from '@/adapters/showMessage';
import { ApiError } from '@/services/http/api-error';
import { productsService } from '@/services/products.service';
import { renderWithProviders } from '@/test/render-with-providers';
import { CreateProductDialog } from '..';

async function fillForm() {
  await userEvent.type(screen.getByLabelText('Nome'), 'Camiseta Básica');
  await userEvent.type(screen.getByLabelText('SKU'), 'P-001');
  await userEvent.type(screen.getByLabelText('Preço de venda'), '4990');
}

describe('CreateProductDialog', () => {
  beforeEach(() => {
    vi.spyOn(showMessage, 'success').mockImplementation(() => '');
    vi.spyOn(showMessage, 'error').mockImplementation(() => '');
  });

  it('validates the required fields', async () => {
    const create = vi.spyOn(productsService, 'create');
    renderWithProviders(<CreateProductDialog open onOpenChange={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Informe o nome do produto'),
    ).toBeInTheDocument();
    expect(screen.getByText('Informe o SKU')).toBeInTheDocument();
    expect(screen.getByText('Informe o preço de venda')).toBeInTheDocument();
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the product with the price in cents and closes', async () => {
    const create = vi.spyOn(productsService, 'create').mockResolvedValue({
      id: 'product-1',
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
      createdAt: '2025-02-10T14:32:00.000Z',
    });
    const onOpenChange = vi.fn();
    renderWithProviders(
      <CreateProductDialog open onOpenChange={onOpenChange} />,
    );

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    await waitFor(() =>
      expect(create).toHaveBeenCalledWith({
        name: 'Camiseta Básica',
        sku: 'P-001',
        price: 4990,
      }),
    );
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(showMessage.success).toHaveBeenCalledWith(
      'Produto Camiseta Básica cadastrado',
    );
  });

  it('shows the duplicated SKU error on the field', async () => {
    vi.spyOn(productsService, 'create').mockRejectedValue(
      new ApiError(409, ['SKU already used']),
    );
    const onOpenChange = vi.fn();
    renderWithProviders(
      <CreateProductDialog open onOpenChange={onOpenChange} />,
    );

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Este SKU já está cadastrado'),
    ).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('shows the API messages for other errors', async () => {
    vi.spyOn(productsService, 'create').mockRejectedValue(
      new ApiError(0, ['Erro ao conectar com o servidor.']),
    );
    renderWithProviders(<CreateProductDialog open onOpenChange={() => {}} />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    await waitFor(() =>
      expect(showMessage.error).toHaveBeenCalledWith(
        'Erro ao conectar com o servidor.',
      ),
    );
  });
});
