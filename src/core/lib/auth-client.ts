import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth's browser client.
 *
 * No `baseURL` is passed on purpose: the client defaults to the current
 * origin, and the auth routes are served from this same app at
 * `/api/auth/[...all]`. Passing one would mean exposing a NEXT_PUBLIC_ var
 * for a value the browser already knows.
 *
 * Most of the app does not need this — sign-in, sign-up and sign-out all go
 * through Server Functions in `features/auth/actions.ts`, which re-validate
 * their input. Reach for the client only where a component genuinely needs
 * reactive session state in the browser.
 */
export const authClient = createAuthClient()

export const { useSession, signOut } = authClient
