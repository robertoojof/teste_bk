# BK Dashboard - API

API do teste técnico da BK Company: cadastro de **produtos** e de **custos de produto**,
recebimento de **pedidos via webhook** da plataforma de e-commerce e **dashboard** com
quantidade de pedidos, faturamento, custo e lucro por período.

Construída com **NestJS 12 + class-validator**, seguindo **DDD / Clean Architecture**, com
persistência em **repositórios em memória** atrás de interfaces (sem banco de dados).

## Como rodar

Requisitos: **Node.js 20+** e **Yarn 1**.

```bash
yarn install
yarn start:dev
```

- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/api>

Em `start:dev` a API sobe com **dados de demonstração**: 5 produtos (um deles sem custo) e
7 pedidos espalhados pelos últimos 20 dias, relativos ao momento em que a API sobe. Assim o
dashboard dos últimos 30 dias já tem o que mostrar. Como a persistência é em memória, os
dados voltam ao estado inicial a cada reinício.

Nenhuma configuração é obrigatória. Opcionalmente, copie `.env.example` para
`.env.development` para mudar a porta (`PORT`).

O arquivo [`requests.http`](./requests.http) tem todas as requisições prontas
(extensão REST Client do VS Code), incluindo o webhook do enunciado.

### Scripts

| Script               | Descrição                                            |
| -------------------- | ---------------------------------------------------- |
| `yarn start:dev`     | API em modo watch, com seed (`NODE_ENV=development`) |
| `yarn build`         | Compila para `dist/`                                 |
| `yarn start:prod`    | Executa o build (`NODE_ENV=production`, sem seed)    |
| `yarn test`          | Testes unitários e de integração                     |
| `yarn test:e2e`      | Testes end-to-end (HTTP)                             |
| `yarn test:cov`      | Cobertura                                            |
| `yarn lint`          | Lint (Biome)                                         |
| `yarn format`        | Formatação (Biome)                                   |

## Endpoints

> **Valores monetários são inteiros em centavos** (`4990` = R$ 49,90), para evitar erros de
> arredondamento de ponto flutuante. O webhook continua recebendo decimais; a conversão é
> feita pelo mapper.

Respostas de um recurso vêm em `{ "data": ... }`; listagens em `{ "data": [...], "meta": {...} }`.

| Método | Rota                                  | Descrição                                                  |
| ------ | ------------------------------------- | ---------------------------------------------------------- |
| `POST` | `/products`                           | Cadastra produto (`name`, `sku`, `price`). SKU único (409) |
| `GET`  | `/products`                           | Lista produtos (paginação, ordenação, filtro nome/SKU)     |
| `GET`  | `/products/:id`                       | Detalhe do produto                                         |
| `GET`  | `/product-costs`                      | Lista produtos com custo e margem (`null` se sem custo)    |
| `PUT`  | `/product-costs/:productId`           | Cadastra ou edita o custo do produto (`unitCost`)          |
| `POST` | `/webhooks/orders`                    | Recebe o webhook de pedido (plataforma padrão)             |
| `POST` | `/webhooks/orders/:platform`          | Recebe o webhook de uma plataforma específica              |
| `GET`  | `/orders`                             | Lista pedidos (recentes primeiro; filtro código/cliente)   |
| `GET`  | `/orders/:id`                         | Detalhe do pedido com itens                                |
| `GET`  | `/dashboard?startDate=&endDate=`      | Indicadores do período (`YYYY-MM-DD`, dias inteiros)       |

Listagens aceitam `page`, `perPage` (padrão 15), `sort`, `sortDir` (`asc`/`desc`) e `filter`.

### Webhook

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

| Situação                                   | Resposta                                       |
| ------------------------------------------ | ---------------------------------------------- |
| Pedido novo                                | `200` com o pedido no formato do domínio       |
| Mesmo pedido reenviado (mesmo `id`)        | `200` com o pedido já existente, sem duplicar  |
| Payload inválido                           | `422` com a lista de campos inválidos          |
| `totalAmount` diferente da soma dos itens  | `422`                                          |
| Plataforma não suportada                   | `404`                                          |

### Dashboard

```json
GET /dashboard?startDate=2025-02-01&endDate=2025-02-28

{
  "data": {
    "startDate": "2025-02-01T00:00:00.000Z",
    "endDate": "2025-02-28T23:59:59.999Z",
    "ordersCount": 1,
    "revenue": 22970,
    "totalCost": 3600,
    "profit": 19370,
    "skusWithoutCost": ["P-002"]
  }
}
```

## Arquitetura

Cada módulo é dividido em três camadas, e as dependências apontam sempre para dentro
(`infrastructure → application → domain`):

- **domain** - entidades com validação própria, regras de negócio e **contratos** dos
  repositórios. Não conhece Nest, HTTP nem o formato do webhook.
- **application** - casos de uso (`UseCase<Input, Output>`) e DTOs de saída. Dependem apenas
  das interfaces do domínio.
- **infrastructure** - controllers, DTOs de entrada, presenters, repositórios em memória,
  mappers do webhook e o módulo Nest, que liga cada interface à sua implementação.

```text
src/
├── products/              Produto (catálogo)
├── product-costs/         Custo de produto (1 custo atual por produto)
├── orders/                Pedido + webhook
│   └── infrastructure/webhooks/
│       ├── order-webhook-mapper.ts            contrato do mapper
│       ├── validated-order-webhook.mapper.ts  base: valida o payload e chama map()
│       ├── order-webhook-mapper.registry.ts   escolhe o mapper pela plataforma
│       └── platforms/ecommerce/               payload do enunciado + mapper
├── dashboard/             Indicadores do período (DashboardSummaryCalculator)
├── seed/                  Dados de demonstração (apenas em development)
└── shared/                Entity, repositórios base, validação, erros, filtros, presenters
```

Estrutura de um módulo (ex.: `products/`):

```text
domain/          entities/ · validators/ · repositories/ (interface) · testing/helpers/
application/     dtos/ (output) · usecases/
infrastructure/  database/in-memory/ · dtos/ (input) · presenters/ · *.controller.ts · *.module.ts
```

### SOLID

- **Dependency Inversion:** os casos de uso recebem `ProductRepository.Repository`,
  `OrderRepository.Repository` etc. O módulo Nest decide a implementação:

  ```ts
  { provide: 'ProductRepository', useClass: ProductInMemoryRepository }
  ```

  Para trocar por um banco real, basta criar uma classe que implemente a mesma interface e
  mudar o `useClass`; nenhum caso de uso ou entidade muda.

- **Open/Closed - novas plataformas de webhook:** o domínio e o `CreateOrderUseCase` não
  conhecem o formato externo. Para suportar outra plataforma:
  1. criar `orders/infrastructure/webhooks/platforms/<plataforma>/` com a classe do payload
     (decorators do class-validator) e um mapper que estenda `ValidatedOrderWebhookMapper`;
  2. registrar o mapper no `OrdersModule`:

     ```ts
     new OrderWebhookMapperRegistry([
       new EcommerceOrderWebhookMapper(),
       new OutraPlataformaOrderWebhookMapper(),
     ])
     ```

  O webhook passa a responder em `POST /webhooks/orders/<plataforma>` sem alterar controller,
  caso de uso ou domínio.

## Decisões de modelagem

- **Centavos:** preço, custo, totais e indicadores são inteiros em centavos.
- **Ligação pedido → produto pelo SKU:** o `itemId` do webhook é o `sku` do produto. Um
  pedido com produto ainda não cadastrado é aceito (o webhook não deve falhar por catálogo
  incompleto); o item só fica sem custo.
- **Custo atual, calculado na consulta:** cada produto tem um custo editável
  (`PUT /product-costs/:productId`). O dashboard usa o custo atual de cada SKU, então
  cadastrar um custo depois que o pedido chegou já corrige o lucro do período. Itens sem
  custo entram como 0 e aparecem em `skusWithoutCost`, para o front poder sinalizar.
- **Idempotência do webhook:** plataformas reenviam notificações; um pedido com a mesma
  plataforma + `id` externo não é duplicado.
- **Integridade do pedido:** o `totalAmount` precisa ser igual à soma de `quantidade × preço
  unitário` dos itens.
- **Período do dashboard:** `startDate` e `endDate` são dias inteiros (do início do dia
  inicial ao último milissegundo do dia final), em **UTC**.

## Testes

```bash
yarn test       # unitários e integração (entidades, validators, casos de uso, mapper, presenters...)
yarn test:e2e   # HTTP: cada endpoint, filtros de erro e o fluxo produto → custo → webhook → dashboard
```

Os testes seguem a mesma estrutura das camadas (`__tests__/unit`, `__tests__/integration`,
`__tests__/e2e`) ao lado do código testado.
