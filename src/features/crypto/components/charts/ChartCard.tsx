import type { ReactNode } from 'react'

import { CHART_CARD_CLASS } from './chart-theme'

interface ChartCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

/**
 * The card, heading and subheading every chart repeated verbatim.
 *
 * A server component: it renders markup and passes the client chart through
 * as `children`, which keeps the `'use client'` island down to the Recharts
 * wrapper that actually needs the DOM.
 */
export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <section className={CHART_CARD_CLASS}>
      <h3 className="text-2xl text-violet-400 font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-300 mb-4">{subtitle}</p>
      {children}
    </section>
  )
}
