interface CryptoSymbol {
    symbol: string,
    name: string,
    price_usd: number,
    price_change_24h: number,
    percent_change_24h: number,
    market_cap_usd: number,
    volume_24h_usd: number,
    circulating_supply: number,
    last_updated: Date
}

export interface CryptoApiResponse {
    status: string,
    symbols: CryptoSymbol[]
}