'use client'

import React from "react"
//Components
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
//Types
import type { SidebarProps } from "../../types/CryptoApiTypes"
//Img
import BitcoinIcon from '../../assets/bitcoin.png';
import EthereumIcon from '../../assets/ethereum.png';
import DogecoinIcon from '../../assets/dogecoin.png'



export default function TableCryptoData({ data, error, isLoading }: SidebarProps) {

    if(isLoading) return <Skeleton />
    if(error) return  <p className="text-red-500">Errore nel recupero delle crypto</p>;

    const columns = ["Criptovaluta", "Prezzo corrente", "Valore di mercato", "Volume totale", "Cambio di prezzo"];
    //Next returns an object when importing static images with <Image>, hence the Record type
    const iconMap: Record<string, string> = {
      bitcoin: BitcoinIcon.src,
      ethereum: EthereumIcon.src,
      dogecoin: DogecoinIcon.src,
    };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-md">
     <table className="min-w-full border-collapse text-sm md:text-base">
      <thead className="bg-slate-700 text-slate-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-3 text-left text-violet-500 font-semibold uppercase tracking-wider">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-700 text-slate-200">
        {data?.map((item, i) => {
          const icon = iconMap[item.id.toLowerCase()] || null;

          return (
            <tr
              key={item.id}
              className={`transition-colors ${i % 2 === 0 ? "bg-slate-800" : "bg-slate-900"} hover:bg-slate-700/50`}
            >
              <td className="px-4 py-2 flex items-center gap-3">
                {icon && (
                  <img
                    src={icon}
                    alt={`${item.name} logo`}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-semibold text-slate-100">{item.name}</span>
              </td>
              <td className="px-4 py-2 text-right">{item.current_price.toLocaleString()} €</td>
              <td className="px-4 py-2 text-right">{item.market_cap.toLocaleString()} €</td>
              <td className="px-4 py-2 text-right">{item.total_volume.toLocaleString()} €</td>
              <td className="px-4 py-2 text-right flex items-center justify-end gap-2">
                {item.price_change_percentage_24h >= 0 ? (
                  <span className="text-green-500">▲</span>
                ) : (
                  <span className="text-red-500">▼</span>
                )}
                {item.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          );
        })}
      </tbody>

     </table>
    </div>
  )
}
