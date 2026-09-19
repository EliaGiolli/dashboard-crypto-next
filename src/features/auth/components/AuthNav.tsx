import { getCurrentUser } from '../lib/session'
import { AuthNavButton } from './AuthNavButton'

/**
 * Server component that resolves the session and renders the nav's auth
 * control.
 *
 * It exists so `shared/layouts/Navbar` can stay presentational: reading the
 * session is an auth concern, and shared/ must not import from features/.
 *
 * Phase 5 wraps this in <Suspense> so the rest of the navbar can prerender —
 * `getCurrentUser()` reads headers, which makes every route dynamic today.
 */
export async function AuthNav() {
  const user = await getCurrentUser()

  return <AuthNavButton isAuthenticated={!!user} />
}
