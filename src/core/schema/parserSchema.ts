import { z } from 'zod'

/**
 * Shape of every environment variable the app requires.
 *
 * Nothing here is NEXT_PUBLIC_: all of it is server-side only, which is why
 * `envParser.ts` is marked `server-only`. If a value ever genuinely needs to
 * reach the browser, give it a NEXT_PUBLIC_ prefix and a separate schema —
 * do not loosen this one.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  /** Prisma connection string, e.g. file:./dev.db */
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  /** CoinGecko REST base URL, without a trailing slash. */
  COINGECKO_API_URL: z
    .url('COINGECKO_API_URL must be a valid URL')
    .refine((v) => !v.endsWith('/'), {
      message: 'COINGECKO_API_URL must not end with a trailing slash',
    }),

  /** Better Auth signing secret. The library requires >= 32 characters. */
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

  /** Base URL Better Auth issues callbacks against. */
  BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),
})

export type Env = z.infer<typeof envSchema>
