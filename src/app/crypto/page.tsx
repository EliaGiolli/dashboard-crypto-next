import { Suspense } from "react";

import { TableCryptoData, getMarkets, parseCurrency } from "@/features/crypto";
import { SkeletonComponent } from "@/shared/ui/SkeletonComponent";

async function MarketsTable({
  searchParams,
}: {
  searchParams: PageProps<"/crypto">["searchParams"];
}) {
  const { currency } = await searchParams;
  const resolved = parseCurrency(currency);
  const markets = await getMarkets(10, resolved);

  return <TableCryptoData markets={markets} currency={resolved} />;
}

export default function CryptoPage(props: PageProps<"/crypto">) {
  return (
    <section
      aria-labelledby="crypto-title"
      className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
    >
      {/*
        The heading the `aria-labelledby` was already pointing at. Nothing in
        this subtree rendered `id="main-title"`, so the region had no
        accessible name and the page had no <h1> at all.
      */}
      <h1
        id="crypto-title"
        className="text-3xl md:text-4xl font-bold text-violet-700 mb-8 text-center"
      >
        Le nostre criptovalute
      </h1>

      <Suspense fallback={<SkeletonComponent />}>
        <MarketsTable searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
