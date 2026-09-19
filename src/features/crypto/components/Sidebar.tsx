import Image from 'next/image'
import Link from 'next/link'

import type { CryptoMarket } from '../types'

interface SidebarProps {
  markets: CryptoMarket[]
}

/**
 * Desktop coin list. A server component now — no fetching, no loading or
 * error branch, and no `'use client'`.
 *
 * Visibility is a CSS concern (`hidden lg:flex` on the wrapper). It used to
 * be decided by `useMediaQuery`, which resolves only after hydration and so
 * rendered nothing at all on first paint.
 */
export default function Sidebar({ markets }: SidebarProps) {
  return (
    <aside className="hidden lg:flex min-w-[200px] bg-slate-800 text-slate-200 flex-col justify-start items-center text-center border-r-4 border-r-violet-500 py-10">
      <nav aria-label="Criptovalute">
        <ul className="flex flex-col gap-6">
          {markets.map((item) => (
            <li
              key={item.id}
              className="hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-sm md:text-lg uppercase px-3 py-2 transition-colors duration-200 ease-in-out"
            >
              <Link href={`/crypto/${item.id}`} className="flex gap-4 items-center">
                <Image width={24} height={24} src={item.image} alt="" />
                <span>{item.symbol}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
