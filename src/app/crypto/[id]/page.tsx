import MarketCapSingleCrypto from "@/components/layout/MarketCapSingleCrypto";
import { CryptoPageProps } from "@/types/CryptoApiTypes";


export default function CryptoPage({ params }: CryptoPageProps) {
  const { id } = params;

  return (
    <section className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MarketCapSingleCrypto id={id} />
    </section>
  );
}
