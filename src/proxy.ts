import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * Next 16's replacement for `middleware.ts`. Runs on the Node runtime (the
 * default since 16 — setting `runtime` in a proxy file is an error).
 *
 * This is an OPTIMISTIC check and nothing more: it only asks whether a session
 * cookie is present, it does not verify it. Next's own docs are explicit that
 * cookie checks here are not a security boundary, so every protected page also
 * calls `requireUser()` server-side. What this buys is skipping the render of
 * a page that would only have redirected anyway.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard'],
}
