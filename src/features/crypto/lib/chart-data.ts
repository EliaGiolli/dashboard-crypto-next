import type { MarketChartData } from '../types'

/**
 * Adapters turning CoinGecko's parallel `[timestamp, value]` arrays into the
 * `{ x, y }` rows Recharts wants.
 *
 * This mapping used to sit in a `useMemo` inside each of the three history
 * charts — the same six lines, three times, untestable because they only ran
 * inside a rendered component. Here they are plain functions with a test.
 */

export interface SeriesPoint {
  /** Localised day label, used as the X axis category. */
  x: string
  y: number
}

/**
 * A fixed locale on purpose. `toLocaleDateString()` with no argument follows
 * the runtime's locale, which differs between the server that prerenders the
 * chart and the browser that hydrates it — a hydration mismatch waiting to
 * happen once these render on the server.
 */
function toDayLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
  })
}

/** Maps one `[timestamp, value]` series into chart rows. */
export function toSeries(pairs: [number, number][] | undefined): SeriesPoint[] {
  if (!pairs) return []

  return pairs.map(([timestamp, value]) => ({
    x: toDayLabel(timestamp),
    y: value,
  }))
}

export const toPriceSeries = (data: MarketChartData | undefined) =>
  toSeries(data?.prices)

export const toMarketCapSeries = (data: MarketChartData | undefined) =>
  toSeries(data?.market_caps)

export const toVolumeSeries = (data: MarketChartData | undefined) =>
  toSeries(data?.total_volumes)

/**
 * Markets rows charted by symbol rather than by date — the two landing-page
 * charts compare coins against each other, not a coin against its own past.
 */
export function toMarketsSeries(
  markets: { symbol: string; market_cap: number; total_volume: number }[],
  key: 'market_cap' | 'total_volume'
): SeriesPoint[] {
  return markets.map((market) => ({
    x: market.symbol.toUpperCase(),
    y: market[key],
  }))
}
