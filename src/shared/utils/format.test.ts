import { describe, expect, it } from 'vitest'

import { formatCompactCurrency, formatCurrency, formatPercent } from './format'

describe('formatCurrency', () => {
  // The regression this locks in: the table printed a hardcoded "€" on all
  // four money columns while the API was returning USD.
  it('uses the symbol of the currency it is given', () => {
    expect(formatCurrency(1234.5, 'usd')).toContain('$')
    expect(formatCurrency(1234.5, 'usd')).not.toContain('€')
    expect(formatCurrency(1234.5, 'eur')).toContain('€')
  })

  it('keeps more decimals for sub-unit prices', () => {
    // A coin worth fractions of a cent is otherwise rendered as "$0.00".
    expect(formatCurrency(0.000123, 'usd')).not.toMatch(/^\$?0[.,]00$/)
    expect(formatCurrency(0.000123, 'usd')).toContain('0')
  })

  it('rounds normal prices to two decimals', () => {
    expect(formatCurrency(1234.567, 'usd')).toBe('$1,234.57')
  })
})

describe('formatCompactCurrency', () => {
  it('shortens by magnitude', () => {
    expect(formatCompactCurrency(1_500_000_000, 'usd')).toBe('$1.5B')
    expect(formatCompactCurrency(340_500_000, 'usd')).toBe('$340.5M')
    expect(formatCompactCurrency(12_000, 'usd')).toBe('$12.0K')
    expect(formatCompactCurrency(750, 'usd')).toBe('$750')
  })

  it('carries the euro symbol through', () => {
    expect(formatCompactCurrency(1_500_000_000, 'eur')).toBe('€1.5B')
  })

  it('handles negative values by magnitude, not sign', () => {
    expect(formatCompactCurrency(-2_000_000, 'usd')).toBe('$-2.0M')
  })
})

describe('formatPercent', () => {
  it('signs the value explicitly', () => {
    expect(formatPercent(1.2)).toBe('+1.20%')
    expect(formatPercent(-0.35)).toBe('-0.35%')
    expect(formatPercent(0)).toBe('+0.00%')
  })

  it('always shows two decimals', () => {
    expect(formatPercent(3)).toBe('+3.00%')
    expect(formatPercent(-12.3456)).toBe('-12.35%')
  })

  // Regression: CoinGecko returns null for a coin with no 24h history, and
  // `null.toFixed` crashed the whole /crypto table.
  it('renders a missing value as a dash instead of throwing', () => {
    expect(formatPercent(null)).toBe('—')
  })
})
