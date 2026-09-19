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

Replaces the hand-rolled auth **and closes the security hole**: the current `session` cookie is a raw
unsigned user id, so anyone can set `session=<any user id>` by hand and be that user.

- [ ] `npm i better-auth`; remove `bcrypt` and `@types/bcrypt`
- [ ] Env: `BETTER_AUTH_SECRET` (≥32 chars, `openssl rand -base64 32`) and `BETTER_AUTH_URL=http://localhost:3000`
- [ ] `core/lib/auth.ts` — `betterAuth({ database: prismaAdapter(prisma, { provider: 'sqlite' }), emailAndPassword: { enabled: true }, plugins: [nextCookies()] })` (check plugin-ordering note in the docs)
- [ ] `core/lib/auth-client.ts` — `createAuthClient()` from `better-auth/react`
- [ ] `src/app/api/auth/[...all]/route.ts` — `export const { GET, POST } = toNextJsHandler(auth)`
- [ ] Schema: `npx auth@latest generate` writes `User`, `Session`, `Account`, `Verification`. Credentials move from `User.password` into an `Account` row, so `User.password` goes away. Keep the `Watchlist` relation
- [ ] `npx prisma migrate reset` (**deletes existing dev.db users, as agreed**) + `npx prisma migrate dev --name better-auth`
- [ ] `features/auth/lib/session.ts` — `getCurrentUser()` wrapping `auth.api.getSession({ headers: await headers() })`, memoised with `React.cache`. **Single place session handling lives.** Runtime API → every caller behind `<Suspense>`
- [ ] `src/proxy.ts` — Next 16's replacement for `middleware.ts`, Node runtime, `matcher: ['/dashboard']`. Cookie-only checks are documented as *not secure*, so protected pages validate server-side too
- [ ] **Create `/dashboard`** — both auth actions `redirect('/dashboard')` against a route that does not exist, so **every successful login and registration lands on a 404 today**
- [ ] Move RHF wiring out of `AuthForm` into `features/auth/hooks/useAuthForm.ts`, leaving `AuthForm` presentational
- [ ] Each action starts with an auth check + `safeParse`; keep `redirect()` outside any `try/catch` (it works by throwing)
- [ ] **Delete both old implementations:** `src/actions/actions.ts` and `src/lib/auth.ts` (the latter is a complete parallel implementation that **nothing imports**)

---

## Phase 3 — Server-first CoinGecko data

### 3a. Server-only data layer

- [ ] `features/crypto/lib/coingecko.ts` with `import 'server-only'`, `getMarkets()` and `getMarketChart()` using `'use cache'` + `cacheLife('minutes')` — the server-side replacement for `refetchInterval: 30_000`. Arguments become the cache key automatically, so one entry per `(limit, currency)` replaces the per-component client requests
- [ ] Env collapse: `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_API_URL_SECOND` → server-side `COINGECKO_API_URL`. The endpoint leaves the client bundle; an API key can be added later without leaking it
- [x] `core/config/envParser.ts` + `core/schema/parserSchema.ts` validating env with Zod at startup *(done in Phase 0)*; still to do: update `env.d.ts` (currently declares an unused `NEXT_PUBLIC_API_KEY` and omits the `_SECOND` var actually used)

### 3b. Pages become server components

- [ ] `/` and `/crypto` call `getMarkets()` and pass plain arrays down
- [ ] Rewrite `crypto/[id]/page.tsx` — currently `'use client'` **and** `async` **and** awaits `params`, which is invalid and fatal under Next 16's enforced async request APIs. Type it `PageProps<'/crypto/[id]'>` with `const { id } = await props.params`
- [ ] **Currency becomes a `?currency=` search param**, replacing the dead Zustand field. The server needs it to key the cache anyway, and the selection becomes shareable
- [ ] Add the `loading.tsx` files that don't exist today; reuse `SkeletonComponent`
- [ ] Wrap per-section server fetches in `<Suspense>`

### 3c. Charts: atomic and presentational

- [ ] `features/crypto/components/charts/chart-theme.ts` — shared axis/grid/tooltip props, colors, and the `$`/`M` formatters currently redefined in all five files
- [ ] `SeriesAreaChart` / `SeriesBarChart` — generic, `{ data, xKey, yKey, color, formatY }`
- [ ] Move timestamp→`{date, value}` mapping out of `useMemo` in each component into a tested adapter in `features/crypto/lib/`
- [ ] **Fix SVG gradient id collision** — `MarketCap` and `MarketCapSingleCrypto` both define `id="marketCapGradient"`, and the two volume charts both use `id="volumeGradient"`. SVG ids are document-global, so on `/crypto/[id]` the second chart silently renders the first one's fill. Generate with `useId()`
- [ ] Charts lose their `isLoading`/`error` branches (streaming and `error.tsx` cover those)

### 3d. Delete the client fetching stack

- [ ] Remove `src/custom hooks/` and `ReactQueryProvider.tsx` — the latter builds `new QueryClient()` at module scope (shared across requests on the server) and is mounted **twice** (in `crypto/layout.tsx` and inside `ChartView.tsx`), creating two independent caches
- [ ] Drop `@tanstack/react-query` and `zustand`
- [ ] Replace `SidebarWrapper`'s `useMediaQuery` with CSS (`hidden lg:block` / `lg:hidden`) — the JS media query renders **nothing** on first paint until it resolves client-side. Drop `usehooks-ts`

---

## Phase 4 — Watchlist feature

- [ ] `features/watchlist/lib/queries.ts` (`server-only`) — `getWatchlist(userId)`, `React.cache`-wrapped. Do **not** put `use cache` on user data: it is request-scoped; `React.cache` + `<Suspense>` is the correct pairing under `cacheComponents`
- [ ] `features/watchlist/actions.ts` — `toggleFavorite(coinId)`: auth check, delete-or-create against the existing `@@unique([userId, coinId])`, then `updateTag` on a per-user tag for read-your-writes
- [ ] Note: `revalidateTag` now **requires** a second `cacheLife` argument in 16 — the one-arg form is a TypeScript error
- [ ] `FavoriteButton` client island — props `{ coinId, isFavorite }`, `useOptimistic` + `useTransition`. Logged out → parent renders a `Link` to `/auth/login`
- [ ] Delete `favouriteStore.ts` and `storeTypes.ts`
- [ ] No migration needed: `Watchlist` and its unique constraint already exist

---

## Phase 5 — Bug sweep and dead code

- [ ] `AuthNavButton` — inverted: an authenticated user is shown "Accedi" → `/auth/login`. Becomes a logout control
- [ ] `getMarkets` — `currency` was in the query key but the URL hardcoded `vs_currency=usd`, so "eur" returned USD cached under a eur key (fixed in 3a)
- [ ] `TableCryptoData` — prints `€` on all four money columns while the API returns USD
- [ ] `MobileMenu` — "Le nostre Crypto" links to `/projects`, which does not exist. Should be `/crypto`
- [ ] `About.tsx` / `ChartView.tsx` — `const MotionButton = motion(Button)` inside the component body creates a new component type every render, remounting the button. Hoist to module scope or use the existing `MotionButton.tsx`
- [ ] `src/app/layout.tsx` — `Navbar` reads the session in the root layout, so under `cacheComponents` no route can prerender. Static links stay outside; the auth-dependent slice goes in `<Suspense>`
- [ ] Dead code — `CryptoView.tsx` is imported by nothing; `CardForm.tsx` is a second login-only copy of `AuthForm.tsx` reachable via `CallToAction`, fold into `<AuthForm mode="login" />`
- [ ] Duplicate email — Better Auth handles this now; surface its error in the form
- [ ] `Footer.tsx:40` — `new Date().getFullYear()` during render is an unstable value that **blocks prerendering** under `cacheComponents` (found by the Phase 0 trial build). Hoist to module scope
- [ ] `global-error.tsx:13` — its `<html>` element has no `lang` prop at all (found by the new jsx-a11y rule)
- [ ] `crypto/[id]/page.tsx:21` — redundant `role="region"` on a `<section>` that already has that implicit role
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
- [ ] `src/app/crypto/page.tsx:7` — `aria-labelledby="main-title"` points at an id **nothing in that subtree renders**; the region has no accessible name
- [ ] `TableCryptoData` — the `columns` array renders **6** `<th>` cells but the "Volume totale" `<td>` is `hidden md:table-cell`, so on mobile every body row has **5** cells against 6 headers. Hide the matching `<th>` at the same breakpoint
- [ ] `TableCryptoData` — the only heading is an `<h3>` outside the table, so `/crypto` has **no `<h1>`** and heading order starts at 3. Add an `<h1>` (also fixes the `aria-labelledby` above) and use `<caption>`
- [ ] `About.tsx` / `ChartView.tsx` — navigation as `<Button onClick={() => router.push('/crypto')}>`. A button is not a link: no middle-click, no open-in-new-tab, announced as "button". Use `<Link>` styled as a button, which also drops `useRouter` and lets both become server components
- [ ] `error.tsx` / `crypto/error.tsx` — `text-slate-200` and `text-red-400` on `bg-red-200` both fail WCAG AA contrast; error text should be in an `aria-live`/`role="alert"` region
- [ ] Charts — Recharts output is inert to assistive tech. Give each container `role="img"` with a meaningful `aria-label`; pair the `/crypto` charts with the data table as text alternative

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
