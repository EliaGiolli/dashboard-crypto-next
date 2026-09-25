/**
 * CoinGecko API response shapes.
 *
 * Component props are deliberately NOT here: they belong next to the
 * component that takes them. The old `CryptoListProps` — a single
 * `{ data, error, isLoading }` shared by three components that had nothing in
 * common — is gone with the client fetching that produced it. Streaming
 * covers loading and `error.tsx` covers failure, so no component takes those
 * props any more.
 */

/** `/coins/markets` — one row per coin. */
export interface CryptoMarket {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  total_volume: number
  /** `null` for a coin with no 24h history (e.g. a newly listed one). */
  price_change_percentage_24h: number | null
  image: string
}

/** `/coins/{id}/market_chart` — parallel [timestamp, value] series. */
export interface MarketChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}
