# NexCoin Refactor Roadmap

Working document for the `refactor/feature-architecture` branch. Checkboxes are ticked as each
phase lands, committed alongside that phase's work.

- **Scope:** feature-based architecture · server-first data · Better Auth · testing · SEO/a11y
- **Distinct from:** `CLAUDE.md` (durable repo guidance, rewritten in Phase 8) and `README.md` (user-facing)

---

## Context

NexCoin fetches all CoinGecko data in the browser through TanStack Query, keeps favorites in a
Zustand store persisted to `localStorage`, and leaves the `Watchlist` Prisma table unused. Auth is
hand-rolled: a `session` cookie holding a raw, unsigned `user.id`. Components are grouped by vague
labels (`layout/` vs `shared/`) rather than by feature, business logic sits inline in component
bodies, and there is no linting and no testing of any kind.

Meanwhile **Next 16.3.5 is already installed** (`package.json` declares `^16.3.5`) but the code is
still written for Next 15 and the upgrade's mechanical steps were never finished — React is still
19.1.0 and the scripts still pass the now-ignored `--turbopack` flag.

**Decisions taken:** upgrade *and* restructure · server-cached fetching, no client polling ·
favorites DB-backed, login required · fix all identified bugs · reset `dev.db` and adopt the Better
Auth schema · drop Zustand entirely · merge the PR once tests pass.

---

## Target architecture

```
src/
  app/                        # ROUTES ONLY — page/layout/loading/error, thin composition
    api/auth/[...all]/route.ts
    crypto/ auth/ dashboard/
  core/                       # cross-cutting infrastructure; knows nothing about features
    lib/
      prisma.ts               # Prisma singleton
      auth.ts                 # Better Auth server instance  (server-only)
      auth-client.ts          # Better Auth React client
    config/envParser.ts       # server-only, fails fast on bad env
    schema/parserSchema.ts    # Zod schema for every env var
    hooks/                    # genuinely global hooks only
    types/                    # ambient + global types
    generated/                # Prisma client output (moved from src/generated)
  features/
    auth/
      components/             # AuthForm, AuthNavButton, LogoutButton  (client islands)
      hooks/                  # useAuthForm — RHF + zod wiring, no JSX
      lib/                    # getCurrentUser(), session helpers  (server-only)
      schemas/                # authSchemas.ts
      actions.ts              # 'use server'
      types.ts
      index.ts                # public surface
    crypto/
      components/             # CryptoTable, CoinSidebar, chart wrappers
      lib/                    # coingecko.ts (server-only), formatters, chart adapters
      types.ts
      index.ts
    watchlist/
      components/             # FavoriteButton  (client island)
      lib/                    # watchlist queries (server-only)
      actions.ts
      types.ts
      index.ts
    home/                     # landing-page sections (About, CallToAction, ChartView)
  shared/
    ui/                       # shadcn primitives + atomic presentational components
    layouts/                  # Navbar, Footer, MobileMenu
    providers/                # ReactQueryProvider (removed in Phase 3)
    utils/                    # cn(), currency/number formatters
```

**Dependency rule (one direction only):** `app → features → shared + core`

- `shared/` and `core/` never import from `features/`.
- `core/` never imports UI.
- Features do not reach into each other's internals. The one cross-feature edge this app needs is
  **crypto → watchlist** (the table renders a favorite button), and it goes through
  `features/watchlist/index.ts`, not a deep path.

**`core/lib/` vs `shared/utils/`:** `core/lib/` is infrastructure that talks to the outside world
(Prisma, Better Auth, env). `shared/utils/` is pure, dependency-free functions (`cn()`, currency and
percentage formatting). If it can't be unit-tested without a mock, it belongs in `core/`.

The existing `@/*` → `./src/*` alias already covers `@/core/...`, `@/features/...`, `@/shared/...`,
so `tsconfig.json` needs no change. `components.json` does.

---

## Standing conventions (apply to every phase)

1. **Separation of concerns.** No business logic in a component body. Data fetching, validation,
   formatting and DB access live in `lib/` functions or custom hooks. Components take props and
   return JSX.
2. **Atomic components.** A component does one thing.
3. **Server by default; client only for interaction.** `'use client'` marks the *smallest possible*
   island. When a server component needs interactivity, extract that island into its own file and
   import it into the server component. Never the reverse: a client component cannot import a server
   component, only receive one as `children`/props.
4. **`import 'server-only'`** at the top of every module touching Prisma, secrets, or the Better
   Auth server instance.
5. **Testability follows from 1–3.** Next.js states that **async Server Components are not supported
   by Vitest or React Testing Library** — E2E is the recommended tool for them. Logic extracted into
   plain functions and hooks is the only logic that can be unit-tested.

---

## Modern API usage map

**Server Functions vs Server Actions.** Next's current docs call any `'use server'` async function a
**Server Function**. A **Server Action** is a Server Function used in an *action* context: passed to
`<form action={}>` or `<button formAction={}>`, which wraps it in `startTransition` automatically.
Server Action is the narrower term. `features/*/actions.ts` holds Server Functions, some of which
are used as Actions.

**Server Functions are reachable by direct POST, not only through the UI.** Every one must verify
auth itself and re-validate its input.

| API | Used here? | Where, and why |
|---|---|---|
| `useOptimistic` | **Yes** | `FavoriteButton`. Star flips instantly while the Server Function round-trips, reverts itself on failure. Biggest perceived-latency win in the app. |
| `useTransition` | **Yes** | Alongside `useOptimistic` for the toggle's pending/disabled state. |
| `<Suspense>` | **Yes, extensively** | Not optional under `cacheComponents` — every session read and uncached fetch needs a boundary. Also the UX mechanism: shell paints immediately, charts and session chrome stream in. |
| `useActionState` | **No** | Right hook for the native-form pattern, which the auth forms don't use. |
| `useFormStatus` | **No** — deliberately | Reads the nearest enclosing `<form action={...}>`. Auth forms use RHF's `onSubmit` with **no** `action` prop, so it would return `pending: false` forever. Pending comes from RHF's `formState.isSubmitting`. |
| `refresh()` (`next/cache`, new in 16) | **No** | `updateTag` fits the watchlist better: expires *and* refreshes in one request (read-your-writes). `refresh()` doesn't revalidate tagged data. |
| `updateTag` / `revalidateTag` | **Yes** | Phase 4. |
| React Compiler | **No** | Stable in 16 but relies on Babel and slows builds. Revisit if render cost shows up. |

**The forms trade-off (decided: keep RHF).** RHF + zodResolver + manual action call gives
field-level validation as the user types and easy mapping of server errors onto fields; it costs
`useFormStatus`/`useActionState` and pre-hydration submission. The native
`<form action>` + `useActionState` + `useFormStatus` path is progressively enhanced (works before JS
loads — a real a11y win) but validates only after a round-trip. Keeping RHF as the project's
established convention; flip is contained to `features/auth` if wanted.

---

## Phase 0 — Branch, ROADMAP, finish Next 16, tooling

- [x] Create branch `refactor/feature-architecture`
- [x] Create `ROADMAP.md` (this file) and commit it first
- [x] Restore `CLAUDE.md` (deleted by mistake; `NOTES/` deletion left as intended)
- [x] React upgraded to **19.3.0** (`react`, `react-dom`)
- [x] `@types/node` bumped `^20` → `^24` — it was behind the Node 24.14.1 runtime, and Vitest 5 requires `>=22`
- [x] Drop redundant flags: `"dev": "next dev"`, `"build": "next build"` (Turbopack is default in 16)
- [x] Scripts added: `lint`, `typecheck`, `test`, `test:watch`, `test:unit`, `test:integration`, `test:e2e`, `test:a11y`, `test:all`
- [x] ESLint flat config (`eslint.config.mjs`) with `@next/eslint-plugin-next`, `eslint-plugin-jsx-a11y` and `typescript-eslint`
  - Pinned to **ESLint 9**, not 10: `eslint-plugin-jsx-a11y@6.10.2` peer-caps at 9. Revisit when the plugin ships v10 support
- [x] `npx next typegen` — `PageProps` / `LayoutProps` helpers available; also regenerated the gitignored `next-env.d.ts` (its absence was the one pre-existing typecheck error)
- [x] `AGENTS.md` pointing at the bundled version-matched docs in `node_modules/next/dist/docs/`
  - Written by hand: the `agents-md` codemod is interactive and the agent shell has no stdin
- [x] `.env` generated (gitignored) + `.env.example` committed
- [x] `src/core/schema/parserSchema.ts` — Zod schema for every env var
- [x] `src/core/config/envParser.ts` — `server-only`, fails fast with all problems listed at once
- [ ] ~~Enable `cacheComponents: true` in Phase 0~~ → **deferred to Phase 3.** Verified by trial build: the flag fails the build today, so enabling it here would leave every intermediate phase red. It goes in once server-first fetching lands and the `<Suspense>` boundaries exist

### Testing infrastructure

- [x] Installed: `vitest` 5, `@vitejs/plugin-react`, `jsdom`, `@testing-library/{react,dom,jest-dom,user-event}`, `@playwright/test`, `@axe-core/playwright`
- [x] `npx playwright install chromium`
- [x] `vitest.config.mts` with **two projects** (`unit` / jsdom, `integration` / node)
  - Dropped `vite-tsconfig-paths` in favour of Vite 8's native `resolve.tsconfigPaths` (one less dependency; unit run went 6.2s → 1.9s)
- [x] `tests/setup/unit.setup.ts` and `tests/setup/integration.setup.ts` (integration pins `DATABASE_URL` to a throwaway `test.db`, never `dev.db`)
- [x] `playwright.config.ts` driving a real Next server; a11y specs split by `@a11y` tag
- [x] `.gitignore`: `test.db*`, `/test-results/`, `/playwright-report/`, `!.env.example`
- [x] First tests green — 5 unit tests covering `envSchema`

### Baseline established

- `npm run typecheck` — clean
- `npm run build` — green. **Every route reports `ƒ (Dynamic)`, nothing static**, because the root-layout `Navbar` reads `cookies()`. Empirical confirmation of the Phase 5 finding
- `npm run lint` — 3 remaining problems, all already tracked below (async client component, redundant `role`, missing `lang` on `global-error`). Trivial unused-import errors cleared in place

---

## Phase 1 — Move to the feature-based skeleton

A **pure move**: no logic changes, so the diff stays reviewable and any breakage is an import path.

- [x] `components/ui/*` → `shared/ui/` (plus `SkeletonComponent`, `MotionButton` as atomic UI)
- [x] `Navbar`, `Footer`, `MobileMenu` → `shared/layouts/`
- [x] `lib/utils.ts` → `shared/utils/cn.ts` with an `index.ts` barrel
- [x] `lib/prisma.ts` → `core/lib/`; `types/envTypes/*` → `core/types/`
- [x] Auth, crypto, watchlist and home pieces into their feature folders
- [x] Prisma generator output → `core/generated`, regenerated rather than moved
- [x] `.gitignore` now ignores `/src/core/generated/` (the old `/src/generated/prisma` entry never matched, so build output was being committed). Added `postinstall: prisma generate` so a fresh clone still works
- [x] **Deleted `src/custom hooks/`** — the two hooks moved to `features/crypto/hooks/` and disappear in Phase 3
- [x] **All imports rewritten** — 50 files. Fixed the `../../..//types` double-slash typos and the broken `../../assets/crypto-img.jpg` relative path
- [x] **Split `CryptoApiTypes.ts`** — API shapes stay in `features/crypto/types.ts`; `QueryProviderTypes` moved into the provider that owns it; `SidebarProps` renamed `CryptoListProps` with a note that Phase 3 gives each component its own props
- [x] Feature barrels (`index.ts`) defining each feature's public surface
- [x] `components.json` aliases updated so `npx shadcn add` lands in `@/shared/ui`
- [x] Deleted two confirmed-dead files rather than moving them: `CryptoView.tsx` (imported by nothing) and `lib/auth.ts` (the unused parallel auth implementation Phase 2 would have deleted anyway)
- [x] Confirmed `npm run build`, `tsc --noEmit` and the unit suite all pass

### The dependency rule is now enforced, not just documented

- [x] ESLint `no-restricted-imports` zones: `shared/` and `core/` cannot import from `features/`; features cannot deep-import each other, only via a barrel
- [x] Convention that makes it expressible: **relative imports inside a feature, `@/features/x` barrel across features.** The boundary is visible in the import syntax
- [x] Two real violations this surfaced and fixed:
  - `shared/layouts/Navbar` imported `features/auth/AuthNavButton` *and* read `cookies()`. Navbar is now presentational with an `authSlot` prop; the session read moved to `features/auth/components/AuthNav`, which the route layout composes in. This also pre-stages the Phase 5 `<Suspense>` work
  - `shared/providers/ReactQueryProvider` imported its props type from `features/crypto`; it now owns them

---

## Phase 2 — Better Auth

Replaces the hand-rolled auth **and closes the security hole**: the old `session` cookie was a raw
unsigned user id, so anyone could set `session=<any user id>` by hand and be that user.

- [x] `npm i better-auth` (1.7.5); removed `bcrypt` and `@types/bcrypt`
- [x] Env: `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — already generated and schema-validated in
      Phase 0, so nothing to add here
- [x] `core/lib/auth.ts` — `betterAuth({ database: prismaAdapter(prisma, { provider: 'sqlite' }),
      emailAndPassword: { enabled: true }, plugins: [nextCookies()] })`, `server-only`.
      `nextCookies()` is last in the plugin array (it is the after-hook that flushes Set-Cookie into
      next/headers, so everything that sets a cookie must run before it)
- [x] `minPasswordLength: 6` pinned explicitly — Better Auth defaults to **8**, which would have let
      a 6-character password pass `loginSchema`/`registerSchema` in the browser and then be rejected
      by a round-trip
- [x] `core/lib/auth-client.ts` — `createAuthClient()` from `better-auth/react`, no `baseURL` (the
      client defaults to the current origin, so no NEXT_PUBLIC_ var is needed)
- [x] `src/app/api/auth/[...all]/route.ts` — `export const { GET, POST } = toNextJsHandler(auth)`
- [x] Schema: `User`, `Session`, `Account`, `Verification` added, `User.password` dropped
      (credentials now live on an `Account` row with `providerId = "credential"`), `Watchlist`
      relation kept and given `onDelete: Cascade`
  - Written from the library's own `getAuthTables()` output rather than `npx @better-auth/cli
    generate`: the CLI is versioned separately (1.4.21 against better-auth 1.7.5) and has to resolve
    `@/*` aliases plus a `server-only` import to load the config. Dumping the table definitions the
    adapter actually uses is exact and verifiable
- [x] `npx prisma migrate reset` (deleted existing dev.db users, **with explicit consent** — Prisma
      refuses destructive migrate commands invoked by an agent) + `npx prisma migrate dev --name
      better-auth`, applied as `20260919164514_better_auth`
- [ ] `npx prisma generate` — **blocked by a file lock.** A running `npm run dev` holds
      `src/core/generated/query_engine-windows.dll.node` open, so the rename fails with EPERM. Stop
      the dev server and re-run; the schema is already migrated, only the client is stale
- [x] `features/auth/lib/session.ts` — `getSession()` wrapping `auth.api.getSession({ headers: await
      headers() })` and memoised with `React.cache`, plus `getCurrentUser()` and `requireUser()`.
      **Single place session handling lives.** Runtime API → every caller behind `<Suspense>`
- [x] `src/proxy.ts` — Next 16's replacement for `middleware.ts`, `matcher: ['/dashboard']`. Node
      runtime is the default in 16 and setting `runtime` in a proxy file is an error, so it is not
      set. The cookie check is optimistic only; `/dashboard` calls `requireUser()` for the real one
- [x] **Created `/dashboard`** — both auth actions redirected to a route that did not exist, so
      every successful login and registration landed on a 404
- [x] RHF wiring moved out of `AuthForm` into `features/auth/hooks/useAuthForm.ts`; `AuthForm` is now
      markup only. Pending state is RHF's `formState.isSubmitting`, as decided in the API map
- [x] Each action starts with `safeParse` against the same schema the form used (Server Functions are
      reachable by direct POST); `redirect()` stays outside every `try/catch`
- [x] **Both old implementations were already gone** — `src/actions/actions.ts` became
      `features/auth/actions.ts` in Phase 1 and `src/lib/auth.ts` was deleted there

### Landed alongside, and why

- [x] `AuthNavButton` un-inverted and given a real sign-out (`LogoutButton`, `logoutAction`) — listed
      under Phase 5, but Phase 2 is the first point where a session can exist, and shipping real
      sessions with no way to end them is not a state worth committing. It is also no longer a client
      component: signed out it is a `<Link>`, and only the sign-out control is an island
- [x] `src/app/auth/layout.tsx` had `const isAuthenticated = false` hardcoded, so its CTA always read
      "Crea un account". Now reads the real session
- [x] `CardForm` rewired onto `useAuthForm`, dropping its duplicate RHF wiring and its hand-rolled
      `isSubmitting` state. Phase 5 still folds it into `<AuthForm mode="login" />`
- [x] `prisma.config.ts` no longer hardcodes `file:./dev.db`; it reads `DATABASE_URL` first. That
      hardcoding silently overrode the environment for **every** CLI command, which would have
      pointed the integration suite's `db push` at `dev.db`
- [x] Better Auth requires a `name` on its `User`. The register form asks only for an email, so the
      local part seeds a display name rather than adding a field the design has no room for —
      **revisit if the dashboard ever shows a real profile**

### Tests written this phase

- [x] Unit — `useAuthForm` (malformed email, short password, mismatched confirmation, values handed
      to the Server Function, server error mapped onto the password field)
- [x] Unit — `AuthNavButton` in both states, locking in the un-inverted condition
- [x] Integration — sign-up stores the credential as a hash on `Account` and leaves `User` without a
      password column; duplicate email surfaces as an `APIError`, not a Prisma constraint error;
      wrong password rejected; a real sign-in cookie resolves to the user; **a forged cookie holding
      a raw user id resolves to `null`**, which is the hole this phase closes
- [x] `tests/setup/integration.setup.ts` now actually provisions the throwaway DB: absolute
      `file:` path under `prisma/test.db`, `prisma db push` in `beforeAll`, file (and `-wal`/`-shm`)
      removed after
- [x] `vitest.config.mts` aliases `server-only` to a stub — it throws by design in a client module
      graph, and Vitest is neither graph

## Phase 3 — Server-first CoinGecko data

### 3a. Server-only data layer

- [x] `features/crypto/lib/coingecko.ts` — `server-only`, `getMarkets()` and `getMarketChart()` with
      `'use cache'` + `cacheLife('minutes')`. Arguments key the entry automatically, so one
      `(limit, currency)` entry now serves every component that used to issue its own request
- [x] URL building and `parseCurrency` split into `lib/endpoints.ts` — plain functions, because a
      `'use cache'` module cannot run under Vitest. That is what makes the query strings testable
- [x] Env collapse: `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_API_URL_SECOND` → server-side
      `COINGECKO_API_URL`. Both removed from `.env`/`.env.example`; `env.d.ts` now declares the four
      server variables instead of the unused `NEXT_PUBLIC_API_KEY`
- [x] **`cacheComponents: true` enabled** — the Phase 0 deferral. The build is now a real gate

### 3b. Pages become server components

- [x] `/` and `/crypto` call `getMarkets()` and pass plain arrays down
- [x] `crypto/[id]/page.tsx` rewritten as `PageProps<'/crypto/[id]'>` with `await props.params`. It
      was `'use client'` *and* `async` *and* awaited `params`, then read `params.id` unawaited too
- [x] **Currency is a `?currency=` search param**, replacing the dead Zustand field. Verified in the
      browser: `?currency=eur` returns real EUR figures, `?currency=usd` returns dollar figures
- [x] `loading.tsx` for `/crypto`, `/crypto/[id]` and `/dashboard` — under `cacheComponents` these
      are the `<Suspense>` boundaries the runtime reads need, not decoration
- [x] The `searchParams` promise is passed *into* the boundary rather than awaited in the page body,
      so the static parts of each route still prerender
- [x] `auth/layout.tsx` keeps its session read in its own `<Suspense>`: a layout cannot rely on its
      own `loading.tsx`, which wraps the page beneath it

### 3c. Charts: atomic and presentational

- [x] `charts/chart-theme.ts` — axis/grid/tooltip props, colours and the card class, previously
      copy-pasted with small drifts across all five files
- [x] `SeriesAreaChart` / `SeriesBarChart` — one generic pair replacing five bespoke charts
- [x] Timestamp to `{x, y}` mapping moved out of three `useMemo`s into `lib/chart-data.ts`, with
      tests. It uses a **fixed** locale: `toLocaleDateString()` with no argument follows the
      runtime's locale, which is a hydration mismatch waiting to happen once charts render on the
      server
- [x] **SVG gradient id collision fixed** with `useId()`. Verified on `/crypto/bitcoin`: three
      charts, three unique gradient ids, three distinct fills
- [x] Charts lost their `isLoading` / `error` branches, and `CryptoListProps` is gone with them
- [x] Each chart container is `role="img"` with a meaningful `aria-label` *(Phase 6 item, landed
      here because the charts were being rewritten anyway)*

### 3d. Delete the client fetching stack

- [x] `src/features/crypto/hooks/` and `shared/providers/ReactQueryProvider.tsx` deleted
- [x] Dropped `@tanstack/react-query` and `usehooks-ts`
- [x] `SidebarWrapper` renders both variants and lets CSS choose (`hidden lg:flex` / `lg:hidden`).
      `useMediaQuery` resolved only after hydration, so neither appeared on first paint
- [ ] ~~Drop `zustand` in Phase 3~~ → **deferred to Phase 4.** `FavoriteButton` is still the only
      favourites implementation; removing the store now would leave it non-functional for a whole
      phase. The dead `currency` / `setCurrency` fields were removed, which is the part this phase
      actually replaces

### Verified in the browser, not just in the build

- [x] **Zero** `api.coingecko.com` requests from the browser on `/crypto` (was three per load)
- [x] Console clean on `/`, `/crypto`, `/crypto/[id]` and `/auth/login` — 0 errors, 0 warnings
- [x] Build output: **every route is now `Partial Prerender`**, against the Phase 0 baseline where
      every route was `Dynamic` and nothing was static. `/crypto` and `/crypto/[id]` report
      `Revalidate 1m / Expire 1h`, which is `cacheLife('minutes')`

### Four bugs the build did not catch, found by opening the app

The build passes them because each sits inside a `<Suspense>` boundary, so it is deferred to runtime
and never rendered during static generation. **A green build is not evidence these pages work.**

- [x] **Functions passed across the RSC boundary.** The charts took `formatY` / `formatValue`
      callbacks from Server Components — "Functions cannot be passed directly to Client Components".
      They now take `currency` and a `yFormat: 'compact' | 'price'` string and build the formatters
      client-side
- [x] **`buttonVariants` was exported from a `'use client'` module**, so calling it from a Server
      Component failed with "Attempted to call buttonVariants() from the server". Split into
      `shared/ui/button-variants.ts`; `button.tsx` re-exports it for client callers
- [x] **Hydration mismatch in `About`** — the server rendered the CTA anchor and the client dropped
      it, so the link was missing from the DOM after hydration. Fixed by the split above: a
      server-rendered `<Link>` with `buttonVariants()` classes needs no client component at all
- [x] **`motion()` is deprecated** — now `motion.create()`, and hoisted to module scope

### Landed alongside, and why

Enabling `cacheComponents` and rewriting these files forced several Phase 5/6 items early — leaving
them would have meant knowingly shipping a red build or re-breaking code being rewritten.

- [x] `app/layout.tsx` — the session read is now in `<Suspense>`, which is what lets any route
      prerender at all *(Phase 5)*
- [x] `Footer` — `new Date().getFullYear()` hoisted to module scope (an unstable render value blocks
      prerendering), and both `/homepage` links fixed to `/` and `/crypto` *(Phase 5)*
- [x] `TableCryptoData` — money columns formatted in the currency actually requested, instead of a
      hardcoded euro sign on USD data; the `next/image` aspect-ratio warning fixed by dropping the
      overriding `className` *(Phase 5)*
- [x] `About` / `ChartView` — `motion(Button)` in the component body removed entirely, and
      `router.push()` replaced with a real `<Link>` *(Phase 5 + Phase 6)*
- [x] `crypto/[id]` — redundant `role="region"` removed *(Phase 5)*
- [x] `/crypto` — added the `<h1>` the `aria-labelledby` was already pointing at, and hid the
      "Volume totale" `<th>` at the same breakpoint as its cells (6 headers vs 5 body cells on
      mobile) *(Phase 6)*
- [x] `global-error.tsx` `lang='it'` was **already fixed in the working tree** by someone else; it
      rides along in this commit *(Phase 6)*

### Gotchas worth remembering

- **`prisma migrate dev` strips `url = env("DATABASE_URL")` out of the schema** when
  `prisma.config.ts` also declares a datasource — and Prisma validates the schema *before* applying
  that override, so every CLI command then fails with P1012. Both are now present and a comment in
  the schema says not to remove it
- **`prisma db push` ignores the config's `datasource.url`** in 6.19, so the integration suite uses
  `migrate deploy`, which respects it — and which also asserts the migrations produce the current
  schema
- **The build can OOM on this machine** when the dev server, a browser and 11 build workers run at
  once. It is memory pressure, not a code fault: the build is green when run on its own

### Tests written this phase

- [x] Unit — `buildMarketsUrl` / `buildMarketChartUrl` / `parseCurrency`, including the regression
      where `currency` was in the query key but `vs_currency=usd` was hardcoded in the URL
- [x] Unit — chart adapters, including the fixed-locale label
- [x] Unit — `formatCurrency` / `formatCompactCurrency` / `formatPercent`, including the
      hardcoded-euro-on-USD regression
- [x] Integration setup fixed: `migrate deploy` instead of `db push`, `execSync` instead of
      `execFileSync` + `shell: true` (which emitted a DEP0190 warning on every run), Prisma
      disconnected before teardown, and teardown tolerant of Windows keeping the file open

## Phase 4 — Watchlist feature

- [ ] `features/watchlist/lib/queries.ts` (`server-only`) — `getWatchlist(userId)`, `React.cache`-wrapped. Do **not** put `use cache` on user data: it is request-scoped; `React.cache` + `<Suspense>` is the correct pairing under `cacheComponents`
- [ ] `features/watchlist/actions.ts` — `toggleFavorite(coinId)`: auth check, delete-or-create against the existing `@@unique([userId, coinId])`, then `updateTag` on a per-user tag for read-your-writes
- [ ] Note: `revalidateTag` now **requires** a second `cacheLife` argument in 16 — the one-arg form is a TypeScript error
- [ ] `FavoriteButton` client island — props `{ coinId, isFavorite }`, `useOptimistic` + `useTransition`. Logged out → parent renders a `Link` to `/auth/login`
- [ ] Delete `favouriteStore.ts` and `storeTypes.ts`
- [ ] No migration needed: `Watchlist` and its unique constraint already exist

---

## Phase 5 — Bug sweep and dead code

- [x] `AuthNavButton` — inverted: an authenticated user is shown "Accedi" → `/auth/login`. Becomes a logout control *(done in Phase 2: real sessions needed a way to end them)*
- [x] `getMarkets` — `currency` was in the query key but the URL hardcoded `vs_currency=usd`, so "eur" returned USD cached under a eur key *(done in Phase 3)*
- [x] `TableCryptoData` — prints `€` on all four money columns while the API returns USD *(done in Phase 3)*
- [ ] `MobileMenu` — "Le nostre Crypto" links to `/projects`, which does not exist. Should be `/crypto`
- [x] `Footer.tsx:20,23` — **both** nav links point to `/homepage`, which does not exist either. Should be `/` and `/crypto` (found by running the app) *(done in Phase 3)*
- [x] `TableCryptoData` — `next/image` gets `width`/`height` 24 but `className="w-6 h-6"` overrides them, so every page load logs 10 aspect-ratio warnings. Dropped the className *(done in Phase 3)*
- [x] `About.tsx` / `ChartView.tsx` — `const MotionButton = motion(Button)` inside the component body creates a new component type every render, remounting the button. Removed entirely; `MotionButton.tsx` hoisted to module scope and moved to `motion.create()` *(done in Phase 3)*
- [x] `src/app/layout.tsx` — `Navbar` reads the session in the root layout, so under `cacheComponents` no route can prerender. Static links stay outside; the auth-dependent slice goes in `<Suspense>` *(done in Phase 3)*
- [ ] Dead code — `CryptoView.tsx` is imported by nothing; `CardForm.tsx` is a second login-only copy of `AuthForm.tsx` reachable via `CallToAction`, fold into `<AuthForm mode="login" />`
- [x] Duplicate email — Better Auth handles this now; surfaced in the form via `toFormError` *(done in Phase 2)*
- [x] `Footer.tsx:40` — `new Date().getFullYear()` during render is an unstable value that **blocks prerendering** under `cacheComponents` (found by the Phase 0 trial build). Hoist to module scope *(done in Phase 3)*
- [x] `global-error.tsx:13` — its `<html>` element has no `lang` prop at all (found by the new jsx-a11y rule) *(already fixed in the working tree; rides along with Phase 3)*
- [x] `crypto/[id]/page.tsx:21` — redundant `role="region"` on a `<section>` that already has that implicit role *(done in Phase 3)*
- [ ] Drop `pg` — a dependency, but the datasource is SQLite and nothing imports it

---

## Phase 6 — SEO, metadata and accessibility

The app currently has **one** metadata export in the entire codebase (the root layout) — no
per-route titles, no `generateMetadata`, no sitemap, robots or OG image.

### Metadata

- [ ] Root layout: `metadataBase`, `openGraph`, `twitter`, `title.template` (`'%s | NexCoin'`)
- [ ] Static `metadata` on `/crypto`, `/auth/*`, `/dashboard`
- [ ] `generateMetadata` on `/crypto/[id]` — reuse the same cached data call the page uses, so it is fetched once and shared
- [ ] `app/sitemap.ts` and `app/robots.ts` — sitemap enumerates top coins from cached `getMarkets()`
- [ ] `app/opengraph-image.tsx` via `ImageResponse` from `next/og`; per-coin OG images under `crypto/[id]/` if worthwhile
- [ ] **Next 16 breaking change:** in `opengraph-image`, `twitter-image`, `icon` and `apple-icon`, `params` and `id` are now **Promises** and must be awaited (same for `id` in `sitemap` with `generateSitemaps`). A copied Next 15 snippet silently renders `[object Promise]`
- [ ] `dashboard` and `auth` routes get `robots: { index: false }`

### Accessibility fixes (all verified in the current code)

- [ ] `src/app/layout.tsx:30` — `<html lang="en">` while **every string in the UI is Italian**. Screen readers pick pronunciation from this. Should be `lang="it"`
- [x] `src/app/crypto/page.tsx:7` — `aria-labelledby="main-title"` points at an id **nothing in that subtree renders**; the region has no accessible name *(done in Phase 3)*
- [x] `TableCryptoData` — the `columns` array renders **6** `<th>` cells but the "Volume totale" `<td>` is `hidden md:table-cell`, so on mobile every body row has **5** cells against 6 headers. Hide the matching `<th>` at the same breakpoint *(done in Phase 3)*
- [~] `TableCryptoData` — the only heading is an `<h3>` outside the table, so `/crypto` has **no `<h1>`** and heading order starts at 3. `<h1>` added and the `<h3>` promoted to `<h2>` in Phase 3; **`<caption>` still to do**
- [x] `About.tsx` / `ChartView.tsx` — navigation as `<Button onClick={() => router.push('/crypto')}>`. A button is not a link: no middle-click, no open-in-new-tab, announced as "button". Both are now `<Link>` styled with `buttonVariants()` and are server components *(done in Phase 3)*
- [ ] `error.tsx` / `crypto/error.tsx` — `text-slate-200` and `text-red-400` on `bg-red-200` both fail WCAG AA contrast; error text should be in an `aria-live`/`role="alert"` region
- [x] Charts — Recharts output is inert to assistive tech. Each container is now `role="img"` with a meaningful `aria-label` *(done in Phase 3)*; **pairing the `/crypto` charts with the table as a text alternative is still to do**

---

## Phase 7 — Write the tests

Written per-phase, consolidated here.

- [ ] **Unit (`jsdom`)** — `shared/utils` formatters (`cn`, currency, percentage); chart data adapters from 3c; `features/crypto/lib` URL building and the currency param; `useAuthForm` validation via `renderHook`; client components (`FavoriteButton` optimistic flip, `AuthForm` error rendering, `AuthNavButton` both states) with `user-event`
- [ ] **Integration (`node`)** — server actions against a throwaway SQLite DB: register → login → session; duplicate email rejected; `toggleFavorite` creates then deletes a row and respects the unique constraint; `toggleFavorite` errors when unauthenticated
- [ ] **E2E (Playwright)** — `/` and `/crypto` render server-side with **zero** browser requests to `api.coingecko.com`; `/crypto/[id]` shows three charts with distinct gradient fills; register → lands on `/dashboard`, not a 404; star a coin → reload → still starred; logged out, `/dashboard` redirects via `proxy.ts`; logged out on `/crypto` shows a sign-in link
- [ ] **Accessibility (axe)** — automated scan per route asserting no serious/critical violations. Locks in Phase 6: axe catches the dangling `aria-labelledby`, the contrast failures and the table header mismatch directly

---

## Phase 8 — Documentation

- [ ] Rewrite `CLAUDE.md` — it currently describes Next 15, the React Query provider, the Zustand store, the `components/layout` vs `shared` split and the hand-rolled cookie auth, all of which this work removes
- [ ] New `CLAUDE.md` content: the `core`/`features`/`shared` layout and its dependency rule, separation-of-concerns and client/server-boundary conventions, Better Auth as the single auth path, the server-only data layer, the test commands, the Vitest/async-Server-Component limitation
- [ ] Record the Server Function vs Server Action terminology and the deliberate `useFormStatus`/RHF decision, so a future session doesn't "fix" it by mixing paradigms
- [ ] Update `README.md`'s now-wrong "Project Structure" and "Server-Side Architecture" sections
- [ ] Decide whether `ROADMAP.md` stays as a record or is removed once everything is checked

---

## Verification

Run per phase, not only at the end.

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build` — with `cacheComponents: true` this is the real gate: it **fails** on uncached data or runtime APIs outside `<Suspense>`. Expect to iterate
- [ ] `npm run test` (unit + integration), `npm run test:e2e`, `npm run test:a11y`
- [ ] Manual spot-check in `npm run dev`: DevTools → Network shows no `api.coingecko.com` requests from the browser (previously three per load) and no CoinGecko URL in the JS bundle; `npx prisma studio` confirms `Watchlist` rows appear
- [ ] SEO spot-check: view-source on `/crypto/[id]` shows a per-coin `<title>` and OG tags (not the root layout's); `/sitemap.xml` and `/robots.txt` respond; `/dashboard` carries `noindex`

---

## Git workflow

- [x] `git checkout -b refactor/feature-architecture`
- [ ] Commit per phase, ticking this file's boxes with that phase's work
- [ ] `git push -u origin refactor/feature-architecture`
- [ ] `gh pr create --base main`
- [ ] Once typecheck, lint, unit, integration, E2E and a11y all pass: `gh pr merge --squash --delete-branch`
- [ ] `git checkout main && git pull && git branch -d refactor/feature-architecture` — leaving only `main`

Remote is `EliaGiolli/dashboard-crypto-next`; `gh` 2.69.0 authenticated as **EliaGiolli**.

---

## Open items

- [x] ~~`.env` does not exist~~ — generated in Phase 0 with a locally created 32-byte secret,
      alongside a committed `.env.example`
- [ ] **`npm audit`: 6 high / 1 critical**, all transitive under Prisma (`effect`, `deepmerge-ts`)
      plus `lodash` and `defu`. `npm audit fix --force` would *downgrade* Prisma to 6.12.0, so it was
      left alone. Worth a look once Phase 2's Prisma work is done
- [ ] **`NOTES/` deletion still uncommitted.** Left as intended (only `CLAUDE.md` was restored).
      The RHF note's "always validate on server" rule gets folded into `CLAUDE.md` in Phase 8;
      Phase 2 implements it regardless
