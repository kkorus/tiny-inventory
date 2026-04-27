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

## Local development (without building web in Docker)

1. Start only Postgres: `docker compose up -d db`
2. `cp server/.env.example server/.env` and adjust if needed
3. API: `cd server && npm install && npm run start:dev`
4. Web: `cd web && npm install && cp .env.example .env && npm run dev`  
   Leave `VITE_API_URL` empty in `web/.env` so the Vite dev server proxies `/api` to the API on port 3000.

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
