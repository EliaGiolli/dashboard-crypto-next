import { ReactNode } from "react"

//First api call
export interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image:string
}
//Second api call
export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

//Types for the query provider
export interface QueryProviderTypes {
    children: ReactNode
}
//Types for the sidebar
export interface SidebarProps {
  data?: CryptoMarket[];
  error: Error | null;
  isLoading: boolean;
}

//Types for the dynamic page routing
export interface CryptoPageProps extends SidebarProps {
   params: {
    id: string;
  };
};


