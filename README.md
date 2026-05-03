# Tiny Inventory

Full-stack inventory demo: **stores**, **catalog products**, **categories**, **per-store inventory lines** (price, quantity, low-stock threshold), and a **low-stock insights** report. Stack: **NestJS**, **TypeORM**, **PostgreSQL**, **Swagger** (`/api/docs`), and **React** (Vite) with list/detail flows, filters, and pagination.

## Prerequisites

- Docker with Compose v2  
- **Or** Node.js 22+ and PostgreSQL 16 for local (non-Compose) development

## Run everything (single command)

From the repository root:

```bash
docker compose up --build
```

The API container sets **`DATABASE_MIGRATIONS_RUN=true`** so TypeORM applies migrations on startup (empty Postgres gets a schema automatically).

Then:

| What        | URL |
|-------------|-----|
| Web UI      | <http://localhost:3001> (nginx, port 80 in container mapped to 3001) |
| API Swagger | <http://localhost:3000/api/docs> |
| Health      | <http://localhost:3000/api/health> |

### Optional sample data

After the stack is up (or with only Postgres + API in dev):

```bash
npm run db:seed
```

Uses `server/.env` (or Compose defaults) for `DATABASE_*`.

### Live reload while using Docker

- **Rebuild static web on save:** `docker compose watch` (or `npm run docker:watch`). Edits under `web/` rebuild the `web` image.
- **Vite HMR:** `npm run docker:dev` — `docker-compose.dev.yml` runs Vite on <http://localhost:5173>; nginx `web` is scaled to 0; API stays on port 3000.

## Local development (monorepo)

1. `npm install` from repo root  
2. `docker compose up -d db`  
3. `cp server/.env.example server/.env` — for local API, set `DATABASE_MIGRATIONS_RUN=true` **or** run `npm run db:migrate` once before first requests  
4. Optional: `cp web/.env.example web/.env` — leave `VITE_API_URL` empty to use Vite’s `/api` proxy to the server  
5. `npm run dev` (or `npm run dev:server` / `npm run dev:web`)

## Workspace scripts

- `npm run build` — build workspaces that define `build`
- `npm run dev` — API + Vite in parallel
- `npm run lint` / `npm run lint:fix`
- `npm run test` — unit tests (server + web)
- `npm run test:e2e` — server e2e (needs Postgres; see **Testing**)
- `npm run db:migrate` / `npm run db:revert`
- `npm run db:seed` — seed data

## API overview

All routes are under the **`/api`** prefix. Authoritative contract: **Swagger UI** at `/api/docs`.

### Resources (summary)

| Area | Base path | Notes |
|------|-----------|--------|
| Health | `GET /api/health` | Liveness-style payload |
| Stores | `/api/stores` | CRUD; list uses `page`, `limit` |
| Products | `/api/products` | Catalog CRUD; list paginated |
| Categories | `/api/categories` | CRUD; list is all rows (no pagination) |
| Store products | `/api/store-products` | Inventory lines; list with **filters** + pagination |
| Insights | `GET /api/insights/low-stock` | Low-stock lines + summary aggregates |

`id` path parameters are **UUIDs** (`ParseUUIDPipe`); invalid UUID → **400**.

### Pagination (lists)

Query: `page` (default **1**), `limit` (default **20**).

Response shape:

```json
{
  "data": [ … ],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "hasNext": false
  }
}
```

### Errors

- **400** — validation: body includes `"message": "Validation failed"` and `"errors": [ { "field": "…", "messages": ["…"] }, … ]` (global `ValidationPipe`, whitelist, unknown fields rejected).  
- **404** — missing entity (e.g. store/product not found); message describes the resource.  
- **204** — successful DELETE with empty body.

The web client maps `errors[]` into user-visible messages when present.

### Architecture (server)

Controllers stay thin; DTOs use `class-validator`. Domain rules live in services and aggregates; persistence goes through repository **ports** with TypeORM adapters. Keeps the codebase reviewable without full DDD ceremony.

## Testing

### Unit tests

- **Server:** Jest tests for services (mocked repositories), value objects, and aggregates (`*.spec.ts` under `server/src`).  
- **Web:** React Testing Library for representative pages (e.g. product list, low-stock report).

Structure follows **given / when / then** in server specs.

### E2E (`server/test/app.e2e-spec.ts`)

Boots the real `AppModule` with the same **`createValidationPipe()`** as production. Covers:

- Health  
- Validation **400** shape for `POST /api/stores`  
- Invalid UUID on `GET /api/stores/:id`  
- **404** for missing store  
- **Create + list** smoke for stores  

**Requirement:** PostgreSQL reachable using `DATABASE_*` from `server/.env` (e.g. `docker compose up -d db` and migrations applied — local dev may use `DATABASE_MIGRATIONS_RUN=true` or `npm run db:migrate`).

**Rationale:** E2E catches regressions in HTTP semantics, DTO validation, and global pipes without duplicating every unit scenario.

## Decisions and trade-offs

- **Data model — four-table relational schema:**
  - `categories` is a lookup/dictionary table rather than a plain string on the product. This gives referential integrity (a product cannot reference a non-existent category), lets every resource filter by `categoryId` consistently, and means a category rename propagates everywhere automatically. `ON DELETE RESTRICT` prevents dropping a category that still has products, avoiding orphans.
  - `products` is a **global catalog** — it describes *what* a product is (name, SKU, category) independently of any store. SKU has a `UNIQUE` constraint enforced at the DB level so the same physical product is never registered twice under different IDs.
  - `store_products` is the **many-to-many join table with a payload**. A plain pivot would only track which products exist in which stores; here each row also carries `price`, `quantity`, and `low_stock_threshold` — all values that are inherently per-store (the same headphone can sell for €199 in Warsaw and €179 in Gdańsk and have different stock levels). A composite `UNIQUE (store_id, product_id)` prevents a product from appearing twice in the same store. `ON DELETE RESTRICT` on both FKs means you cannot silently delete a store or a product that still has inventory lines.
  - Indexes on `store_products.store_id`, `.product_id`, and `.quantity` make the filtered list and low-stock queries efficient without full-table scans.
  - `price` is stored as `numeric(12,2)` in Postgres (exact decimal, no floating-point drift) and transferred as a numeric string in the API to avoid JavaScript `Number` precision loss on large values.
- **No authentication or authorization** — out of scope; API is open on the assumed network. In production you would add authn/z, HTTPS, and tenant isolation.  
- **Migrations on Docker API startup** — favors “clone and `docker compose up` works” over running migrate as a separate job; for large fleets, prefer init containers or release-phase migrate.  
- **Postgres only** — single relational model; no multi-region or read replicas in this repo.  
- **Observability** — structured logging, metrics, and tracing are not wired here; health is the only ops hook.  
- **Rate limiting / API hardening** — not included; would sit behind a gateway or middleware in production.

## If I had more time

- **Authentication & multi-tenancy** — add JWT/OAuth2 with per-store RBAC so only authorized users can mutate inventory lines; currently the API is fully open.
- **Observability stack** — wire Pino structured logging, OpenTelemetry traces, and a richer `/api/health` that probes the DB connection pool; right now ops visibility is minimal.
- **Broader test coverage** — per-resource e2e suites (stores, products, store-products, insights), Playwright smoke tests for the React UI, and contract tests between the client and the API to catch breaking changes early.

## Repository layout

- `server/` — NestJS API, migrations under `server/src/migrations`  
- `web/` — Vite + React  
- `docker-compose.yml` — `db`, `server`, `web`  
- `docker-compose.dev.yml` — optional Vite overlay for Docker-based HMR  
- `AGENTS.md` — short stack and command reference for tooling
