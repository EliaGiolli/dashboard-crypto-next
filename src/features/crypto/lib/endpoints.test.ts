import { describe, expect, it } from 'vitest'

import { buildMarketChartUrl, buildMarketsUrl, parseCurrency } from './endpoints'

const BASE = 'https://api.coingecko.com/api/v3'

describe('parseCurrency', () => {
  it.each(['usd', 'eur'])('accepts the supported currency %s', (value) => {
    expect(parseCurrency(value)).toBe(value)
  })

  it('falls back to usd for an unsupported value', () => {
    // A search param is user input — it arrives from a hand-edited URL just
    // as readily as from the UI.
    expect(parseCurrency('gbp')).toBe('usd')
    expect(parseCurrency('')).toBe('usd')
    expect(parseCurrency(undefined)).toBe('usd')
  })

  it('takes the first value when the param is repeated', () => {
    expect(parseCurrency(['eur', 'usd'])).toBe('eur')
  })
})

describe('buildMarketsUrl', () => {
  // The regression this locks in: the client hook took a `currency` argument,
  // put it in the React Query key, and then hardcoded `vs_currency=usd` in
  // the URL — so asking for eur returned USD prices cached under a eur key.
  it('puts the requested currency in vs_currency', () => {
    expect(buildMarketsUrl(BASE, 10, 'eur')).toContain('vs_currency=eur')
    expect(buildMarketsUrl(BASE, 10, 'usd')).toContain('vs_currency=usd')
  })

  it('builds the full markets query', () => {
    expect(buildMarketsUrl(BASE, 25, 'usd')).toBe(
      `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1`
    )
  })

  it('defaults to 10 coins in usd', () => {
    expect(buildMarketsUrl(BASE)).toContain('per_page=10')
    expect(buildMarketsUrl(BASE)).toContain('vs_currency=usd')
  })
})

describe('buildMarketChartUrl', () => {
  it('builds the full chart query', () => {
    expect(buildMarketChartUrl(BASE, 'bitcoin', 7, 'eur')).toBe(
      `${BASE}/coins/bitcoin/market_chart?vs_currency=eur&days=7`
    )
  })

  it('encodes a coin id that is not URL-safe', () => {
    expect(buildMarketChartUrl(BASE, 'foo/bar?x=1')).toContain(
      '/coins/foo%2Fbar%3Fx%3D1/market_chart'
    )
  })
})
