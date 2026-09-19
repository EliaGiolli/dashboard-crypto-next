import { Suspense } from "react";

import { SidebarWrapper, getMarkets } from "@/features/crypto";

/**
 * The coin list in the sidebar shows symbols and logos only, so it does not
 * depend on the selected currency — which is just as well, because layouts
 * receive no `searchParams`. It takes the cached default.
 */
async function CryptoSidebar() {
  const markets = await getMarkets();

  return <SidebarWrapper markets={markets} />;
}

function SidebarFallback() {
  return (
    <div
      className="hidden lg:block min-w-[200px] bg-slate-800 border-r-4 border-r-violet-500"
      aria-hidden="true"
    />
  );
}

/**
 * No longer `'use client'`, and no `ReactQueryProvider`: that provider built
 * `new QueryClient()` at module scope — one cache shared across every request
 * on the server — and was mounted here *and* inside `ChartView`, giving the
 * app two independent caches.
 */
export default function CryptoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      <Suspense fallback={<SidebarFallback />}>
        <CryptoSidebar />
      </Suspense>
      <main className="flex-1">{children}</main>
    </section>
  );
}
