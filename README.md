# Financial

Aplicação full-stack de gestão financeira: Next.js no frontend e API REST com Hono no mesmo repositório. Inclui controle de despesas, categorias e investimentos, com autenticação (email/senha e GitHub) e arquitetura de backend em camadas (Clean/DDD).

---

## Estrutura do projeto

O código-fonte fica em `src/`. A aplicação divide-se em: **app** (Next.js e UI), **api** (regras de negócio e HTTP), e pastas compartilhadas (**http** client, **lib**, **shared**, **hooks**, **utils**, **components**).

```mermaid
flowchart TB
  subgraph src [src]
    subgraph app [app - Next.js]
      appRouter[app router]
      appLayout[layout.tsx]
      appGroups["(app) e (auth)"]
      appApi["api/[[...route]]"]
    end
    subgraph api [api - Backend]
      core[core]
      domain[domain]
      infra[infra]
    end
    components[components]
    httpClient[http]
    lib[lib]
    shared[shared]
    hooks[hooks]
    utils[utils]
  end
  app --> components
  app --> httpClient
  app --> lib
  appApi --> api
  api --> shared
```

### Árvore de pastas (resumida)

```
src/
├── api/                    # Backend: domain, core, infra
│   ├── core/               # Either, Entity, erros, tipos base
│   ├── domain/             # Entidades, use cases, interfaces de repositório
│   ├── infra/              # HTTP (Hono), DB (Drizzle), auth, middlewares
│   └── index.ts            # App Hono + rotas + middlewares
├── app/                    # Next.js App Router
│   ├── (app)/              # Rotas autenticadas
│   ├── (auth)/             # Login e signup
│   ├── api/[[...route]]/   # Proxy para a API Hono
│   ├── layout.tsx
│   └── globals.css
├── components/             # Componentes reutilizáveis e UI (shadcn)
│   ├── ui/                 # Primitivos de UI
│   └── ...                 # Layout e componentes compartilhados
├── http/                   # Cliente HTTP: funções que chamam a API (fetch)
├── lib/                    # Auth client/server, React Query, utils
├── shared/                 # Schemas Zod compartilhados (front + API)
├── hooks/
├── utils/
├── api-env.ts              # Variáveis de ambiente da API
└── env.ts                  # Variáveis de ambiente do frontend
```

- **`api/`**: contém toda a lógica de backend (domain, core, infra). O ponto de entrada é `api/index.ts`, que é montado em `app/api/[[...route]]/route.ts`, então todas as requisições a `/api/*` são tratadas pelo Hono.
- **`app/`**: rotas, layouts e páginas do Next.js. Route groups `(app)` e `(auth)` não alteram a URL; apenas organizam layout e proteção (ex.: layout de `(app)` exige sessão).
- **`components/`**: componentes globais (shell, sidebar, page) e `ui/` com os primitivos do shadcn.
- **`http/`**: funções que chamam a API (uma por ação), com `fetch` e `credentials: 'include'`.
- **`shared/schemas/`**: schemas Zod usados tanto na validação da API quanto no frontend (tipos e contratos únicos).

---

## Geral

- **Projeto**: monólito full-stack (front + API) para controle financeiro (despesas, categorias, investimentos).
- **Runtime e pacotes**: [Bun](https://bun.sh) (lockfile `bun.lock`), módulos ESM (`"type": "module"`).
- **Linguagem**: TypeScript em modo strict, target ES2022; path alias `@/*` → `./src/*` ([tsconfig.json](tsconfig.json)).
- **Qualidade de código**:
  - **ESLint**: `eslint-config-next` (core-web-vitals + TypeScript), Prettier e `eslint-plugin-simple-import-sort` (ordem de imports como erro) — [eslint.config.mjs](eslint.config.mjs).
  - **Prettier**: printWidth 80, tabWidth 2, singleQuote, trailingComma all, arrowParens always, semi false.
- **Testes**: [Vitest](https://vitest.dev) (`npm run test` / `npm run test:watch`); testes em `*.test.ts`.
- **Banco e ambiente**: PostgreSQL 17 via [docker-compose.yml](docker-compose.yml); variáveis em [src/api-env.ts](src/api-env.ts) (API) e [src/env.ts](src/env.ts) (frontend).
- **Scripts**: `dev`, `build`, `start`, `lint`, `test`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:seed`.

### Como rodar

1. Instalar dependências: `bun install` ou `npm install`.
2. Configurar `.env` com `DATABASE_URL`, `BETTER_AUTH_*`, `NEXT_PUBLIC_API_URL` etc. (ver `src/api-env.ts` e `src/env.ts`).
3. Subir o Postgres: `docker compose up -d`.
4. Aplicar schema: `bun run db:push` ou `bun run db:migrate`.
5. Iniciar o app: `bun run dev` ou `npm run dev`.

---

## Frontend

- **Framework**: [Next.js](https://nextjs.org) 16 com App Router e [React](https://react.dev) 19; [React Compiler](https://react.dev/learn/react-compiler) ativado em [next.config.ts](next.config.ts).
- **Rotas**: Route groups `(app)` (área autenticada) e `(auth)` (login/signup). O layout de `(app)` valida sessão no servidor e redireciona para login se não autenticado. Listagem completa de rotas da API em **Scalar** (`/api/docs`).
- **UI e estilo**:
  - [shadcn/ui](https://ui.shadcn.com) (estilo **new-york**, base **zinc**, CSS variables, RSC + TSX) — [components.json](components.json); ícones [Lucide](https://lucide.dev).
  - Componentes em `src/components/ui/` (Radix + Tailwind); layout e componentes compartilhados em `src/components/`.
  - [Tailwind CSS](https://tailwindcss.com) v4 em [src/app/globals.css](src/app/globals.css): `@import "tailwindcss"`, `tw-animate-css`, `tailwind-scrollbar`, tema com variáveis (radius, cores semânticas).
- **Formulários**: [React Hook Form](https://react-hook-form.com) + `@hookform/resolvers` (Zod) + componentes Form do shadcn; validação com Zod no cliente.
- **Dados e chamadas**: [TanStack React Query](https://tanstack.com/query/latest) em [src/lib/react-query-provider.tsx](src/lib/react-query-provider.tsx); funções em `src/http/*` usam `fetch` com `credentials: 'include'` para a API em `NEXT_PUBLIC_API_URL`.
- **Autenticação**: [better-auth](https://www.better-auth.com) no cliente (`authClient.useSession()` etc.) em [src/lib/auth-client.ts](src/lib/auth-client.ts).
- **Padrões**:
  - **Composition (Compound Components)**: componentes compostos são exportados como um único objeto com subcomponentes nomeados (ex.: `Card.Root`, `Card.Content`, `Card.Header`). Cada subcomponente estende `ComponentProps` do elemento base; o uso no JSX fica declarativo e flexível. Ver `src/components/page.tsx` e componentes em `_components` das rotas.
  - Componentes de página/feature ficam em `_components` dentro da rota.
  - Client components com `'use client'` quando usam hooks ou interatividade; Server Components por padrão.
  - Feedback: [Sonner](https://sonner.emilkowal.ski) para toasts; Spinner em botões de submit.
- **Outros**: [Recharts](https://recharts.org) para gráficos; [Motion](https://motion.dev) para animações; [date-fns](https://date-fns.org); [react-day-picker](https://daypicker.dev) em calendários.

### Fluxo de uma ação no frontend

```mermaid
sequenceDiagram
  participant Page as Page/Component
  participant Http as src/http
  participant API as /api (Hono)
  participant UseCase as Use Case
  participant Repo as Repository

  Page->>Http: action(params)
  Http->>API: POST /api/... (credentials: include)
  API->>API: Valida body (Zod/OpenAPI)
  API->>API: requireAuth
  API->>UseCase: new UseCase(repo).execute(...)
  UseCase->>Repo: findById / update / etc.
  Repo->>UseCase: entidade ou null
  UseCase-->>API: Either Left/Right
  API-->>Http: 200 ou 4xx + JSON
  Http-->>Page: resultado ou throw
```

A página chama uma função de `src/http/*`, que faz `fetch` para `/api/*`. A API valida o body, aplica auth, executa o use case (com repositório injetado) e devolve status + JSON.

---

## Backend

- **API**: [Hono](https://hono.dev) com [OpenAPIHono](https://hono.dev/docs/openapi) em [src/api/index.ts](src/api/index.ts), exposta via Next.js em [src/app/api/[[...route]]/route.ts](src/app/api/[[...route]]/route.ts) (GET, POST, PUT, DELETE, PATCH, etc.). Base path: `/api`.
- **Autenticação**: better-auth em [src/api/infra/auth/index.ts](src/api/infra/auth/index.ts) com adapter Drizzle; email/senha e GitHub; rotas `/auth/*` e `/sign-up/*` delegadas ao handler do auth; middleware de sessão preenche `user` e `session` no contexto; rotas protegidas usam [requireAuth](src/api/infra/middlewares/auth.ts).
- **Arquitetura (Clean/DDD)**:
  - **Domain** (`src/api/domain/`): entidades em `enterprise/entities`; interfaces de repositório e use cases em `application/` (repositories, use-case).
  - **Core** (`src/api/core/`): tipo Either (Left/Right) para erros tipados; base Entity e UniqueEntityID; erros de aplicação (UseCaseError, NotAllowedError, ResourceNotFoundError).
  - **Infra** (`src/api/infra/`): HTTP (handlers Hono + rotas OpenAPI), DB (Drizzle), auth e middlewares; implementações de repositório e mappers entre persistência e domínio.
- **Fluxo típico**: Handler valida body com Zod/OpenAPI → instancia use case com repositório Drizzle → `execute()` retorna `Either`; em `Left` mapeia para status HTTP (403, 404, etc.) e JSON padronizado; em `Right` retorna 200 com corpo definido.
- **Validação e contratos**: Schemas Zod em `src/shared/schemas/`; `@hono/zod-openapi` para request/response e geração OpenAPI.
- **Documentação**: [Scalar](https://github.com/scalar/scalar) em `/api/docs`; spec OpenAPI em `/api/openapi.json`.
- **Banco**: PostgreSQL; [Drizzle ORM](https://orm.drizzle.team) com schema em `src/api/infra/database/drizzle/`; migrations com drizzle-kit; [drizzle.config.ts](drizzle.config.ts) com dialect `postgresql` e `casing: 'snake_case'`. Tabelas de auth (Better Auth) e do domínio financeiro, multi-tenant por `userId`.

### Camadas da API (Clean Architecture)

```mermaid
flowchart TB
  subgraph infra [Infra]
    HttpHandlers[HTTP Handlers - Hono]
    DrizzleRepos[Drizzle Repositories]
    Mappers[Mappers]
    Auth[Auth - better-auth]
  end
  subgraph domain [Domain]
    Entities[Entities]
    UseCases[Use Cases]
    RepoInterfaces[Repository Interfaces]
  end
  subgraph core [Core]
    Either[Either]
    EntityBase[Entity base]
    Errors[Erros de aplicação]
  end

  HttpHandlers --> UseCases
  HttpHandlers --> Auth
  UseCases --> RepoInterfaces
  UseCases --> Either
  UseCases --> Entities
  Entities --> EntityBase
  RepoInterfaces --> DrizzleRepos
  DrizzleRepos --> Mappers
  Mappers --> Entities
```

- **Infra**: recebe a requisição (Hono), valida com Zod, chama o use case injetando um repositório concreto (Drizzle). Repositórios e mappers traduzem entre tabelas e entidades de domínio.
- **Domain**: entidades de negócio e use cases que dependem apenas de interfaces de repositório (não de Drizzle ou HTTP).
- **Core**: tipos e estruturas compartilhadas (Either, Entity, erros); sem dependência de framework ou DB.

### Fluxo de uma requisição protegida

```mermaid
flowchart LR
  A[Request] --> B[CORS]
  B --> C{Auth route?}
  C -->|Sim| D[better-auth handler]
  C -->|Nao| E[Session middleware]
  E --> F[user/session no context]
  F --> G{Rota protegida?}
  G -->|Sim| H[requireAuth]
  G -->|Nao| I[Handler]
  H --> I
  I --> J[Validacao Zod]
  J --> K[Use case.execute]
  K --> L[Either]
  L --> M{Left ou Right?}
  M -->|Left| N[4xx + JSON]
  M -->|Right| O[200 + body]
```

As rotas `/auth/*` e `/sign-up/*` são tratadas diretamente pelo better-auth. As demais passam pelo middleware de sessão; as protegidas exigem `requireAuth`. O handler valida o body, executa o use case e converte o `Either` em resposta HTTP.

### Estrutura da pasta `api/`

```
src/api/
├── index.ts              # App Hono, CORS, auth handler, session middleware, registro de rotas
├── core/
│   ├── either.ts         # Left / Right para erros tipados
│   ├── entities/         # Entity, UniqueEntityID
│   ├── errors/           # Erros de aplicação
│   └── types/            # Tipos utilitários
├── domain/
│   ├── enterprise/entities/   # Entidades de negócio
│   └── application/
│       ├── repositories/      # Interfaces de repositório
│       └── use-case/          # Use cases
└── infra/
    ├── auth/             # Config better-auth + adapter Drizzle
    ├── middlewares/      # requireAuth
    ├── http/             # Handlers por recurso (rotas OpenAPI)
    └── database/drizzle/
        ├── schema.ts     # Definição das tabelas
        ├── repositories/ # Implementações dos repositórios
        ├── mappers/      # Conversão persistência ↔ domínio
        └── migrations/
```

Os handlers em `infra/http/` registram rotas OpenAPI, aplicam `requireAuth` quando necessário, instanciam o use case com o repositório e mapeiam o retorno `Either` para status HTTP e JSON.
