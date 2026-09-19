import { cookies } from 'next/headers'

import { AuthNavButton } from './AuthNavButton'

/**
 * Server component that resolves the session and renders the nav's auth
 * control.
 *
 * It exists so `shared/layouts/Navbar` can stay presentational: reading the
 * session is an auth concern, and shared/ must not import from features/.
 *
 * Phase 2 swaps the raw cookie read for Better Auth's `getCurrentUser()`.
 * Phase 5 wraps this in <Suspense> so the rest of the navbar can prerender.
 */
export async function AuthNav() {
  const cookieStore = await cookies()
  const isAuthenticated = !!cookieStore.get('session')

  return <AuthNavButton isAuthenticated={isAuthenticated} />
}
