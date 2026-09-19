'use client'

import { useFetchCrypto } from "../hooks/useFetchCrypto";
//Components
import TableCryptoData from "./TableCryptoData";


function TableCryptoLayout({ limit = 10, currency = 'usd' }) {

    const { data, error, isLoading } = useFetchCrypto(limit, currency);

  return ( <TableCryptoData data={data || []} error={error} isLoading={isLoading} /> )
}

export default TableCryptoLayout