// Public surface of the crypto feature.
//
// NOTE: this barrel re-exports the `server-only` data layer, so it must be
// imported from Server Components only. Client islands inside the feature
// import their neighbours relatively, which is the project convention anyway.
export { getMarkets, getMarketChart } from './lib/coingecko'
export {
  DEFAULT_CURRENCY,
  DEFAULT_DAYS,
  DEFAULT_LIMIT,
  buildMarketChartUrl,
  buildMarketsUrl,
  parseCurrency,
} from './lib/endpoints'

export { default as TableCryptoData } from './components/TableCryptoData'
export { default as SidebarWrapper } from './components/SidebarWrapper'
export { MarketCap, VolumeBarChart } from './components/charts/MarketsCharts'
export {
  MarketCapSingleCrypto,
  PriceHistoryChart,
  VolumeHistoryChart,
} from './components/charts/CoinCharts'

export type { CryptoMarket, MarketChartData } from './types'
