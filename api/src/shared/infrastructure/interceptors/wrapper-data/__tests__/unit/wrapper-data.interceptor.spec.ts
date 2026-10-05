import { firstValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';

describe('WrapperDataInterceptor unit tests', () => {
  let interceptor: WrapperDataInterceptor;
  let props: Record<string, unknown>;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = { name: 'Camiseta Básica', sku: 'P-001', price: 4990 };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrapper with data key', async () => {
    const obs$ = interceptor.intercept({} as any, { handle: () => of(props) });

    await expect(firstValueFrom(obs$)).resolves.toEqual({ data: props });
  });

  it('should not wrapper when meta key is present', async () => {
    const result = { data: [props], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, { handle: () => of(result) });

    await expect(firstValueFrom(obs$)).resolves.toEqual(result);
  });

  it('should not wrapper an empty body', async () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(undefined),
    });

    await expect(firstValueFrom(obs$)).resolves.toBeUndefined();
  });
});
