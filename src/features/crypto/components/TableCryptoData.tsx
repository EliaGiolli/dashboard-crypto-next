import Image from 'next/image'

import { FavoriteButton } from '@/features/watchlist'
import { formatCurrency, formatPercent, type Currency } from '@/shared/utils'

import type { CryptoMarket } from '../types'

interface TableCryptoDataProps {
  markets: CryptoMarket[]
  currency: Currency
}

/**
 * A server component. It used to be a client component that took
 * `{ data, error, isLoading }` and branched on the last two; the page now
 * hands it a plain array, and `loading.tsx` plus `error.tsx` cover the
 * states it used to render itself.
 *
 * `FavoriteButton` stays a client island inside it — a server component
 * rendering a client component is the direction that works.
 */
export default function TableCryptoData({
  markets,
  currency,
}: TableCryptoDataProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-md">
      <h2 className="text-xl md:text-2xl text-violet-400 p-5 bg-slate-700 text-center py-4">
        Top {markets.length} Criptovalute per Market Cap
      </h2>
      <table className="min-w-full border-collapse text-sm md:text-base">
        <thead className="bg-slate-700 text-slate-100">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-violet-500 font-semibold uppercase tracking-wider">
              Criptovaluta
            </th>
            <th scope="col" className="px-4 py-3 text-right text-violet-500 font-semibold uppercase tracking-wider">
              Prezzo corrente
            </th>
            <th scope="col" className="px-4 py-3 text-right text-violet-500 font-semibold uppercase tracking-wider">
              Valore di mercato
            </th>
            {/* Hidden at the same breakpoint as its cells. The header row used
                to render 6 columns against 5 body cells on mobile. */}
            <th scope="col" className="px-4 py-3 hidden md:table-cell text-right text-violet-500 font-semibold uppercase tracking-wider">
              Volume totale
            </th>
            <th scope="col" className="px-4 py-3 text-right text-violet-500 font-semibold uppercase tracking-wider">
              Cambio di prezzo
            </th>
            <th scope="col" className="px-4 py-3 text-center text-violet-500 font-semibold uppercase tracking-wider">
              Preferiti
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 text-slate-200">
          {markets.map((item, i) => (
            <tr
              key={item.id}
              className={`transition-colors ${i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'} hover:bg-slate-700/50`}
            >
              <th scope="row" className="px-4 py-2 font-semibold text-slate-100 text-left">
                <span className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                  {item.name}
                </span>
              </th>
              {/* Formatted in the currency the data was actually requested
                  in. Every money column used to print a hardcoded "€" while
                  the API returned USD. */}
              <td className="px-4 py-2 text-right">
                {formatCurrency(item.current_price, currency)}
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(item.market_cap, currency)}
              </td>
              <td className="px-4 py-2 hidden md:table-cell text-right">
                {formatCurrency(item.total_volume, currency)}
              </td>
              <td className="px-4 py-2 text-right">
                <span
                  className={
                    item.price_change_percentage_24h >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  <span aria-hidden="true">
                    {item.price_change_percentage_24h >= 0 ? '▲ ' : '▼ '}
                  </span>
                  {formatPercent(item.price_change_percentage_24h)}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <FavoriteButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
