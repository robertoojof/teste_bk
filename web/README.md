# BK Dashboard — Web

Front-end do teste técnico da BK Company: uma tela com as 4 seções pedidas pelo cliente
(visão geral, pedidos, produtos e custos de produto), consumindo a API em `../api`.

**Stack:** React 19 + Vite + TypeScript, **shadcn/ui** (Radix + Tailwind CSS v4) como Design
System, **TanStack Query** para dados do servidor, **react-hook-form + Zod** para formulários,
date-fns, lucide-react e sonner. Testes com Vitest + Testing Library; lint e formatação com
Biome.

## Como rodar

Com a API rodando em `http://localhost:3000` (veja `../api`):

```bash
yarn install
yarn dev
```

Acesse <http://localhost:5173>. Para apontar para outra API, copie `.env.example` para
`.env.local` e ajuste `VITE_API_URL`.

| Script         | Descrição                          |
| -------------- | ---------------------------------- |
| `yarn dev`     | Servidor de desenvolvimento        |
| `yarn build`   | Type-check e build de produção     |
| `yarn preview` | Serve o build                      |
| `yarn test`    | Testes (Vitest + Testing Library)  |
| `yarn biome:check` | Lint e formatação (Biome)     |

## Funcionalidades

- **Visão Geral:** lucro, faturamento, custo total e quantidade de pedidos do período
  (padrão: últimos 30 dias), com filtro de datas validado e aviso quando há produtos vendidos
  sem custo cadastrado.
- **Pedidos Recentes:** pedidos recebidos via webhook, paginados e atualizados a cada 15 s;
  clicar em um pedido abre o detalhe com os itens.
- **Produtos:** catálogo paginado e botão **+ Novo** com formulário validado (SKU duplicado
  aparece no próprio campo).
- **Custos de Produto:** custo e margem de cada produto, com **edição direta na linha**
  (Enter salva, Esc cancela).

Depois de cadastrar um produto ou editar um custo, as seções afetadas e o dashboard são
atualizados automaticamente pela invalidação de cache do TanStack Query.

Valores trafegam em **centavos** entre front e API; a conversão para reais acontece só na
exibição (`formatCurrency`) e na digitação (`MoneyInput`, que monta o valor a partir dos
dígitos digitados).

## Arquitetura

O fluxo de dados é sempre `componente → hook → service → apiRequest`; componentes nunca
chamam `fetch` diretamente.

```text
src/
├── App.tsx · main.tsx        providers (QueryClient, Tooltip, Toaster)
├── config/env.ts             VITE_API_URL
├── models/                   tipos que espelham as respostas da API
├── schemas/                  schemas Zod dos formulários
├── services/
│   ├── http/                 apiRequest, ApiError, buildQueryString
│   ├── *.service.ts          um service por recurso da API
│   └── query-keys.ts         chaves de cache do TanStack Query
├── hooks/                    useDashboardSummary, useOrders, useProducts, useProductCosts,
│                             useCreateProduct, useUpsertProductCost
├── adapters/showMessage.ts   notificações (sonner) atrás de um adapter
├── utils/                    formatação de moeda, data, números e período
├── components/
│   ├── ui/                   componentes do shadcn/ui
│   ├── DashboardOverview/    Seção 1
│   ├── OrdersSection/        Seção 2 (OrdersTable, OrderDetailsDialog)
│   ├── ProductsSection/      Seção 4 (ProductsList, CreateProductDialog)
│   ├── ProductCostsSection/  Seção 3 (EditableCostCell)
│   └── …                     Section, MetricCard, MoneyInput, Pagination, estados vazio/erro/loading
├── templates/MainTemplate/
└── pages/Home/
```

Os testes ficam em `__tests__/` ao lado do código testado.
