'use client'

import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";
//Components
import TableCryptoData from "../shared/TableCryptoData";


function TableCryptoLayout({ limit = 10, currency = 'usd' }) {

    const { data, error, isLoading } = useFetchCrypto(limit, currency);

  return ( <TableCryptoData data={data || []} error={error} isLoading={isLoading} /> )
}

export default TableCryptoLayout