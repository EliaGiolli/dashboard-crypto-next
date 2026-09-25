/**
 * The per-user cache tag shared by the cached read (`queries.ts`) and the
 * Server Function that invalidates it (`actions.ts`).
 *
 * A plain module rather than a constant in either file: `queries.ts` is a
 * `'use cache'` + `server-only` module and `actions.ts` is `'use server'`, and
 * this keeps the one string they must agree on testable on its own.
 *
 * Tags are stored in plain text, so this keys on the opaque user id — never
 * on an email or anything else personal.
 */
export function watchlistTag(userId: string): string {
  return `watchlist:${userId}`
}
