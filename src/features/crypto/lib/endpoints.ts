import { CURRENCIES, type Currency } from '@/shared/utils'

/**
 * URL building and search-param parsing for the CoinGecko REST API.
 *
 * Deliberately separate from `coingecko.ts`: that module is `server-only` and
 * its functions carry `'use cache'`, so they cannot run under Vitest. These
 * are plain functions, which is what makes the query strings testable at all.
 */

export const DEFAULT_CURRENCY: Currency = 'usd'
export const DEFAULT_LIMIT = 10
export const DEFAULT_DAYS = 7

/**
 * Narrows an untrusted `?currency=` value to one the app supports.
 *
 * A search param is user input: it arrives from a hand-edited URL as readily
 * as from the UI, so anything unrecognised falls back rather than reaching
 * the API.
 */
export function parseCurrency(value: string | string[] | undefined): Currency {
  const candidate = Array.isArray(value) ? value[0] : value

  return CURRENCIES.includes(candidate as Currency)
    ? (candidate as Currency)
    : DEFAULT_CURRENCY
}

/**
 * `/coins/markets` — the top N coins by market cap.
 *
 * `vs_currency` takes the requested currency. The client hook this replaces
 * accepted a `currency` argument, put it in the React Query key, and then
 * hardcoded `vs_currency=usd` in the URL — so asking for "eur" returned USD
 * prices cached under a eur key.
 */
export function buildMarketsUrl(
  base: string,
  limit: number = DEFAULT_LIMIT,
  currency: Currency = DEFAULT_CURRENCY
): string {
  const params = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
  })

  return `${base}/coins/markets?${params}`
}

/** `/coins/{id}/market_chart` — parallel price/market-cap/volume series. */
export function buildMarketChartUrl(
  base: string,
  id: string,
  days: number = DEFAULT_DAYS,
  currency: Currency = DEFAULT_CURRENCY
): string {
  const params = new URLSearchParams({
    vs_currency: currency,
    days: String(days),
  })

  return `${base}/coins/${encodeURIComponent(id)}/market_chart?${params}`
}
