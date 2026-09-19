//Components
'use client'
import MarketCapSingleCrypto from "@/features/crypto/components/charts/MarketCapSingleCrypto";
import VolumeHistoryChart from "@/features/crypto/components/charts/VolumeHistoryChart";
import PriceHistoryChart from "@/features/crypto/components/charts/PriceHistoryChart";

// NOTE: this page is still the pre-refactor version — it is marked
// 'use client' yet is async and awaits params, which Next 16 does not allow.
// Phase 3 rewrites it as a server component using PageProps<'/crypto/[id]'>.
interface CryptoPageProps {
  params: { id: string }
}

import { easeIn, motion } from 'motion/react';

export default async function CryptoPage({ params }: CryptoPageProps) {

  //In Next15+ params should be awaited before using it
  const { id } = await params;

  if (!id) {
    return <p className="text-red-500">Nessuna crypto selezionata</p>;
  }

  return (
    <section 
      className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      role="region"
      aria-labelledby="main-title"
    >
      <div className="border border-slate-800/20 w-full p-6 rounded-md shadow-md shadow-slate-500 mb-5 ">
         <h1 className="text-center text-3xl text-violet-600 capitalize font-bold" id="main-title">Crypto: {params.id}</h1>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <MarketCapSingleCrypto id={params.id} />
        <motion.div 
          className="flex flex-col md:flex-row gap-y-6 md:gap-x-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: easeIn, duration: 2}} 
        >
          <VolumeHistoryChart id={params.id} />
          <PriceHistoryChart id={params.id} />
        </motion.div>
      </div>
    </section>
  );
}
