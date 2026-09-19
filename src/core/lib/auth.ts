import 'server-only'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'

import { env } from '@/core/config/envParser'
import { prisma } from '@/core/lib/prisma'

/**
 * The single Better Auth server instance.
 *
 * It replaces the hand-rolled cookie auth, whose `session` cookie held a raw,
 * unsigned `user.id` — anyone could set `session=<any id>` and become that
 * user. Better Auth issues a signed, opaque token backed by a `Session` row.
 *
 * Server-only: it holds the signing secret and talks to Prisma. Client code
 * goes through `core/lib/auth-client.ts` or a Server Function instead.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'sqlite' }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    // Better Auth defaults to 8. Pinned to 6 so the server agrees with
    // `registerSchema`/`loginSchema`, which validate the same bound in the
    // browser — otherwise a 6-character password passes client validation and
    // is then rejected by a round-trip with a less helpful message.
    minPasswordLength: 6,
  },

  // `nextCookies` must stay LAST in this array. It is an after-hook that
  // flushes the response's Set-Cookie headers into next/headers' cookie store
  // (which is what makes sign-in work from a Server Function), so every plugin
  // that sets a cookie has to have run before it.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
