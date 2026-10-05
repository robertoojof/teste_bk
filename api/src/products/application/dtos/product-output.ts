import { ProductEntity } from '@/products/domain/entities/product.entity';

export type ProductOutput = {
  id: string;
  name: string;
  sku: string;
  price: number;
  createdAt: Date;
};

export class ProductOutputMapper {
  static toOutput(entity: ProductEntity): ProductOutput {
    return entity.toJSON();
  }
}
