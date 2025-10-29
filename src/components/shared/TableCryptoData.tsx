'use client'

import React from "react"
//Components
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import AddToFavoritesButton from "./AddToFavoriteButton";
//Types
import type { SidebarProps } from "../../types/CryptoApiTypes"


export default function TableCryptoData({ data, error, isLoading }: SidebarProps) {

    if(isLoading) return <Skeleton />
    if(error) return  <p className="text-red-500 bg-red-200 p-4">Errore nel recupero delle crypto</p>;

    const columns = ["Criptovaluta", "Prezzo corrente", "Valore di mercato", "Volume totale", "Cambio di prezzo", "Preferiti"];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-md">
      <h3 className="text-xl md:text-2xl text-violet-400 p-5 bg-slate-700 text-center py-4">
        Top 15 Criptovalute per Market Cap
      </h3>
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
        
          return (
            <tr
              key={item.id}
              className={`transition-colors ${i % 2 === 0 ? "bg-slate-800" : "bg-slate-900"} hover:bg-slate-700/50`}
            >
              <td className="px-4 py-2 flex items-center gap-3">
               <Image 
                src={item.image}
                alt={`${item.name} logo`} 
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-contain"
              />
                <span className="font-semibold text-slate-100">{item.name}</span>
              </td>
              <td className="px-4 py-2 text-right">{item.current_price.toLocaleString()} €</td>
              <td className="px-4 py-2 text-right">{item.market_cap.toLocaleString()} €</td>
              <td className="px-4 py-2 hidden md:table-cell text-right">{item.total_volume.toLocaleString()} €</td>
              <td className="px-4 py-2 text-right flex items-center justify-end gap-2">
                {item.price_change_percentage_24h >= 0 ? (
                  <span className="text-green-500">▲</span>
                ) : (
                  <span className="text-red-500">▼</span>
                )}
                {item.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="px-4 py-2 text-center">
                <AddToFavoritesButton id={item.id}/>
              </td>
            </tr>
          );
        })}
      </tbody>

     </table>
    </div>
  )
}
