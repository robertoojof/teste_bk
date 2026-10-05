export type OrderCustomer = {
  name: string;
  email: string;
};

export type OrderItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  externalId: string;
  platform: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalAmount: number;
  placedAt: string;
  createdAt: string;
};
