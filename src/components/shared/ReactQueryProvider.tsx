"use client";  
//External libs
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
//Types
import { QueryProviderTypes } from "@/types/CryptoApiTypes";

const queryClient = new QueryClient();  

export function ReactQueryProvider({ children }: QueryProviderTypes) {   
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; 
}