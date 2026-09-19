<div align="center">

# 🚀 NexCoin

**A cryptocurrency dashboard built on the Next.js 16 App Router.**

Live CoinGecko market data as interactive charts and tables, on a feature-based
architecture whose boundaries are enforced by the linter rather than by convention.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-dev-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-6366F1?style=for-the-badge)](https://better-auth.com)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev)

[![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

</div>

> [!WARNING]
> **Refactor in progress.** The project is midway through a move to server-side data fetching
> and a DB-backed watchlist. This README describes **what is true today**, not the target state.
> See [ROADMAP.md](./ROADMAP.md) for the plan and what is still pending.

---

## 📖 Table of Contents

- [📌 Status](#-status)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🔐 Authentication](#-authentication)
- [⚡ Quick Start](#-quick-start)
- [🔑 Environment](#-environment)
- [🗄️ Database](#️-database)
- [📜 Scripts](#-scripts)
- [🧪 Testing](#-testing)
- [🗺️ Routes](#️-routes)
- [🐛 Known Issues](#-known-issues)
- [📄 License](#-license)

---

## 📌 Status

| | Area | Today | Planned |
|---|---|---|---|
| ✅ | Framework | Next.js 16.3.5, React 19.3, Turbopack | — |
| ✅ | Structure | `core/` · `features/` · `shared/`, boundaries lint-enforced | — |
| ✅ | Auth | **Better Auth** — signed sessions, `Session`/`Account` tables, `proxy.ts` guard | — |
| 🚧 | Market data | Client-side via TanStack Query | Server-cached with `use cache` *(Phase 3)* |
| 🚧 | Favorites | Zustand + `localStorage` | `Watchlist` table + Server Functions *(Phase 4)* |
| ✅ | Tooling | ESLint flat config, Vitest, Playwright, axe | — |
| 🚧 | Tests | 17 unit + integration cases | E2E and a11y suites *(Phase 7)* |

---

## 🧰 Tech Stack

| | Layer | Choice |
|---|---|---|
| ⚛️ | **Framework** | Next.js 16 (App Router, Server & Client Components, Turbopack) · React 19.3 |
| 🔷 | **Language** | TypeScript 5, `strict` |
| 🎨 | **Styling** | TailwindCSS 4 · shadcn/ui (new-york, slate) · Radix · lucide-react |
| 🔐 | **Auth** | Better Auth 1.7 with the Prisma adapter |
| 🗄️ | **Data** | Prisma 6 + SQLite (dev) |
| ✅ | **Validation** | Zod 4 — forms *and* environment |
| 📊 | **Charts** | Recharts · Motion |
| 🧪 | **Testing** | Vitest 5 + Testing Library · Playwright + axe-core |
| 📦 | **Transitional** | TanStack Query *(removed in Phase 3)* · Zustand *(removed in Phase 4)* |

---

## 🏗️ Architecture

Feature-based, with three top-level folders beside Next's `app/`:

```
src/
├── app/                      # routes only — page/layout/error, thin composition
│   ├── api/auth/[...all]/    #   Better Auth's own endpoints
│   └── dashboard/            #   protected route
├── core/                     # cross-cutting infrastructure; knows nothing about features
│   ├── config/envParser.ts   #   server-only env access, fails fast
│   ├── schema/               #   Zod schema for every env var
│   ├── lib/prisma.ts         #   Prisma singleton
│   ├── lib/auth.ts           #   Better Auth server instance (server-only)
│   ├── lib/auth-client.ts    #   Better Auth React client
│   ├── generated/            #   Prisma client output (gitignored)
│   └── types/                #   ambient types
├── features/                 # one folder per domain, each with a public index.ts
│   ├── auth/                 #   components, hooks, lib/session.ts, actions, schemas
│   ├── crypto/               #   components (incl. charts), hooks, types
│   ├── watchlist/            #   favorite button, store
│   └── home/                 #   landing page sections
├── shared/
│   ├── ui/                   #   shadcn primitives + atomic presentational components
│   ├── layouts/              #   Navbar, Footer, MobileMenu
│   ├── providers/            #   ReactQueryProvider (removed in Phase 3)
│   └── utils/                #   cn()
└── proxy.ts                  # Next 16's middleware — optimistic guard on /dashboard
```

### 🚦 The dependency rule

```
app  →  features  →  shared + core
```

`shared/` and `core/` must never import from `features/`, and features reach each other only through
a public `index.ts` barrel. **This is enforced by ESLint**, not just documented — see the
`no-restricted-imports` zones in [eslint.config.mjs](./eslint.config.mjs).

The convention that makes it expressible: **relative imports inside a feature, `@/features/x` barrel
imports across features**, so the boundary is visible in the import statement itself.

`core/lib/` is infrastructure that talks to the outside world (Prisma, Better Auth, env).
`shared/utils/` is pure, dependency-free functions. If it can't be unit-tested without a mock, it
belongs in `core/`.

### 📐 Conventions

1. **Separation of concerns.** No business logic in a component body — fetching, validation and
   formatting live in `lib/` functions or hooks. Components take props and return JSX.
2. **Server by default.** `'use client'` marks the smallest possible island. A server component that
   needs interactivity imports a client island; never the reverse.
3. **`import 'server-only'`** on any module touching Prisma, secrets or the Better Auth server
   instance, so a boundary mistake is a build error rather than a leaked secret.
4. **Server Functions are reachable by direct POST**, not only through the UI, so every one of them
   re-validates its input server-side. Client-side validation is a convenience, not the enforcement.
5. Async Server Components are **not** unit-testable with Vitest or React Testing Library — Next
   recommends E2E for them. Extracting logic into plain functions is what makes it testable at all.

### 🔁 Data flow today

**Market data** is fetched **in the browser** by TanStack Query hooks in `features/crypto/hooks/`,
with `ReactQueryProvider` mounted in the `/crypto` layout. Charts and tables call those hooks
directly. Phase 3 moves this to a server-only, cached data layer.

**Favorites** live in a Zustand store persisted to `localStorage`. The `Watchlist` table exists but
nothing writes to it yet — Phase 4 connects them.

---

## 🔐 Authentication

Email and password through [Better Auth](https://better-auth.com), with the Prisma adapter.

| | | |
|---|---|---|
| 🎫 | **Session** | A signed, opaque token backed by a `Session` row — not a user id in a cookie |
| 🔒 | **Credentials** | Hashed onto an `Account` row (`providerId: "credential"`); `User` has no password column |
| 📍 | **One read path** | [`features/auth/lib/session.ts`](./src/features/auth/lib/session.ts) — `getSession()` (memoised with `React.cache`), `getCurrentUser()`, `requireUser()` |
| 📝 | **Forms** | React Hook Form + `zodResolver`, wiring extracted into `useAuthForm`; the Server Function re-validates with the same schema |
| 🛡️ | **Route guard** | [`src/proxy.ts`](./src/proxy.ts) checks for a session cookie on `/dashboard` — an **optimistic** check only. The page itself calls `requireUser()`, which is the real boundary |

> [!NOTE]
> The previous implementation stored a **raw, unsigned `user.id`** in the `session` cookie, so
> setting `session=<any user id>` by hand was enough to become that user. That is what this
> replaces. The migration resets the database — existing credentials do not carry over.

---

## ⚡ Quick Start

**Requirements:** Node.js **20.9+** (developed on 24.x), npm.

```bash
git clone https://github.com/EliaGiolli/dashboard-crypto-next.git
cd dashboard-crypto-next

npm install                       # postinstall runs `prisma generate`
cp .env.example .env              # then fill in the values
npx prisma migrate dev            # create dev.db with the current schema

npm run dev
```

Open <http://localhost:3000>.

> [!TIP]
> Generate the auth secret with `openssl rand -base64 32`. The app refuses to start if it is
> shorter than 32 characters.

---

## 🔑 Environment

Every variable is validated by [parserSchema.ts](./src/core/schema/parserSchema.ts) and read through
[envParser.ts](./src/core/config/envParser.ts), which fails at startup listing **all** problems at
once rather than surfacing an `undefined` later.

| | Variable | Purpose |
|---|---|---|
| 🗄️ | `DATABASE_URL` | Prisma/SQLite connection string, e.g. `file:./dev.db` |
| 📈 | `COINGECKO_API_URL` | CoinGecko REST base, no trailing slash. Server-side only |
| 🔑 | `BETTER_AUTH_SECRET` | ≥32 chars — `openssl rand -base64 32` |
| 🌐 | `BETTER_AUTH_URL` | Base URL for auth callbacks, e.g. `http://localhost:3000` |
| ⏳ | `NEXT_PUBLIC_API_URL` | *Interim.* Still read by the client-side crypto hooks |
| ⏳ | `NEXT_PUBLIC_API_URL_SECOND` | *Interim.* Both are removed in Phase 3 |

The two `NEXT_PUBLIC_` variables exist only until fetching moves to the server. After Phase 3 the
CoinGecko endpoint never reaches the client bundle, which is what makes adding an API key safe.

---

## 🗄️ Database

```bash
npx prisma generate                 # regenerate the client into src/core/generated
npx prisma migrate dev --name x     # create + apply a migration
npx prisma studio                   # browse the data
```

The Prisma client is **generated build output** and is gitignored; `postinstall` regenerates it, so
a fresh clone works without extra steps.

`prisma.config.ts` reads `DATABASE_URL` from the environment, which is what lets the integration
suite point the CLI at a throwaway `test.db` instead of `dev.db`.

**Models:** `User`, `Session`, `Account`, `Verification` (Better Auth core) and `Watchlist`
(`@@unique([userId, coinId])`, cascading from `User`).

---

## 📜 Scripts

| | Script | Does |
|---|---|---|
| 🔥 | `npm run dev` | Dev server (Turbopack is the default in Next 16 — no flag needed) |
| 📦 | `npm run build` / `start` | Production build / serve |
| 🧹 | `npm run lint` | ESLint — Next rules, jsx-a11y, and the architecture boundaries |
| 🔎 | `npm run typecheck` | `tsc --noEmit` |
| 🧪 | `npm test` | Vitest, unit + integration |
| 🎯 | `npm run test:unit` / `test:integration` | One project only |
| 🎭 | `npm run test:e2e` / `test:a11y` | Playwright, and the axe scans |
| 🚦 | `npm run test:all` | Everything, in order |

---

## 🧪 Testing

Three tiers, because they cover genuinely different things:

| | Tier | Runner | Covers |
|---|---|---|---|
| 🧩 | **Unit** | Vitest + jsdom | Pure functions, hooks, client components, sync server components |
| 🔌 | **Integration** | Vitest + node | Server-side logic against a throwaway `test.db`, never `dev.db` |
| 🎭 | **E2E / a11y** | Playwright + axe | Async Server Components, streaming, route protection, full user flows |

**Written so far — 17 cases:**

- **Environment** (5) — the Zod schema accepts a valid env and reports every problem at once.
- **`useAuthForm`** (5) — malformed email, short password and mismatched confirmation all block
  submission; valid input reaches the Server Function; a server error lands on the password field.
- **`AuthNavButton`** (2) — both session states, locking in the un-inverted condition.
- **Auth integration** (5) — the credential is stored as a hash on `Account`; a duplicate email
  surfaces as an `APIError` rather than a Prisma constraint error; a wrong password is rejected; a
  real sign-in cookie resolves back to the user; and **a forged cookie holding a raw user id
  resolves to `null`**.

The E2E and accessibility suites are configured but empty — they land in Phase 7.

---

## 🗺️ Routes

| | Route | Description |
|---|---|---|
| 🏠 | `/` | Landing page — About, market charts, call to action |
| 📊 | `/crypto` | Market table with sidebar |
| 🪙 | `/crypto/[id]` | Per-coin price, volume and market-cap charts |
| 🔓 | `/auth/login` · `/auth/register` | Auth forms |
| 🔒 | `/dashboard` | Protected — `proxy.ts` guard plus a server-side `requireUser()` |
| ⚙️ | `/api/auth/[...all]` | Better Auth's own endpoints |

---

## 🐛 Known Issues

Tracked in [ROADMAP.md](./ROADMAP.md) with the phase that fixes each.

### 💥 Broken behaviour

- `crypto/[id]/page.tsx` is marked `'use client'` yet is `async` and awaits `params`, which Next 16
  does not allow.
- The footer's two nav links point to `/homepage`, and the mobile menu's to `/projects`. Neither
  route exists.
- The table renders `€` on all money columns while the API returns USD.

### 🐢 Correctness / performance

- `MarketCap` and `MarketCapSingleCrypto` share an SVG gradient id (as do the two volume charts), so
  the second to mount renders the first one's fill.
- Every route builds as `ƒ (Dynamic)` — nothing is static — because the root layout reads the
  session. Phase 5 moves that read behind `<Suspense>`.
- `About` and `ChartView` call `motion(Button)` inside the component body, creating a new component
  type on every render.
- `next/image` aspect-ratio warnings on every `/crypto` load.

### ♿ Accessibility

- `<html lang="en">` while the entire UI is in Italian; `global-error.tsx` has no `lang` at all.
- `/crypto` has no `<h1>` and its `aria-labelledby` points at an id nothing renders.
- The table renders 6 headers but 5 body cells at mobile width.

---

## 📄 License

Released under the **MIT License**.

<div align="center">
<br />
<sub>Built by <a href="https://github.com/EliaGiolli">Elia Giolli</a></sub>
</div>
