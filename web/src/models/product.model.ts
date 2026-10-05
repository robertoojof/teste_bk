export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  createdAt: string;
};

export type CreateProductInput = {
  name: string;
  sku: string;
  price: number;
};
