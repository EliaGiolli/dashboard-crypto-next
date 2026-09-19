import { Suspense } from "react";

import {
  DEFAULT_DAYS,
  MarketCapSingleCrypto,
  PriceHistoryChart,
  VolumeHistoryChart,
  getMarketChart,
  parseCurrency,
} from "@/features/crypto";
import { SkeletonComponent } from "@/shared/ui/SkeletonComponent";
import type { Currency } from "@/shared/utils";

/**
 * One cached request feeds all three charts. Each chart used to call
 * `useFetchSingleCrypto(id, days)` for itself, so opening a coin fired three
 * identical requests from the browser.
 */
async function CoinCharts({
  id,
  currency,
}: {
  id: string;
  currency: Currency;
}) {
  const data = await getMarketChart(id, DEFAULT_DAYS, currency);
  const shared = { data, coinId: id, currency, days: DEFAULT_DAYS };

  return (
    <div className="flex flex-col gap-6 w-full">
      <MarketCapSingleCrypto {...shared} />
      <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-5">
        <VolumeHistoryChart {...shared} />
        <PriceHistoryChart {...shared} />
      </div>
    </div>
  );
}

/**
 * A server component. It was marked `'use client'` *and* declared `async`
 * *and* awaited `params` — a combination Next 16 does not allow — and then
 * read `params.id` directly alongside the awaited copy.
 *
 * `PageProps<'/crypto/[id]'>` comes from `next typegen`, so the route string
 * is checked against the actual file tree.
 */
export default async function CoinPage(props: PageProps<"/crypto/[id]">) {
  const { id } = await props.params;
  const { currency } = await props.searchParams;

  return (
    <section
      className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      aria-labelledby="coin-title"
    >
      <div className="border border-slate-800/20 w-full p-6 rounded-md shadow-md shadow-slate-500 mb-5">
        <h1
          className="text-center text-3xl text-violet-600 capitalize font-bold"
          id="coin-title"
        >
          Crypto: {id}
        </h1>
      </div>

      <Suspense fallback={<SkeletonComponent />}>
        <CoinCharts id={id} currency={parseCurrency(currency)} />
      </Suspense>
    </section>
  );
}
