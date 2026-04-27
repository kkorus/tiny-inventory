# Agent quick context

- **Layout:** `server/` = NestJS API, `web/` = React (Vite) UI, root `docker-compose.yml` = Postgres + API + static web.
- **Run (Docker):** from repo root, `docker compose up --build`. Then open `http://localhost:3001` (web) and `http://localhost:3000/api/docs` (Swagger). API health: `GET http://localhost:3000/api/health`.
- **Run (local dev):** start Postgres (e.g. `docker compose up -d db`), copy `server/.env.example` to `server/.env`, then `cd server && npm run start:dev` and `cd web && npm run dev` (Vite proxies `/api` to port 3000 when `VITE_API_URL` is unset).
- **Tests:** `cd server && npm test` (unit). E2E needs a running database (`cd server && npm run test:e2e` with DB reachable at `DATABASE_*` from `server/.env`).

The human-facing assignment README is in `README.md` (full deliverables, trade-offs, testing notes).
