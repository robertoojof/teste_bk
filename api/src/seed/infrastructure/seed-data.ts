export type SeedProduct = {
  sku: string;
  name: string;
  price: number;
  unitCost: number | null;
};

export type SeedOrder = {
  externalId: string;
  customer: { name: string; email: string };
  items: { sku: string; quantity: number }[];
  hoursAgo: number;
};

export const seedProducts: SeedProduct[] = [
  { sku: 'P-001', name: 'Camiseta Básica', price: 4990, unitCost: 1800 },
  { sku: 'P-002', name: 'Calça Jeans', price: 12990, unitCost: 5200 },
  { sku: 'P-003', name: 'Tênis Esportivo', price: 19990, unitCost: 8500 },
  { sku: 'P-004', name: 'Jaqueta Corta-Vento', price: 24990, unitCost: 11000 },
  { sku: 'P-005', name: 'Boné Aba Curva', price: 5990, unitCost: null },
];

export const seedOrders: SeedOrder[] = [
  {
    externalId: 'ORD-98431',
    customer: { name: 'João Silva', email: 'joao@email.com' },
    items: [
      { sku: 'P-004', quantity: 1 },
      { sku: 'P-003', quantity: 1 },
    ],
    hoursAgo: 3,
  },
  {
    externalId: 'ORD-98430',
    customer: { name: 'Ana Costa', email: 'ana@email.com' },
    items: [{ sku: 'P-001', quantity: 1 }],
    hoursAgo: 27,
  },
  {
    externalId: 'ORD-98429',
    customer: { name: 'Carlos Mendes', email: 'carlos@email.com' },
    items: [
      { sku: 'P-003', quantity: 1 },
      { sku: 'P-002', quantity: 1 },
    ],
    hoursAgo: 52,
  },
  {
    externalId: 'ORD-98428',
    customer: { name: 'Fernanda Lima', email: 'fernanda@email.com' },
    items: [
      { sku: 'P-001', quantity: 2 },
      { sku: 'P-005', quantity: 1 },
    ],
    hoursAgo: 76,
  },
  {
    externalId: 'ORD-98427',
    customer: { name: 'Beatriz Rocha', email: 'beatriz@email.com' },
    items: [{ sku: 'P-002', quantity: 2 }],
    hoursAgo: 150,
  },
  {
    externalId: 'ORD-98426',
    customer: { name: 'Rafael Alves', email: 'rafael@email.com' },
    items: [
      { sku: 'P-004', quantity: 1 },
      { sku: 'P-001', quantity: 3 },
    ],
    hoursAgo: 290,
  },
  {
    externalId: 'ORD-98425',
    customer: { name: 'Juliana Martins', email: 'juliana@email.com' },
    items: [{ sku: 'P-003', quantity: 2 }],
    hoursAgo: 480,
  },
];
