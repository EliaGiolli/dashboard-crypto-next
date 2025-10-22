'use client'

import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";
//Components
import TableCryptoData from "../shared/TableCryptoData";


function TableCryptoLayout() {

    const { data, error, isLoading } = useFetchCrypto();

  return ( <TableCryptoData data={data || []} error={error} isLoading={isLoading} /> )
}

export default TableCryptoLayout