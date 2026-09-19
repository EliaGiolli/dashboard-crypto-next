/**
 * One source of truth for the chart styling that was copy-pasted, with small
 * drifts, across all five chart files.
 *
 * Not a component and not `'use client'` — it is plain data that client
 * components spread into Recharts props.
 */

export const CHART_COLORS = {
  violet: '#8b5cf6',
  emerald: '#10b981',
} as const

export type ChartColor = keyof typeof CHART_COLORS

export const AXIS_PROPS = {
  tick: { fill: '#e2e8f0', fontSize: 13 },
  axisLine: { stroke: '#64748b' },
  tickLine: { stroke: '#475569' },
} as const

export const GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: '#334155',
} as const

export const TOOLTIP_PROPS = {
  contentStyle: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    border: 'none',
  },
  labelStyle: { color: '#e2e8f0', fontWeight: 'bold' },
} as const

export const CHART_MARGIN = { top: 10, right: 30, left: 0, bottom: 0 } as const

/** The card every chart sits in. */
export const CHART_CARD_CLASS =
  'rounded-xl bg-slate-800 shadow-lg p-6 w-full transition-all hover:shadow-xl'
