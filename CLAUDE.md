# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next dev server with Turbopack (http://localhost:3000)
npm run build        # Production build (Turbopack)
npm run start        # Serve the production build

npx prisma generate  # Regenerate the client into src/generated (run after every schema edit)
npx prisma migrate dev --name <name>   # Create + apply a migration
npx prisma db push   # Push schema changes without a migration (early-stage iteration)
npx prisma studio    # Browse the SQLite DB in the browser
```

There is no lint script, no ESLint/Prettier config, and no test framework in this repo. Type checking happens through `next build`; `npx tsc --noEmit` also works.

## Required environment

`.env` is gitignored and not present. Anything running the app or Prisma needs:

- `DATABASE_URL` — SQLite file URL, e.g. `file:./dev.db`. Note that [prisma.config.ts](prisma.config.ts) hardcodes `datasource.url` to `file:./dev.db`, which overrides the `env("DATABASE_URL")` in [prisma/schema.prisma](prisma/schema.prisma) for CLI commands.
- `NEXT_PUBLIC_API_URL` — CoinGecko markets endpoint (`.../coins/markets`), used by [useFetchCrypto.tsx](src/custom%20hooks/useFetchCrypto.tsx).
- `NEXT_PUBLIC_API_URL_SECOND` — CoinGecko coins base (`.../coins`), used by [useFetchHistoryCrypto.tsx](src/custom%20hooks/useFetchHistoryCrypto.tsx), which appends `/{id}/market_chart`.

[src/types/envTypes/env.d.ts](src/types/envTypes/env.d.ts) declares only `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY`; add new vars there to keep them typed.

## Architecture

Next.js 15 App Router, React 19, TypeScript, Tailwind 4, shadcn/ui (new-york style, slate base). Path alias `@/*` → `src/*`.

**Prisma client lives in the repo, not node_modules.** The generator output is `../src/generated` ([prisma/schema.prisma](prisma/schema.prisma)), and those files are committed. Import `PrismaClient` from `@/generated/client`, never from `@prisma/client`. Always go through the singleton in [src/lib/prisma.ts](src/lib/prisma.ts) (it caches on `global` outside production to survive dev hot reloads). The `.gitignore` entry `/src/generated/prisma` is stale — it does not match the current output path.

**Two data paths, deliberately separated:**

1. *Market data* — CoinGecko, fetched client-side via TanStack Query in `src/custom hooks/` (note the space in the folder name). `ReactQueryProvider` is mounted only in [src/app/crypto/layout.tsx](src/app/crypto/layout.tsx), so these hooks work exclusively inside the `/crypto` subtree; adding a query hook elsewhere requires mounting a provider there too.
2. *User data* — Prisma/SQLite, reached only from server actions and server components.

**Auth is cookie-only, no library.** [src/actions/actions.ts](src/actions/actions.ts) (`'use server'`) verifies credentials with bcrypt and sets a `session` cookie whose value is the raw `user.id` — it is httpOnly but unsigned, so possession of the id is the session. Server components read it directly: [Navbar.tsx](src/components/layout/Navbar.tsx) is an `async` server component that calls `cookies()` and passes `isAuthenticated` down to the client island [AuthNavButton.tsx](src/components/layout/AuthNavButton.tsx). There is no middleware and no route protection.

[src/lib/auth.ts](src/lib/auth.ts) holds a parallel, currently **unused** set of helpers (`createUser`, `validateUser`, `createSession`, `destroySession`). It duplicates the logic in `actions.ts` with slightly different cookie options. Pick one before extending auth rather than editing both.

**Form pattern (documented in [NOTES/react-hook-form-serverAction.md](NOTES/react-hook-form-serverAction.md)):** React Hook Form + `zodResolver` validate on the client, then the submit handler *manually calls* the server action and maps a returned `{ error }` onto a field via `setError`. Do not mix in `<form action={...}>`, `useActionState`, or `useFormStatus` — the project deliberately uses one paradigm per form. Zod schemas and their inferred types live in [src/schemas/authSchemas.ts](src/schemas/authSchemas.ts).

**Client preferences** (favorites, currency) are in a Zustand store persisted to localStorage ([src/store/favouriteStore.ts](src/store/favouriteStore.ts)). The `Watchlist` Prisma model exists but nothing writes to it yet — favorites are not server-persisted.

**Component layering:** `components/ui/` is generated shadcn primitives (regenerate with the shadcn CLI, config in [components.json](components.json)); `components/layout/` is page-level composition; `components/shared/` is reusable interactive pieces. Types are centralized in `src/types/` rather than colocated — add new props interfaces there.

Remote images are restricted to `coin-images.coingecko.com` in [next.config.ts](next.config.ts); any new image host must be added there.

## Conventions

- UI copy and many code comments are in Italian; keep user-facing strings consistent with the surrounding page.
- Routes currently shipped: `/`, `/crypto`, `/crypto/[id]`, `/auth/login`, `/auth/register`.

## Known rough edges

These are real and will bite; fix rather than replicate them:

- Both auth actions `redirect("/dashboard")` and `revalidatePath("/dashboard")`, but no `/dashboard` route exists — a successful login or registration lands on a 404.
- `AuthNavButton` inverts its condition: an authenticated user is shown "Accedi" → `/auth/login`.
- [src/app/crypto/[id]/page.tsx](src/app/crypto/%5Bid%5D/page.tsx) is marked `'use client'` yet is `async` and `await`s `params`, and then also reads `params.id` directly. It should be a server component, or drop the await.
- `registerAction` does not check for an existing email or re-validate with Zod on the server; a duplicate email surfaces as an unhandled Prisma unique-constraint error.
- SQLite is dev-only. The README notes Postgres is the intended production datasource on Vercel (`pg` is already a dependency), so the datasource provider must change before deploying.
