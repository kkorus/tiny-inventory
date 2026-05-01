# Tiny Inventory

Small full-stack inventory assignment: **stores** and **products** (stages 2+). Stage 1 provides the repo layout, **Docker Compose** (Postgres + API + static web), **NestJS** with **TypeORM** (empty schema, ready for entities), **Swagger** at `/api/docs`, and a **React** shell that shows **API health**.

## Prerequisites

- Docker with Compose v2
- **Or** Node.js 22+ and a local PostgreSQL 16 instance if you run without full Compose

## Run everything (single command)

From the repository root:

```bash
docker compose up --build
```

Then:

| What        | URL |
|-------------|-----|
| Web UI      | <http://localhost:3001> (nginx, mapped from port 80 in the `web` container) |
| API Swagger | <http://localhost:3000/api/docs> |
| Health      | <http://localhost:3000/api/health> |

### Live reload while using Docker

- **Rebuild static web on save:** `docker compose watch` (or `npm run docker:watch`). Edits under `web/` trigger a rebuild of the `web` service; keep the terminal open.
- **Vite HMR (faster):** `npm run docker:dev` — Compose file `docker-compose.dev.yml` adds a `vite` dev server on <http://localhost:5173> and turns off the nginx `web` container (`--scale web=0`). API remains on port 3000.

## Local development (workspace monorepo)

1. Install all dependencies once from repo root: `npm install`
2. Start only Postgres: `docker compose up -d db`
3. `cp server/.env.example server/.env` and adjust if needed
4. Optional: `cp web/.env.example web/.env` (leave `VITE_API_URL` empty to use Vite `/api` proxy)
5. Run API: `npm run dev:server`
6. Run Web: `npm run dev:web`
7. Or run both in parallel: `npm run dev`

## Workspace scripts (repo root)

- `npm run build` - build all workspaces that expose `build`
- `npm run dev` - run server and web dev servers in parallel
- `npm run lint` - run lint in all workspaces
- `npm run lint:fix` - run lint with autofix in all workspaces
- `npm run test` - run test scripts in all workspaces
- `npm run test:e2e` - run server e2e tests
- `npm run db:migrate` - run server migrations
- `npm run db:revert` - revert latest server migration
- `npm run db:seed` - seed server database
- `npm run docker:watch` - `docker compose watch` (rebuild `web` image when files under `web/` change)
- `npm run docker:dev` - DB + API + Vite dev server on port 5173 (nginx `web` scaled to 0)

## API sketch (max ~10 lines)

- `GET /api/health` - process health
- `GET /api/docs` - OpenAPI (Swagger UI)
- Future: CRUD for stores and products, filtered/paginated product list, low-stock report (see plan in repo history)

## Decisions, testing, and “if I had more time”

Fleshed out in a later pass when the assignment feature set is complete. See `AGENTS.md` for a short stack summary for tools and agents.

## Repository layout

- `server/` - NestJS application
- `web/` - Vite + React + TypeScript
- `docker-compose.yml` - `db`, `server`, `web` services
- `docker-compose.dev.yml` - optional `vite` overlay for HMR with Docker (see “Live reload while using Docker”)
