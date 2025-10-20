import { useQuery } from '@tanstack/react-query';
import { type CryptoApiResponse } from '../types/CryptoApiTypes';

export function useFetchCrypto(){

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    return useQuery<CryptoApiResponse, Error>({
        queryKey: ['crypto'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}?apikey=${API_KEY}`);

            if(!res.ok){
                throw new Error('Failed to fetch crypto data');
            }
            return res.json();
        },
        staleTime: 1000 * 60, //The cache clears every 1 minute
        refetchInterval: 1000 * 30, //it refreshes every 30 seconds
    })
}