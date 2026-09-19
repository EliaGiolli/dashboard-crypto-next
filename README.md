# NexCoin — Next Crypto Dashboard 🚀

A cryptocurrency dashboard built with **Next.js 16**, **React 19**, **TypeScript**, **TailwindCSS 4**
and **shadcn/ui**. It pulls live market data from the CoinGecko API and presents it as interactive
charts and tables.

> **⚠️ Refactor in progress.** The project is midway through a move to a feature-based architecture
> with server-side data fetching and Better Auth. This README describes **what is true today**, not
> the target state. See [ROADMAP.md](./ROADMAP.md) for the plan and what is still pending.

---

## Table of Contents
- [Status](#status)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [Routes](#routes)
- [Known Issues](#known-issues)
- [License](#license)

---

## Status

| Area | Today | Planned |
|---|---|---|
| Framework | Next.js 16.3.5, React 19.3, Turbopack | — |
| Structure | `core/` · `features/` · `shared/`, boundaries lint-enforced | — |
| Market data | Client-side via TanStack Query | Server-cached with `use cache` (Phase 3) |
| Auth | Hand-rolled bcrypt + unsigned `session` cookie | Better Auth (Phase 2) |
| Favorites | Zustand + `localStorage` | `Watchlist` table + Server Functions (Phase 4) |
| Tooling | ESLint flat config, Vitest, Playwright, axe | — |
| Tests written | 5 unit tests | Unit + integration + E2E + a11y (Phase 7) |

---

## Tech Stack

- **Next.js 16** (App Router, Server & Client Components, Turbopack by default)
- **React 19.3** · **TypeScript 5.9**
- **TailwindCSS 4** · **shadcn/ui** (new-york, slate) · **Radix** · **lucide-react**
- **Prisma 6** + **SQLite** (dev)
- **Zod 4** — form and environment validation
- **TanStack React Query** — client-side fetching *(removed in Phase 3)*
- **Zustand** — favorites store *(removed in Phase 4)*
- **Recharts** · **Motion**
- **Vitest** + **Testing Library** · **Playwright** + **axe-core**

---

## Architecture

Feature-based, with three top-level folders beside Next's `app/`:

```
src/
├── app/                    # routes only — page/layout/error, thin composition
├── core/                   # cross-cutting infrastructure; knows nothing about features
│   ├── config/envParser.ts #   server-only env access, fails fast
│   ├── schema/             #   Zod schema for every env var
│   ├── lib/prisma.ts       #   Prisma singleton
│   ├── generated/          #   Prisma client output (gitignored)
│   └── types/              #   ambient types
├── features/               # one folder per domain, each with a public index.ts
│   ├── auth/               #   components, schemas, actions, types
│   ├── crypto/             #   components (incl. charts), hooks, types
│   ├── watchlist/          #   favorite button, store
│   └── home/               #   landing page sections
└── shared/
    ├── ui/                 #   shadcn primitives + atomic presentational components
    ├── layouts/            #   Navbar, Footer, MobileMenu
    ├── providers/          #   ReactQueryProvider (removed in Phase 3)
    └── utils/              #   cn()
```

### The dependency rule

```
app  →  features  →  shared + core
```

`shared/` and `core/` must never import from `features/`, and features reach each other only through
a public `index.ts` barrel. **This is enforced by ESLint**, not just documented — see the
`no-restricted-imports` zones in [eslint.config.mjs](./eslint.config.mjs).

The convention that makes it expressible: **relative imports inside a feature, `@/features/x` barrel
imports across features**, so the boundary is visible in the import statement itself.

`core/lib/` is infrastructure that talks to the outside world (Prisma, env). `shared/utils/` is pure,
dependency-free functions. If it can't be unit-tested without a mock, it belongs in `core/`.

### Conventions

1. **Separation of concerns.** No business logic in a component body — fetching, validation and
   formatting live in `lib/` functions or hooks. Components take props and return JSX.
2. **Server by default.** `'use client'` marks the smallest possible island. A server component that
   needs interactivity imports a client island; never the reverse.
3. **`import 'server-only'`** on any module touching Prisma, secrets or the env parser, so a boundary
   mistake is a build error rather than a leaked secret.
4. Async Server Components are **not** unit-testable with Vitest or React Testing Library — Next
   recommends E2E for them. Extracting logic into plain functions is what makes it testable at all.

### Data flow today

Market data is fetched **in the browser** by TanStack Query hooks in `features/crypto/hooks/`, with
`ReactQueryProvider` mounted in the `/crypto` layout. Charts and tables call those hooks directly.

Auth is hand-rolled: Server Functions in `features/auth/actions.ts` verify a bcrypt hash and set a
`session` cookie holding the raw user id. `features/auth/components/AuthNav` reads it on the server
and passes the result into the presentational `Navbar` through an `authSlot` prop.

Favorites live in a Zustand store persisted to `localStorage`. The `Watchlist` Prisma table exists
but nothing writes to it yet.

---

## Getting Started

**Requirements:** Node.js **20.9+** (developed on 24.x), npm.

```bash
git clone https://github.com/EliaGiolli/dashboard-crypto-next.git
cd dashboard-crypto-next
npm install          # postinstall runs `prisma generate`
cp .env.example .env # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Environment

Every variable is validated by [src/core/schema/parserSchema.ts](./src/core/schema/parserSchema.ts)
and read through [src/core/config/envParser.ts](./src/core/config/envParser.ts), which fails at
startup listing **all** problems at once rather than surfacing an `undefined` later.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma/SQLite connection string, e.g. `file:./dev.db` |
| `COINGECKO_API_URL` | CoinGecko REST base, no trailing slash. Server-side only |
| `BETTER_AUTH_SECRET` | ≥32 chars — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL for auth callbacks |
| `NEXT_PUBLIC_API_URL` | *Interim.* Still read by the client-side hooks |
| `NEXT_PUBLIC_API_URL_SECOND` | *Interim.* Removed in Phase 3 |

The two `NEXT_PUBLIC_` variables exist only until fetching moves to the server. After Phase 3 the
CoinGecko endpoint never reaches the client bundle, which is what makes adding an API key safe.

`prisma.config.ts` hardcodes `datasource.url` to `file:./dev.db` for CLI commands, overriding
`DATABASE_URL` from the schema — keep the two in sync.

### Database

```bash
npx prisma generate               # regenerate the client into src/core/generated
npx prisma migrate dev --name x   # create + apply a migration
npx prisma studio                 # browse the data
```

The Prisma client is **generated build output** and is gitignored; `postinstall` regenerates it.

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack is the default in Next 16 — no flag needed) |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` | ESLint — Next rules, jsx-a11y, and the architecture boundaries |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, unit + integration |
| `npm run test:unit` / `test:integration` | One project only |
| `npm run test:e2e` / `test:a11y` | Playwright, and the axe scans |
| `npm run test:all` | Everything, in order |

---

## Testing

Three tiers, because they cover genuinely different things:

- **Unit** (Vitest + jsdom) — pure functions, hooks, client components, sync server components.
- **Integration** (Vitest + node) — Server Functions against a throwaway `test.db`, never `dev.db`.
- **E2E / a11y** (Playwright + axe) — async Server Components, streaming, route protection and full
  user flows, plus an automated accessibility scan per route.

Currently written: the 5 unit tests covering the env schema. The rest lands in Phase 7.

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — About, market charts, call to action |
| `/crypto` | Market table with sidebar |
| `/crypto/[id]` | Per-coin price, volume and market-cap charts |
| `/auth/login`, `/auth/register` | Auth forms |

`/dashboard` does **not** exist yet — see below.

---

## Known Issues

Tracked in [ROADMAP.md](./ROADMAP.md) with the phase that fixes each.

**Broken behaviour**
- Login and registration both `redirect('/dashboard')`, but that route does not exist — **every
  successful auth lands on a 404**.
- `crypto/[id]/page.tsx` is marked `'use client'` yet is `async` and awaits `params`, which Next 16
  does not allow.
- The footer's two nav links point to `/homepage`, and the mobile menu's to `/projects`. Neither route exists.
- The table renders `€` on all money columns while the API returns USD.
- `AuthNavButton` inverts its condition, so an authenticated user is offered "Accedi".

**Security**
- The `session` cookie holds a **raw, unsigned user id**. It is `httpOnly`, but anyone can set
  `session=<any user id>` by hand. Better Auth replaces this in Phase 2.

**Correctness / performance**
- `MarketCap` and `MarketCapSingleCrypto` share an SVG gradient id (as do the two volume charts), so
  the second to mount renders the first one's fill.
- Every route builds as `ƒ (Dynamic)` — nothing is static — because the root layout reads the session.
- `About` and `ChartView` call `motion(Button)` inside the component body, creating a new component
  type on every render.
- `next/image` aspect-ratio warnings on every `/crypto` load.

**Accessibility**
- `<html lang="en">` while the entire UI is in Italian; `global-error.tsx` has no `lang` at all.
- `/crypto` has no `<h1>` and its `aria-labelledby` points at an id nothing renders.
- The table renders 6 headers but 5 body cells at mobile width.

---

## License

MIT. See the LICENSE file.
