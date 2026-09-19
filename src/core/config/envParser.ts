import 'server-only'

import { envSchema, type Env } from '@/core/schema/parserSchema'

/**
 * Parses and validates process.env once, at module load.
 *
 * Failing here is deliberate: a missing or malformed variable should stop the
 * process with a readable list of problems rather than surface later as an
 * `undefined` in a fetch URL or a silently unsigned session.
 */
function parseEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')

    throw new Error(
      `Invalid environment variables:\n${issues}\n\n` +
        'Copy .env.example to .env and fill in the missing values.'
    )
  }

  return result.data
}

export const env: Env = parseEnv()
