# Worklog

- **2026-11-16** — API completa para o site Nails Academy, dividida entre os workers Orca `omp` (backend) e `kilo` (frontend/admin), coordenada nesta sessão.
  - Backend (`server/`): Express 5 + better-sqlite3 + tsx; rotas públicas `/api/{health,services,colors,styles,testimonials,bookings,contacts}` e admin Bearer (`ADMIN_TOKEN`, padrão `nails-admin`) com CRUD e PATCH de status. Seed a partir de `src/data/catalog.ts`. Scripts `server`/`server:dev`/`db:seed`, proxy `/api` no `vite.config.ts`.
  - Frontend (`src/api`, `src/hooks`, `src/admin`, forms de agendamento/contato): consome a API com fallback estático; painel `/admin` com login, bookings, contacts e CRUD de conteúdo.
  - Correção final do coordenador: `server/seed.ts` passou a limpar tabelas + resetar `sqlite_sequence` (seed idempotente) e a importar direto de `catalog.ts`.
  - Gate: `npm run build` ✓, `npm run lint` ✓, `npm run db:seed` → 5/6/3/3, `GET /api/health` ok. E2E 24/24 (kilo, Playwright/Chrome).
  - Nota: testes deixaram 1 booking + 1 contato QA no banco; limpos pelo seed idempotente rodado ao final. Sem commits.
