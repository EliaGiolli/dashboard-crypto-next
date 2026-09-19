import type { Currency } from '@/shared/utils'

import { toMarketsSeries } from '../../lib/chart-data'
import type { CryptoMarket } from '../../types'
import { ChartCard } from './ChartCard'
import { SeriesAreaChart, SeriesBarChart } from './SeriesChart'

interface MarketsChartProps {
  markets: CryptoMarket[]
  currency: Currency
}

/**
 * The two landing-page charts, comparing the top coins against each other.
 *
 * Both are server components taking data as props. They used to call
 * `useFetchCrypto()` themselves, which meant the landing page issued three
 * separate browser requests for the same markets response.
 */

export function MarketCap({ markets, currency }: MarketsChartProps) {
  return (
    <ChartCard
      title="Market Cap Totale"
      subtitle="Capitalizzazione di mercato delle principali criptovalute"
    >
      <SeriesAreaChart
        data={toMarketsSeries(markets, 'market_cap')}
        color="violet"
        currency={currency}
        yFormat="compact"
        ariaLabel="Grafico della capitalizzazione di mercato delle principali criptovalute"
      />
    </ChartCard>
  )
}

export function VolumeBarChart({ markets, currency }: MarketsChartProps) {
  return (
    <ChartCard
      title="Volume di trading"
      subtitle="Volume totale delle principali criptovalute"
    >
      <SeriesBarChart
        data={toMarketsSeries(markets, 'total_volume')}
        color="violet"
        currency={currency}
        yFormat="compact"
        ariaLabel="Grafico del volume di trading delle principali criptovalute"
      />
    </ChartCard>
  )
}
