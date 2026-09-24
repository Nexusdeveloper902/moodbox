# MoodBox

Gift boxes chosen by how you feel. A Next.js prototype built from the MoodBox Penpot design.
Customers pick a mood, get a box recommendation, build their own box with a handwritten letter,
check out (simulated payment) and follow their orders from their account.

## Stack

- Next.js 16 (App Router, Server Actions), React 19, TypeScript
- Tailwind CSS 4 (design tokens in `src/app/globals.css`)
- SQLite through Node's built-in `node:sqlite` (plain SQL, no ORM, no native packages). The database is a single file in `data/`.
- Auth: bcrypt password hashes plus an httpOnly session cookie (only a SHA-256 of the token is stored in `sessions`)

## Setup

Requirements: Node 24+ (for `node:sqlite`). No database server is needed.

```bash
npm install
cp .env.example .env          # DATABASE_FILE, and DEEPSEEK_API_KEY (optional)
npm run db:setup              # create data/moodbox.db with schema + seed data (drops existing tables)
npm run dev                   # http://localhost:3000
```

Inspect the data with any SQLite client, e.g. `sqlite3 data/moodbox.db "SELECT * FROM orders"`.

Demo account: `laura@correo.com` / `moodbox123` (it has two delivered orders).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` then `npm start` | Production build and server |
| `npm run db:setup` | Recreate the schema and seed data |
| `npm test` | Unit tests: mood matching, DeepSeek classifier (stubbed API), order pricing |
| `npm run lint` | ESLint |

## Where things live

```
db/schema.sql              SQLite tables: users, sessions, products, moodboxes, moodbox_items, orders, order_items
scripts/db-setup.mjs       applies the schema and seeds 13 catalog products (+ Dulce, box-only), 3 MoodBoxes, demo user
public/moodbox/            SVG art exported from Penpot (products/, cajas/, logo icons)
src/app/                   routes (see below) + actions.ts (register, login, logout, placeOrder, updateProfile)
src/components/            Header, Footer, MoodBoxCard, ProductCard, Builder, CartView, CheckoutForm, Order…
src/lib/classify.ts        DeepSeek emotion classifier (server-only) with keyword fallback
src/lib/mood.ts            keyword matcher + validation of the classifier's JSON reply
src/lib/pricing.ts         server-side cart validation + totals (prices always from the DB)
src/lib/db.ts              single SQLite connection (WAL mode) + transaction() helper
src/lib/store.ts           browser cart + "Tu MoodBox" draft (localStorage, useSyncExternalStore)
src/lib/theme.ts           per-box colors from the Penpot MoodBox card component
src/proxy.ts               redirects anonymous visitors away from /cuenta, /checkout, /pedido
```

Routes: `/`, `/resultado`, `/moodbox`, `/moodbox/[slug]`, `/productos`, `/productos/[slug]`,
`/personaliza`, `/carrito`, `/checkout`, `/pedido/[id]`, `/login`, `/registro`, `/cuenta`,
`/cuenta/pedidos`, `/cuenta/pedidos/[id]`, `/cuenta/datos`, `/ayuda`.

## Notes

- **Art.** The box scenes have text set in Fraunces and Caveat Brush. `components/Art.tsx` inlines those SVGs and points
  their font families at the self-hosted `next/font` variables. Simple illustrations are loaded with `<img>`.
- **Cart.** The cart and the in-progress custom box are kept in `localStorage`, so they persist across pages and
  reloads for both guests and signed-in users. They don't follow a user to another device. At checkout the server
  re-prices every line from the database, rejects sold-out or unknown items, and enforces the 6-item box limit.
- **SQLite.** The app keeps one connection and uses WAL mode. That suits one server process; if you run several app
  instances, move to a database server. `data/` is gitignored, so run `npm run db:setup` after cloning.
- **Checkout.** Checkout requires an account. Payment is simulated. The last delivery address is saved to the profile
  and used to prefill the next order.
- **Recommendation.** `src/lib/classify.ts` sends the "¿Cómo te sientes hoy?" text to DeepSeek (`deepseek-flash`, JSON
  mode, thinking mode off, 8-second timeout). DeepSeek picks the closest of the three MoodBoxes and quotes the words that
  guided it. The reply is validated: only the three box slugs are accepted, and only words that really appear in the text
  are shown. With no `DEEPSEEK_API_KEY`, or if the call fails, it falls back to the keyword matcher in `src/lib/mood.ts`.
