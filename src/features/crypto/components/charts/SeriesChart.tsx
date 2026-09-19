'use client'

import { useId } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  formatCompactCurrency,
  formatCurrency,
  type Currency,
} from '@/shared/utils'

import {
  AXIS_PROPS,
  CHART_COLORS,
  CHART_MARGIN,
  GRID_PROPS,
  TOOLTIP_PROPS,
  type ChartColor,
} from './chart-theme'

export interface SeriesChartProps {
  /** Rows of `{ x, y }`. Already fetched — these charts never fetch. */
  data: { x: string; y: number }[]
  color?: ChartColor
  currency: Currency
  /**
   * How to label the Y axis. A string, not a function: these charts are
   * rendered by Server Components, and a function cannot cross the
   * server/client boundary — React rejects it at runtime with "Functions
   * cannot be passed directly to Client Components".
   *
   * `compact` suits market caps and volumes (`$1.2B`); `price` suits prices.
   * Tooltips always show the full value either way.
   */
  yFormat?: 'compact' | 'price'
  /**
   * Recharts renders an SVG that assistive tech reads as nothing at all, so
   * the container is labelled explicitly. Required, not optional.
   */
  ariaLabel: string
  height?: number
}

/** Builds the two formatters on the client, from serializable props. */
function useFormatters(currency: Currency, yFormat: 'compact' | 'price') {
  const formatY = (value: number) =>
    yFormat === 'compact'
      ? formatCompactCurrency(value, currency)
      : formatCurrency(value, currency)

  const formatValue = (value: number) => formatCurrency(value, currency)

  return { formatY, formatValue }
}

/**
 * `'use client'` only because Recharts measures the DOM. There is no fetching,
 * no `isLoading` and no `error` branch: streaming covers the first and
 * `error.tsx` covers the second.
 *
 * The gradient id comes from `useId()`. It used to be a hardcoded string, and
 * SVG ids are document-global — `MarketCap` and `MarketCapSingleCrypto` both
 * defined `marketCapGradient`, as did both volume charts, so on a page with
 * two of them the second silently rendered the first one's fill.
 */
export function SeriesAreaChart({
  data,
  color = 'violet',
  currency,
  yFormat = 'compact',
  ariaLabel,
  height = 300,
}: SeriesChartProps) {
  const gradientId = useId()
  const stroke = CHART_COLORS[color]
  const { formatY, formatValue } = useFormatters(currency, yFormat)

  return (
    <div role="img" aria-label={ariaLabel} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="x" {...AXIS_PROPS} />
          <YAxis tickFormatter={formatY} {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} formatter={(value: number) => formatValue(value)} />
          <Area
            type="monotone"
            dataKey="y"
            stroke={stroke}
            fill={`url(#${gradientId})`}
            fillOpacity={0.7}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/** The bar counterpart. Same contract, same gradient-id fix. */
export function SeriesBarChart({
  data,
  color = 'violet',
  currency,
  yFormat = 'compact',
  ariaLabel,
  height = 300,
}: SeriesChartProps) {
  const gradientId = useId()
  const stroke = CHART_COLORS[color]
  const { formatY, formatValue } = useFormatters(currency, yFormat)

  return (
    <div role="img" aria-label={ariaLabel} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="x" {...AXIS_PROPS} />
          <YAxis tickFormatter={formatY} {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} formatter={(value: number) => formatValue(value)} />
          <Bar
            dataKey="y"
            fill={`url(#${gradientId})`}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
