# Verificação — integração com a API

## O que foi integrado

- `src/api/types.ts` + `src/api/client.ts`: tipos e helpers `fetch` para todo o contrato
  (`/health`, `/services`, `/colors`, `/styles`, `/testimonials`, `POST /bookings`,
  `POST /contacts`). Base URL vem de `VITE_API_URL` com fallback para `/api` (proxy do Vite).
  Erros viram `ApiError` com `status` e mensagem amigável; token do admin em `sessionStorage`
  (`nails-academy-admin-token`) enviado como `Authorization: Bearer`.
- Páginas públicas (`servicos`, `cores`, `estilos`, `depoimentos`) carregam da API com
  estado de carregando/erro (`src/hooks/useApiResource.ts` + `components/StatusNote.tsx`).
  Se a API estiver fora do ar, o conteúdo estático de `src/data/catalog.ts` continua
  aparecendo (dados estáticos preservados, nada foi removido).
- `/agendamento`: formulário real (nome, celular, serviço via API, dia, horário, detalhes)
  com `POST /api/bookings`, feedback de sucesso (id + status) e de erro. O link do WhatsApp
  segue na página como alternativa.
- Contato: `components/ContactForm.tsx` na página `/localizacao` com `POST /api/contacts`.
- Painel `/admin` (rotas em `App.tsx`, guard em `admin/AdminGuard.tsx`):
  `/admin/login` (valida o token e grava em `sessionStorage`), `/admin/bookings`
  (lista + PATCH de status), `/admin/contacts`, `/admin/content`
  (CRUD de serviços, cores, estilos e depoimentos).

## Como foi testado

```sh
npm run build   # tsc -b && vite build
npm run lint    # eslint .
npm run dev     # http://localhost:5173 (proxy /api -> localhost:3001)
```

Verificação ponta a ponta com Playwright/Chrome (backend real em `localhost:3001`,
token `nails-admin`), 24 checagens, todas passando:

- páginas públicas renderizando dados da API (contagens iguais às do backend);
- `POST /bookings` e `POST /contacts` gravando no backend (confirmado via API);
- `/admin/bookings` sem token redireciona para `/admin/login`; token inválido é rejeitado;
- listagem de agendamentos, PATCH de status, listagem de contatos;
- CRUD em `/admin/content`: criar, editar e excluir serviço; criar e excluir depoimento;
  troca de abas (cores);
- API administrativa responde 401 sem token;
- com as rotas `/api/**` bloqueadas, `/servicos` cai no catálogo estático (5 itens) e
  mostra o aviso de erro;
- nenhum erro de console do React (chaves duplicadas, etc.).

Observações:

- O backend foi reiniciado/removido durante os testes (dados semeados de novo); por isso
  as contagens usadas na verificação são lidas da própria API.
- Os testes criaram um agendamento e um contato de QA (`QA ... <timestamp>`) no banco.
- `server/seed.ts` **corrigido na integração final**: antes extraía serviços/depoimentos do
  JSX por regex (quebrou quando as páginas viraram dinâmicas). Agora importa `services`,
  `testimonials`, `colors` e `shapes` direto de `src/data/catalog.ts`. Também ficou
  **idempotente**: limpa as 6 tabelas e reseta `sqlite_sequence` antes de inserir, então
  rodar `npm run db:seed` sempre resulta em 5/6/3/3 linhas (não duplica).
- Verificação final após a correção: `npm run db:seed` → `Seeded: 5, 6, 3, 3`;
  `GET /api/health` → `{"ok":true,"version":"0.0.0"}`; `npm run build` ✓; `npm run lint` ✓.
- O proxy de desenvolvimento (`/api` -> `localhost:3001`) está em `vite.config.ts`; sem ele,
  use `VITE_API_URL=http://localhost:3001/api npm run dev`.