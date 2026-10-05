import { ApiError } from '../http/api-error';
import { apiRequest } from '../http/api-request';

function mockFetch(status: number, body: unknown) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

async function catchError(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error as ApiError;
  }
  throw new Error('expected the request to fail');
}

describe('apiRequest', () => {
  it('returns the parsed body and sends JSON headers', async () => {
    const fetchSpy = mockFetch(200, { data: { id: '1' } });

    await expect(apiRequest('/products/1')).resolves.toStrictEqual({
      data: { id: '1' },
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/products/1',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('throws an ApiError with the list of messages from the API', async () => {
    mockFetch(422, {
      statusCode: 422,
      message: ['name should not be empty', 'price must be an integer number'],
    });

    const error = await catchError(apiRequest('/products'));

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.messages).toStrictEqual([
      'name should not be empty',
      'price must be an integer number',
    ]);
  });

  it('throws an ApiError with a single message', async () => {
    mockFetch(409, { statusCode: 409, message: 'SKU already used' });

    const error = await catchError(apiRequest('/products'));

    expect(error.status).toBe(409);
    expect(error.messages).toStrictEqual(['SKU already used']);
  });

  it('throws a connection error when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('failed'));

    const error = await catchError(apiRequest('/products'));

    expect(error.status).toBe(0);
    expect(error.messages).toStrictEqual(['Erro ao conectar com o servidor.']);
  });
});
