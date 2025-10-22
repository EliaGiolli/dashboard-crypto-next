import { useQuery } from '@tanstack/react-query';
import { type CryptoMarket } from '../types/CryptoApiTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFetchCrypto(limit = 15, currency = "usd") {
  return useQuery<CryptoMarket[], Error>({
   queryKey: ['crypto', limit, currency],
    queryFn: async () => {
      const url = `${API_URL}?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch crypto data');
      return res.json();
    },
    staleTime: 60_000, // 1 min
    refetchInterval: 30_000, // 30 sec
    refetchOnWindowFocus: true // avoids unwanted refetch
  });
}