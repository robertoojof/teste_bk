# BK Dashboard

Teste técnico da BK Company: faturamento, custo e lucro por período,
cadastro de produtos e de custos e recebimento de pedidos via webhook da plataforma de
e-commerce.

| Pasta           | Conteúdo                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| [`api/`](./api) | NestJS + class-validator, DDD / Clean Architecture, repositórios em memória |
| [`web/`](./web) | React + Vite, shadcn/ui, TanStack Query, react-hook-form + Zod             |

**Vídeo de demonstração:** _adicione aqui o link do vídeo_

## Como rodar

Requisitos: **Node.js 20+** e **Yarn 1**.

```bash
yarn install   # instala a raiz, a api e o web
yarn dev       # sobe a API (porta 3000) e o front (porta 5173) juntos
```

- Front: <http://localhost:5173>
- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/api>

Nenhum banco de dados ou variável de ambiente é necessário. Em desenvolvimento a API já sobe
com dados de demonstração, então a tela abre preenchida.

Para simular um pedido chegando pela plataforma de e-commerce:

```bash
curl -X POST http://localhost:3000/webhooks/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "ORD-98432",
    "buyer": { "buyerName": "Maria Souza", "buyerEmail": "maria@email.com" },
    "lineItems": [
      { "itemId": "P-001", "itemName": "Camiseta Básica", "qty": 2, "unitPrice": 49.90 },
      { "itemId": "P-002", "itemName": "Calça Jeans", "qty": 1, "unitPrice": 129.90 }
    ],
    "totalAmount": 229.70,
    "createdAt": "2025-02-10T14:32:00Z"
  }'
```

O pedido aparece em **Pedidos Recentes** em até 15 segundos. Filtre o dashboard por
fevereiro/2025 para ver os indicadores dele.

## Scripts da raiz

| Script       | Descrição                                     |
| ------------ | --------------------------------------------- |
| `yarn dev`   | API e front em modo de desenvolvimento        |
| `yarn build` | Build da API e do front                       |
| `yarn test`  | Testes da API (unitários e e2e) e do front    |
| `yarn lint`  | Lint da API e do front (Biome)                |

## Documentação

- [API](./api/README.md): endpoints, formato do webhook, arquitetura em camadas, SOLID na
  prática e decisões de modelagem.
- [Web](./web/README.md): seções da tela, fluxo de dados e organização dos componentes.
