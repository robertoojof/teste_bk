import { ProductOutput } from '@/products/application/dtos/product-output';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase';
import { CreateProductDto } from '../../dtos/create-product.dto';
import {
  ProductCollectionPresenter,
  ProductPresenter,
} from '../../presenters/product.presenter';
import { ProductsController } from '../../products.controller';

describe('ProductsController unit tests', () => {
  let sut: ProductsController;
  let id: string;
  let props: ProductOutput;

  beforeEach(() => {
    sut = new ProductsController();
    id = 'df96ae94-6128-486e-840c-b6f78abb4801';
    props = {
      id,
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a product', async () => {
    const output: CreateProductUseCase.Output = props;
    const mockCreateProductUseCase = {
      execute: vi.fn().mockResolvedValue(output),
    };
    sut['createProductUseCase'] = mockCreateProductUseCase as any;
    const input: CreateProductDto = {
      name: 'Camiseta Básica',
      sku: 'P-001',
      price: 4990,
    };

    const presenter = await sut.create(input);

    expect(presenter).toBeInstanceOf(ProductPresenter);
    expect(presenter).toStrictEqual(new ProductPresenter(output));
    expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should search products', async () => {
    const output: ListProductsUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockListProductsUseCase = {
      execute: vi.fn().mockResolvedValue(output),
    };
    sut['listProductsUseCase'] = mockListProductsUseCase as any;
    const searchParams = { page: 1, perPage: 1 };

    const presenter = await sut.search(searchParams);

    expect(presenter).toBeInstanceOf(ProductCollectionPresenter);
    expect(presenter).toEqual(new ProductCollectionPresenter(output));
    expect(mockListProductsUseCase.execute).toHaveBeenCalledWith(searchParams);
  });

  it('should get a product', async () => {
    const mockGetProductUseCase = {
      execute: vi.fn().mockResolvedValue(props),
    };
    sut['getProductUseCase'] = mockGetProductUseCase as any;

    const presenter = await sut.findOne(id);

    expect(presenter).toBeInstanceOf(ProductPresenter);
    expect(presenter).toStrictEqual(new ProductPresenter(props));
    expect(mockGetProductUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
