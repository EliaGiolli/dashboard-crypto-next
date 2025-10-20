import { ReactNode } from "react"

export interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export interface QueryProviderTypes {
    children: ReactNode
}