import { Suspense } from "react";

import { parseCurrency } from "@/features/crypto";
import About from "@/features/home/components/About";
import ChartView from "@/features/home/components/ChartView";
import CallToAction from "@/features/home/components/CallToAction";
import { SkeletonComponent } from "@/shared/ui/SkeletonComponent";

/**
 * The `searchParams` promise is passed down rather than awaited here on
 * purpose: awaiting it in the page body would make the whole route dynamic.
 * Read inside the boundary, `About` and `CallToAction` still prerender while
 * the charts stream in.
 */
async function Markets({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) {
  const { currency } = await searchParams;

  return <ChartView currency={parseCurrency(currency)} />;
}

export default function Home(props: PageProps<"/">) {
  return (
    <main className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <About />
      <Suspense fallback={<SkeletonComponent />}>
        <Markets searchParams={props.searchParams} />
      </Suspense>
      <CallToAction />
    </main>
  );
}
