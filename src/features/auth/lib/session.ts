import 'server-only'

import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/core/lib/auth'

/**
 * The single place session handling lives.
 *
 * `headers()` is a runtime API, so anything that calls these functions is
 * dynamic and — once `cacheComponents` is on in Phase 3 — must sit inside a
 * <Suspense> boundary.
 *
 * `React.cache` memoises per request, not across requests: several components
 * on one page can each ask for the user and the session is resolved once.
 * Never put `use cache` on this — it is request-scoped, per-user data.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

/** The signed-in user, or `null`. Never throws. */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * The signed-in user, or a redirect to the login page.
 *
 * Use this in every protected page and Server Function. `src/proxy.ts` only
 * looks for the presence of a cookie, which Next's docs are explicit is an
 * optimistic check and not a security boundary — this is the real one.
 */
export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}
