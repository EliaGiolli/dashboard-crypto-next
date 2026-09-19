import 'server-only'

import { cacheLife } from 'next/cache'

import { env } from '@/core/config/envParser'
import type { Currency } from '@/shared/utils'

import {
  DEFAULT_CURRENCY,
  DEFAULT_DAYS,
  DEFAULT_LIMIT,
  buildMarketChartUrl,
  buildMarketsUrl,
} from './endpoints'
import type { CryptoMarket, MarketChartData } from '../types'

/**
 * The server-side replacement for the TanStack Query hooks.
 *
 * `'use cache'` keys each entry on the arguments automatically, so one cached
 * `(limit, currency)` entry now serves every component that used to issue its
 * own browser request — the landing page alone made three per load.
 *
 * `cacheLife('minutes')` replaces `refetchInterval: 30_000`: revalidate after
 * a minute, serve stale for up to five, expire after an hour. Market data is
 * worth a minute of staleness and CoinGecko's free tier is rate-limited.
 *
 * Being server-only is the point of the env change: `COINGECKO_API_URL`
 * replaced two `NEXT_PUBLIC_` variables, so the endpoint no longer ships in
 * the client bundle and an API key can be added later without leaking it.
 */

async function fetchJson<T>(url: string, description: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `CoinGecko request failed for ${description}: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<T>
}

/** Top coins by market cap, in the requested currency. */
export async function getMarkets(
  limit: number = DEFAULT_LIMIT,
  currency: Currency = DEFAULT_CURRENCY
): Promise<CryptoMarket[]> {
  'use cache'
  cacheLife('minutes')

  return fetchJson<CryptoMarket[]>(
    buildMarketsUrl(env.COINGECKO_API_URL, limit, currency),
    `markets (limit=${limit}, currency=${currency})`
  )
}

/** Historical price, market-cap and volume series for a single coin. */
export async function getMarketChart(
  id: string,
  days: number = DEFAULT_DAYS,
  currency: Currency = DEFAULT_CURRENCY
): Promise<MarketChartData> {
  'use cache'
  cacheLife('minutes')

  return fetchJson<MarketChartData>(
    buildMarketChartUrl(env.COINGECKO_API_URL, id, days, currency),
    `market chart for "${id}"`
  )
}
