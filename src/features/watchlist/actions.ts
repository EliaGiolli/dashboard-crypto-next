'use server'

import { updateTag } from 'next/cache'

import { prisma } from '@/core/lib/prisma'
import { getCurrentUser } from '@/features/auth'

import { coinIdSchema } from './lib/coin-id'
import { watchlistTag } from './lib/tags'
import type { ToggleFavoriteResult } from './types'

/**
 * Adds the coin to the signed-in user's watchlist, or removes it if it is
 * already there.
 *
 * Like every Server Function it is reachable by a direct POST, so it checks
 * the session and re-validates its argument itself rather than trusting the
 * button that called it.
 *
 * It returns a result rather than redirecting: `FavoriteButton` calls it
 * inside a transition with an optimistic value, and a returned error is what
 * lets that value revert with a message instead of silently.
 */
export async function toggleFavorite(
  coinId: unknown
): Promise<ToggleFavoriteResult> {
  const parsed = coinIdSchema.safeParse(coinId)

  if (!parsed.success) {
    return { ok: false, error: 'Criptovaluta non valida.' }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { ok: false, error: 'Accedi per salvare i preferiti.' }
  }

  const key = { userId: user.id, coinId: parsed.data }
  let isFavorite: boolean

  try {
    // Delete first and look at the count, rather than find-then-delete: one
    // round trip, and no window for a concurrent request between the read
    // and the write.
    const { count } = await prisma.watchlist.deleteMany({ where: key })

    if (count === 0) {
      // `upsert` rather than `create`: a double-click that races two requests
      // past the delete must not surface the @@unique([userId, coinId])
      // constraint as an error.
      await prisma.watchlist.upsert({
        where: { userId_coinId: key },
        create: key,
        update: {},
      })
    }

    isFavorite = count === 0
  } catch {
    return { ok: false, error: 'Impossibile aggiornare i preferiti. Riprova.' }
  }

  // Read-your-writes: expires the user's cached list and re-renders the
  // current page in this same response, so the star arrives from the server
  // already in its new state.
  updateTag(watchlistTag(user.id))

  return { ok: true, isFavorite }
}
