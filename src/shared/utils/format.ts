/**
 * Pure number formatters.
 *
 * They live in shared/utils because they have no dependencies and can be
 * unit-tested without a single mock — the rule that separates `shared/utils/`
 * from `core/lib/`.
 */

export type Currency = 'usd' | 'eur'

/** Every currency the app is willing to ask CoinGecko for. */
export const CURRENCIES: readonly Currency[] = ['usd', 'eur'] as const

const LOCALES: Record<Currency, string> = {
  usd: 'en-US',
  eur: 'it-IT',
}

/**
 * A price, in the currency the data was actually requested in.
 *
 * The old table hardcoded a `€` suffix on all four money columns while the
 * API was returning USD. Taking the currency as an argument is what stops
 * that from being possible.
 */
export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value)
}

/**
 * A large figure shortened for an axis tick or a tooltip: 1.2B, 340.5M, 12.0K.
 * Market caps and volumes are the only things big enough to need it.
 */
export function formatCompactCurrency(value: number, currency: Currency): string {
  const symbol = currency === 'eur' ? '€' : '$'
  const abs = Math.abs(value)

  if (abs >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`

  return `${symbol}${value.toFixed(0)}`
}

/** A signed percentage with a fixed two decimals, e.g. `+1.20%` / `-0.35%`. */
export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}
