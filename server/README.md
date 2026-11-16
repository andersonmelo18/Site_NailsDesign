# Nails Academy API

REST backend for the Nails Academy site. Express + TypeScript (run with `tsx`) + better-sqlite3.
Database file: `server/data/nails.db` (gitignored; created automatically).

## Run

```sh
npm install
npm run db:seed      # seed from src/data/catalog.ts (+ pages, read-only)
npm run server       # start on http://localhost:3001 (PORT env to override)
npm run server:dev   # same, with auto-reload
```

Env (see `.env.example`):

| var           | default        | purpose                    |
| ------------- | -------------- | -------------------------- |
| `ADMIN_TOKEN` | `nails-admin`  | Bearer token for `/api/admin/*` |
| `PORT`        | `3001`         | listen port                |

The Vite dev server proxies `/api` → `http://localhost:3001` (see `vite.config.ts`), so the
frontend can call the API with relative URLs in dev.

## Endpoints (base `http://localhost:3001/api`)

| Method & path                    | Auth | Response |
| -------------------------------- | ---- | -------- |
| `GET /health`                    | –    | `200 { ok, version }` |
| `GET /services`                  | –    | `200 [{ id, name, description, price, duration }]` |
| `GET /colors`                    | –    | `200 [{ id, name, hex, description, image }]` |
| `GET /styles`                    | –    | `200 [{ id, name, description, image }]` |
| `GET /testimonials`              | –    | `200 [{ id, author, text, rating }]` |
| `POST /bookings`                 | –    | `201 { id, status: "pending", createdAt }` · `400` invalid |
| `POST /contacts`                 | –    | `201 { id, createdAt }` · `400` invalid |
| `GET /admin/bookings`            | Bearer | `200 [{ id, name, phone, service, date, time, notes, status, createdAt }]` |
| `PATCH /admin/bookings/:id`      | Bearer | `200` updated booking · `400` bad status/id · `404` unknown id |
| `GET /admin/contacts`            | Bearer | `200 [{ id, name, phone, message, createdAt }]` |
| `GET|POST /admin/{services,colors,styles,testimonials}` | Bearer | list / create (`201`) |
| `PATCH|DELETE /admin/{...}/:id`  | Bearer | update (`200`) / delete (`204`) · `400` invalid · `404` unknown |

Status values accepted by `PATCH /admin/bookings/:id`: `pending`, `confirmed`, `cancelled`, `completed`.

Errors are always `{ "error": "..." }` with `400` (validation / bad JSON), `401` (missing or wrong
token), `404` (unknown route or id), `500` (unexpected).

Validation:

- bookings: `name`, `phone`, `service` non-empty; `date` `YYYY-MM-DD`; `time` `HH:MM` (24h); `notes` optional
- contacts: `name`, `phone`, `message` non-empty
- services: `name`, `description`, `price` non-empty; `duration` positive integer
- colors: `name`, `description` non-empty; `hex` `#RRGGBB`; `image` optional
- styles: `name`, `description` non-empty; `image` optional
- testimonials: `author`, `text` non-empty; `rating` integer 1–5

## Seed

`npm run db:seed` reads (without modifying) the frontend sources and inserts:

- `services` — names, prices and descriptions from `src/data/catalog.ts` (`services`)
- `colors` — `src/data/catalog.ts` (`colors`); `hex` taken from the first color in each `gradient`
- `styles` — `src/data/catalog.ts` (`shapes`)
- `testimonials` — `src/data/catalog.ts` (`testimonials`, rating 5)

Seeding a fresh DB yields `5, 6, 3, 3` rows (services, colors, styles, testimonials).

## Verification transcript

Recorded on 2026-11-16 against `npm run server` after `npm run db:seed`:

```text
$ curl -s http://localhost:3001/api/health
{"ok":true,"version":"0.0.0"}            # 200

$ curl -s http://localhost:3001/api/services
[{"id":1,"name":"Manicure tradicional","description":"Higienização, corte e lixamento com acabamento em esmalte tradicional.","price":"R$ 35","duration":45},{"id":2,"name":"Esmaltação em gel","description":"Esmaltação em gel com longa duração e brilho uniforme por semanas.","price":"R$ 60","duration":60},{"id":3,"name":"Alongamento em fibra","description":"Alongamento em fibra com resistência e visual natural.","price":"R$ 120","duration":90},{"id":4,"name":"Spa das mãos","description":"Pele hidratada com esfoliação, massagem e hidratação profunda.","price":"R$ 45","duration":40},{"id":5,"name":"Nail art personalizada","description":"Decoração sob medida: cores, adesivos e efeitos combinados com o seu estilo.","price":"a partir de R$ 15","duration":30}]   # 200

$ curl -s http://localhost:3001/api/colors
[{"id":1,"name":"Vinho Profundo","hex":"#8C3A50","description":"Tom intenso e sofisticado, perfeito pra quem quer um acabamento marcante sem perder a elegância.","image":"nailcolor_vinho.webp"},{"id":2,"name":"Nude Cerâmica","hex":"#E4C9A6","description":"Clássico atemporal, combina com qualquer produção e disfarça o crescimento entre as manutenções.","image":null}, … 6 rows total]   # 200

$ curl -s http://localhost:3001/api/styles
[{"id":1,"name":"Amendoada","description":"Ponta arredondada e afilada, lembrando uma amêndoa. Alonga visualmente os dedos e é resistente no dia a dia — o formato mais pedido de todos.","image":"amendoada.png"},{"id":2,"name":"Stiletto","description":"Ponta fina e marcante, o formato mais ousado da cartela. Pede unhas mais compridas e um pouco mais de cuidado no dia a dia.","image":"stiletto.png"},{"id":3,"name":"Bailarina","description":"Laterais retas e ponta reta, como uma sapatilha de ponta. Dá um ar moderno e alongado, sem a fragilidade da ponta fina.","image":"bailarina.png"}]   # 200

$ curl -s http://localhost:3001/api/testimonials
[{"id":1,"author":"Renata A.","text":"Minhas unhas nunca duraram tanto tempo com o gel. Voltei porque o atendimento é calmo, sem correria.","rating":5},{"id":2,"author":"Juliana M.","text":"Marquei sem saber o que queria e saí com uma nail art que combinou exatamente com meu estilo.","rating":5},{"id":3,"author":"Carla S.","text":"Percebi a diferença na higiene logo na primeira vez. Hoje é o único lugar que confio pra fazer minhas unhas.","rating":5}]   # 200

$ curl -s -X POST http://localhost:3001/api/bookings \
    -H "Content-Type: application/json" \
    -d '{"name":"Ana Lima","phone":"83999990000","service":"Esmaltação em gel","date":"2026-11-20","time":"14:30","notes":"prefiro vinho"}'
{"id":1,"status":"pending","createdAt":"2026-11-16T23:11:09.928Z"}   # 201

$ curl -s -X POST http://localhost:3001/api/bookings \
    -H "Content-Type: application/json" \
    -d '{"name":"Ana","service":"Gel","date":"2026-11-20","time":"9am"}'    # invalid: missing phone, bad time
{"error":"Invalid booking payload"}   # 400

$ curl -s -X POST http://localhost:3001/api/contacts \
    -H "Content-Type: application/json" \
    -d '{"name":"Bruno","phone":"83988880000","message":"Quero saber sobre alongamento"}'
{"id":1,"createdAt":"2026-11-16T23:11:09.991Z"}   # 201

$ curl -s -X POST http://localhost:3001/api/contacts \
    -H "Content-Type: application/json" -d '{"name":"B","phone":"839","message":""'}    # invalid: empty message
{"error":"Invalid contact payload"}   # 400

$ curl -s http://localhost:3001/api/admin/bookings        # no token
{"error":"Unauthorized"}   # 401

$ curl -s -H "Authorization: Bearer wrong" http://localhost:3001/api/admin/bookings
{"error":"Unauthorized"}   # 401

$ curl -s -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/bookings
[{"id":1,"name":"Ana Lima","phone":"83999990000","service":"Esmaltação em gel","date":"2026-11-20","time":"14:30","notes":"prefiro vinho","status":"pending","createdAt":"2026-11-16T23:11:09.928Z"}]   # 200

$ curl -s -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/contacts
[{"id":1,"name":"Bruno","phone":"83988880000","message":"Quero saber sobre alongamento","createdAt":"2026-11-16T23:11:09.991Z"}]   # 200

$ curl -s -X PATCH -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"status":"confirmed"}' http://localhost:3001/api/admin/bookings/1
{"id":1,"name":"Ana Lima","phone":"83999990000","service":"Esmaltação em gel","date":"2026-11-20","time":"14:30","notes":"prefiro vinho","status":"confirmed","createdAt":"2026-11-16T23:11:09.928Z"}   # 200

$ curl -s -X PATCH -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"status":"nope"}' http://localhost:3001/api/admin/bookings/1        # invalid status
{"error":"Invalid payload: status must be pending, confirmed, cancelled or completed"}   # 400

$ curl -s -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/services
[{"id":1,"name":"Manicure tradicional", … 5 rows: id,name,description,price,duration]   # 200

$ curl -s -X POST -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"name":"Manicure + Spa","description":"Combo completo","price":"R$ 70","duration":80}' \
    http://localhost:3001/api/admin/services
{"id":6,"name":"Manicure + Spa","description":"Combo completo","price":"R$ 70","duration":80}   # 201

$ curl -s -X PATCH -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"name":"Manicure + Spa","description":"Combo com hidratação","price":"R$ 75","duration":90}' \
    http://localhost:3001/api/admin/services/6
{"id":6,"name":"Manicure + Spa","description":"Combo com hidratação","price":"R$ 75","duration":90}   # 200

$ curl -s -X DELETE -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/services/6
(204, empty body)

$ curl -s -X POST -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"name":"Rosa Chá","hex":"#E8A7B0","description":"Tom suave","image":"rosa.webp"}' \
    http://localhost:3001/api/admin/colors
{"id":7,"name":"Rosa Chá","hex":"#E8A7B0","description":"Tom suave","image":"rosa.webp"}   # 201

$ curl -s -X DELETE -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/colors/7
(204, empty body)

$ curl -s -X POST -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"author":"Paula R.","text":"Excelente!","rating":5}' http://localhost:3001/api/admin/testimonials
{"id":4,"author":"Paula R.","text":"Excelente!","rating":5}   # 201

$ curl -s -X PATCH -H "Authorization: Bearer nails-admin" -H "Content-Type: application/json" \
    -d '{"author":"Paula R.","text":"Excelente!","rating":9}' http://localhost:3001/api/admin/testimonials/4    # invalid rating
{"error":"Invalid payload"}   # 400

$ curl -s -H "Authorization: Bearer nails-admin" http://localhost:3001/api/admin/styles
[{"id":1,"name":"Amendoada", … 3 rows: id,name,description,image}]   # 200

$ curl -s http://localhost:3001/api/nope    # unknown route
{"error":"Not found"}   # 404
```

Also verified: `npx tsc -p tsconfig.server.json --noEmit` (no errors), `npm run build` (ok),
`npm run lint` (no errors).
