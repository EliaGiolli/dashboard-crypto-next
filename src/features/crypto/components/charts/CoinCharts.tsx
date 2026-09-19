import type { Currency } from '@/shared/utils'

import {
  toMarketCapSeries,
  toPriceSeries,
  toVolumeSeries,
} from '../../lib/chart-data'
import type { MarketChartData } from '../../types'
import { ChartCard } from './ChartCard'
import { SeriesAreaChart, SeriesBarChart } from './SeriesChart'

interface CoinChartProps {
  /** Already fetched by the page, so all three charts share one response. */
  data: MarketChartData
  coinId: string
  currency: Currency
  days: number
}

/**
 * The three per-coin history charts.
 *
 * Each used to call `useFetchSingleCrypto(id, days)` on its own — three
 * identical requests for one page — and each repeated the same
 * timestamp-to-label mapping in a `useMemo`. That mapping now lives in
 * `lib/chart-data.ts` where it can be tested.
 */

export function MarketCapSingleCrypto({
  data,
  coinId,
  currency,
  days,
}: CoinChartProps) {
  return (
    <ChartCard
      title="Market Cap"
      subtitle={`Capitalizzazione di ${coinId} negli ultimi ${days} giorni`}
    >
      <SeriesAreaChart
        data={toMarketCapSeries(data)}
        color="violet"
        currency={currency}
        yFormat="compact"
        ariaLabel={`Grafico della capitalizzazione di mercato di ${coinId} negli ultimi ${days} giorni`}
      />
    </ChartCard>
  )
}

export function PriceHistoryChart({
  data,
  coinId,
  currency,
  days,
}: CoinChartProps) {
  return (
    <ChartCard
      title="Prezzo Storico"
      subtitle={`Prezzo giornaliero di ${coinId} negli ultimi ${days} giorni`}
    >
      <SeriesAreaChart
        data={toPriceSeries(data)}
        color="emerald"
        currency={currency}
        yFormat="price"
        ariaLabel={`Grafico del prezzo di ${coinId} negli ultimi ${days} giorni`}
      />
    </ChartCard>
  )
}

export function VolumeHistoryChart({
  data,
  coinId,
  currency,
  days,
}: CoinChartProps) {
  return (
    <ChartCard
      title="Volume Storico"
      subtitle={`Volume giornaliero di ${coinId} negli ultimi ${days} giorni`}
    >
      <SeriesBarChart
        data={toVolumeSeries(data)}
        color="violet"
        currency={currency}
        yFormat="compact"
        ariaLabel={`Grafico del volume di ${coinId} negli ultimi ${days} giorni`}
      />
    </ChartCard>
  )
}
