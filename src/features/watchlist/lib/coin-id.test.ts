import { describe, expect, it } from 'vitest'

import { coinIdSchema } from './coin-id'
import { watchlistTag } from './tags'

describe('coinIdSchema', () => {
  it.each(['bitcoin', 'wrapped-bitcoin', 'usd-coin', '0x'])('accepts %s', (id) => {
    expect(coinIdSchema.safeParse(id).success).toBe(true)
  })

  it.each([
    ['an empty string', ''],
    ['uppercase', 'Bitcoin'],
    ['a path', '../bitcoin'],
    ['whitespace inside', 'bit coin'],
    ['a non-string', 42],
    ['an overlong id', 'a'.repeat(101)],
  ])('rejects %s', (_, id) => {
    expect(coinIdSchema.safeParse(id).success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    expect(coinIdSchema.parse('  bitcoin ')).toBe('bitcoin')
  })
})

describe('watchlistTag', () => {
  it('is per user, so one toggle never expires somebody else’s list', () => {
    expect(watchlistTag('user-a')).toBe('watchlist:user-a')
    expect(watchlistTag('user-a')).not.toBe(watchlistTag('user-b'))
  })
})
