import { describe, expect, it } from 'vitest'
import { envSchema } from '@/core/schema/parserSchema'

const valid = {
  NODE_ENV: 'development',
  DATABASE_URL: 'file:./dev.db',
  COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
}

describe('envSchema', () => {
  it('accepts a complete, well-formed environment', () => {
    const result = envSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('defaults NODE_ENV to development when absent', () => {
    const { NODE_ENV: _omitted, ...withoutNodeEnv } = valid
    const result = envSchema.parse(withoutNodeEnv)
    expect(result.NODE_ENV).toBe('development')
  })

  it('rejects a CoinGecko URL with a trailing slash', () => {
    const result = envSchema.safeParse({
      ...valid,
      COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a Better Auth secret shorter than 32 characters', () => {
    const result = envSchema.safeParse({
      ...valid,
      BETTER_AUTH_SECRET: 'too-short',
    })
    expect(result.success).toBe(false)
  })

  it('reports every problem at once rather than stopping at the first', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: '',
      COINGECKO_API_URL: 'not-a-url',
      BETTER_AUTH_SECRET: 'short',
      BETTER_AUTH_URL: 'also-not-a-url',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(4)
    }
  })
})
