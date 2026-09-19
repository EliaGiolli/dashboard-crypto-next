/**
 * CoinGecko API response shapes.
 *
 * Component props are deliberately NOT here: they belong next to the
 * component that takes them. The `isLoading` / `error` props that used to
 * live in this file disappear in Phase 3, when fetching moves to the server
 * and streaming replaces the manual loading states.
 */

/** `/coins/markets` — one row per coin. */
export interface CryptoMarket {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  image: string
}

/** `/coins/{id}/market_chart` — parallel [timestamp, value] series. */
export interface MarketChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

/**
 * Shared by Sidebar, DrawerDashboardMenu and TableCryptoData — three
 * components that do not actually share an interface. Phase 3 gives each its
 * own props once the loading/error branches are gone.
 */
export interface CryptoListProps {
  data?: CryptoMarket[]
  error: Error | null
  isLoading: boolean
}
