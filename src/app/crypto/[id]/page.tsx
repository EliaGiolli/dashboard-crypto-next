//Components
import MarketCapSingleCrypto from "../../../components/layout/MarketCapSingleCrypto";
import VolumeHistoryChart from "../../..//components/layout/VolumeHistoryChart";
import PriceHistoryChart from "../../..//components/layout/PriceHistoryChart";
//Types
import { CryptoPageProps } from "../../..//types/CryptoApiTypes";

export default async function CryptoPage({ params }: CryptoPageProps) {

  //In Next15+ params should be awaited before using it
  const { id } = await params;

  if (!id) {
    return <p className="text-red-500">Nessuna crypto selezionata</p>;
  }

  return (
    <section className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="border border-slate-800/20 w-full p-6 rounded-md shadow-md shadow-slate-500 mb-5 ">
         <h1 className="text-center text-3xl text-violet-600 capitalize font-bold">Crypto: {params.id}</h1>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <MarketCapSingleCrypto id={params.id} />
        <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-5">
          <VolumeHistoryChart id={params.id} />
          <PriceHistoryChart id={params.id} />
        </div>
      </div>
    </section>
  );
}
