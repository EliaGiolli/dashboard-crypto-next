import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/core/lib/auth'

// Better Auth's own endpoints (sign-in, sign-up, sign-out, session, callbacks).
// The app's own auth UI goes through Server Functions; this route exists so the
// library's client and its email/OAuth callbacks have somewhere to land.
export const { GET, POST } = toNextJsHandler(auth)
