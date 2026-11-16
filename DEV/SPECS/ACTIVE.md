# Spec ativa — API + painel admin (concluído 2026-11-16)

## Contrato
- API base `/api` (proxy Vite → `localhost:3001`). Público: `GET /health|/services|/colors|/styles|/testimonials`, `POST /bookings`, `POST /contacts`. Admin (Bearer `ADMIN_TOKEN`): `GET/PATCH /admin/bookings/:id`, `GET /admin/contacts`, CRUD em `/admin/{services,colors,styles,testimonials}`.
- Persistência: SQLite `server/data/nails.db`; seed a partir de `src/data/catalog.ts`, idempotente.
- Frontend: páginas consomem a API com fallback estático; `/admin` protegido por token em `sessionStorage`.

## Critérios de aceite (todos atendidos)
- `npm run build`, `npm run lint` passam.
- `npm run db:seed` → 5 serviços / 6 cores / 3 estilos / 3 depoimentos, sem duplicar em execuções repetidas.
- Endpoints validados ao vivo (curl) e E2E 24/24 com Playwright contra o backend real.
- Documentação em `server/README.md` e `DEV/VERIFY.md`.

## Fora de escopo / follow-up
- Token secreto em produção, deploy conjunto (dist + API), banco gerenciado.
