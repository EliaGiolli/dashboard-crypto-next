import { useQuery } from "@tanstack/react-query";
import { MarketChartData } from "@/types/CryptoApiTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL_SECOND
export function useFetchSingleCrypto(id: string, days = 7, currency = "usd") {
  return useQuery<MarketChartData, Error>({
    queryKey: ["crypto-detail", id, days, currency],
    queryFn: async () => {
      const url = `${API_URL}/${id}/market_chart?vs_currency=${currency}&days=${days}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch data for ${id}`);
      return res.json();
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
