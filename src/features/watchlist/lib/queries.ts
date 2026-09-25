import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { prisma } from '@/core/lib/prisma'
import { getCurrentUser } from '@/features/auth'

import { watchlistTag } from './tags'

/**
 * The signed-in user's favorite coin ids, or `null` when nobody is signed in.
 *
 * `null` and `[]` mean different things to the UI: `null` renders a sign-in
 * link in place of the star, `[]` renders unstarred buttons.
 *
 * The session is read here, outside the cache, so a caller can never ask for
 * somebody else's list — there is no user id parameter to forge. Reading the
 * session makes this a runtime read: every caller sits behind <Suspense>.
 */
export async function getWatchlist(): Promise<string[] | null> {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return getWatchlistByUserId(user.id)
}

/**
 * Deliberately NOT exported — see `getWatchlist`.
 *
 * `'use cache'` keyed by the user id (arguments are part of the cache key) and
 * tagged per user: the pattern Next's "Authentication with Cache Components"
 * guide gives for session-derived data. `toggleFavorite` calls `updateTag`
 * on the same tag, so a change shows on the very next render instead of once
 * `cacheLife` runs out. A `React.cache` read would have nothing for
 * `updateTag` to expire.
 */
async function getWatchlistByUserId(userId: string): Promise<string[]> {
  'use cache'
  cacheTag(watchlistTag(userId))
  cacheLife('minutes')

  const rows = await prisma.watchlist.findMany({
    where: { userId },
    select: { coinId: true },
    orderBy: { coinId: 'asc' },
  })

  return rows.map((row) => row.coinId)
}
