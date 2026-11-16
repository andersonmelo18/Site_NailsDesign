# Handoff — Nails Academy

## Estado atual
Site React/Vite com API própria integrada e painel admin. Backend em `server/`, frontend em `src/`.

## Como rodar
```sh
npm install
npm run db:seed      # popula/refresha o banco (idempotente: 5/6/3/3)
npm run server       # API em http://localhost:3001
npm run dev          # site em http://localhost:5173 (proxy /api -> 3001)
```
Token admin padrão: `nails-admin` (configurável via `ADMIN_TOKEN` em `.env`).

## Verificação
`npm run build` ✓ · `npm run lint` ✓ · `npm run db:seed` → 5/6/3/3 · `GET /api/health` ok.
Detalhes e cobertura E2E em `DEV/VERIFY.md`.

## Próximos passos (se desejar)
- Trocar o token padrão `nails-admin` por um secreto real antes de publicar.
- Backend roda separado do Vite: em produção, servir `dist/` e a API juntos ou atrás de um proxy.
- O banco é SQLite local (`server/data/nails.db`, ignorado pelo git) — sem persistência em nuvem.

Sem commits/pushes realizados.
