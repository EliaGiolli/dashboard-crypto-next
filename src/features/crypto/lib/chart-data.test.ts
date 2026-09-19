import { describe, expect, it } from 'vitest'

import {
  toMarketCapSeries,
  toMarketsSeries,
  toPriceSeries,
  toSeries,
  toVolumeSeries,
} from './chart-data'
import type { MarketChartData } from '../types'

// 2024-03-01 and 2024-03-02, UTC noon so no timezone shifts the day.
const T1 = Date.UTC(2024, 2, 1, 12)
const T2 = Date.UTC(2024, 2, 2, 12)

describe('toSeries', () => {
  it('maps [timestamp, value] pairs to chart rows', () => {
    expect(toSeries([[T1, 100], [T2, 200]])).toEqual([
      { x: '01/03', y: 100 },
      { x: '02/03', y: 200 },
    ])
  })

  it('returns an empty array rather than throwing on missing data', () => {
    expect(toSeries(undefined)).toEqual([])
    expect(toSeries([])).toEqual([])
  })

  // A fixed locale, not the runtime's: the server that prerenders a chart and
  // the browser that hydrates it do not necessarily agree on date formatting.
  it('formats labels with a fixed locale', () => {
    expect(toSeries([[T1, 1]])[0].x).toBe('01/03')
  })
})

describe('series selectors', () => {
  const data: MarketChartData = {
    prices: [[T1, 1]],
    market_caps: [[T1, 2]],
    total_volumes: [[T1, 3]],
  }

  it('each reads its own field', () => {
    expect(toPriceSeries(data)[0].y).toBe(1)
    expect(toMarketCapSeries(data)[0].y).toBe(2)
    expect(toVolumeSeries(data)[0].y).toBe(3)
  })

  it('tolerates undefined data', () => {
    expect(toPriceSeries(undefined)).toEqual([])
  })
})

describe('toMarketsSeries', () => {
  const markets = [
    { symbol: 'btc', market_cap: 900, total_volume: 40 },
    { symbol: 'eth', market_cap: 400, total_volume: 20 },
  ]

  it('charts by uppercased symbol', () => {
    expect(toMarketsSeries(markets, 'market_cap')).toEqual([
      { x: 'BTC', y: 900 },
      { x: 'ETH', y: 400 },
    ])
  })

  it('selects the requested field', () => {
    expect(toMarketsSeries(markets, 'total_volume').map((p) => p.y)).toEqual([
      40, 20,
    ])
  })
})
