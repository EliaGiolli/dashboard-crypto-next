import Link from "next/link"
import { Bitcoin, MousePointerClick } from 'lucide-react'

import { MarketCap, VolumeBarChart, getMarkets } from "@/features/crypto"
import { buttonVariants } from "@/shared/ui/button-variants"
import { FadeInSection } from "@/shared/ui/FadeInSection"
import { cn } from "@/shared/utils"
import type { Currency } from "@/shared/utils"

interface ChartViewProps {
  currency: Currency
}

/**
 * An async server component: it awaits the cached markets call and hands the
 * rows to two presentational charts.
 *
 * Before, this mounted a SECOND `ReactQueryProvider` (the crypto layout had
 * one too), so the landing page ran an independent query cache, and each
 * chart fetched the same markets response for itself.
 *
 * Its caller wraps it in <Suspense>, so the rest of the page paints while
 * CoinGecko is still answering.
 */
async function ChartView({ currency }: ChartViewProps) {
  const markets = await getMarkets(10, currency)

  return (
    <FadeInSection
      className="w-full max-w-7xl mx-auto bg-slate-800 text-slate-200 px-6 md:px-8 py-12 my-15 rounded-2xl shadow-md shadow-slate-200"
      aria-labelledby="title-section"
    >
      <div className="flex flex-col md:flex-row gap-y-8 justify-between items-center text-center px-8 mb-10">
        <h2 id='title-section' className="text-3xl md:text-4xl text-violet-500 flex items-center">
          <Bitcoin className="w-[1em] h-[1em]" aria-hidden="true" /> Le nostre crypto
        </h2>
        <Link
          href="/crypto"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          <MousePointerClick aria-hidden='true' />
          Guarda le nostre crypto
        </Link>
      </div>

      <div className="px-2 md:px-6 flex flex-col gap-6">
        <MarketCap markets={markets} currency={currency} />
        <VolumeBarChart markets={markets} currency={currency} />
      </div>
    </FadeInSection>
  )
}

export default ChartView
