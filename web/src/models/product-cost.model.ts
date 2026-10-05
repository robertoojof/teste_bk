export type ProductCost = {
  id: string;
  productId: string;
  unitCost: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductWithCost = {
  productId: string;
  name: string;
  sku: string;
  price: number;
  unitCost: number | null;
  margin: number | null;
  costUpdatedAt: string | null;
};

export type UpsertProductCostInput = {
  productId: string;
  unitCost: number;
};
