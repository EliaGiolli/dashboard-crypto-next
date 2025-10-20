import { useQuery } from '@tanstack/react-query';
import { type CryptoMarket } from '../types/CryptoApiTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFetchCrypto() {
  return useQuery<CryptoMarket[], Error>({
    queryKey: ['crypto'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch crypto data');
        console.log('dati ricevuti?', res)
      return res.json();
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
  });
}