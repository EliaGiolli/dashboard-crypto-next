import Link from 'next/link'

import { requireUser } from '@/features/auth'
import { FavoriteButton, getWatchlist } from '@/features/watchlist'
import { buttonVariants } from '@/shared/ui/button-variants'

/**
 * The route both auth Server Functions redirect to. It did not exist before
 * Phase 2, so every successful login and registration landed on a 404.
 *
 * `requireUser()` is the real access check; `src/proxy.ts` only does the
 * optimistic cookie test in front of it. `getWatchlist()` resolves the same
 * session again, but `getSession` is `React.cache`-memoised, so it is read
 * once per request.
 */
export default async function DashboardPage() {
  const user = await requireUser()
  const watchlist = (await getWatchlist()) ?? []

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-violet-400">
          La tua dashboard
        </h1>
        <p className="text-slate-300">
          Bentornato, <span className="font-semibold">{user.name}</span>.
        </p>

        <section aria-labelledby="watchlist-title" className="flex flex-col gap-4">
          <h2 id="watchlist-title" className="text-2xl font-semibold text-violet-300">
            Le tue crypto preferite
          </h2>

          {watchlist.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-slate-300">
                Non hai ancora salvato nessuna criptovaluta.
              </p>
              <Link href="/crypto" className={buttonVariants()}>
                Esplora le criptovalute
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-slate-700 rounded-xl border border-slate-700">
              {watchlist.map((coinId) => (
                <li
                  key={coinId}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <Link
                    href={`/crypto/${coinId}`}
                    className="capitalize font-medium text-slate-100 underline-offset-4 hover:underline"
                  >
                    {coinId}
                  </Link>
                  {/* The watchlist stores only the CoinGecko slug, which is
                      also what the coin page shows as its title. Unstarring
                      here drops the row: updateTag re-renders this list. */}
                  <FavoriteButton coinId={coinId} coinName={coinId} isFavorite />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
