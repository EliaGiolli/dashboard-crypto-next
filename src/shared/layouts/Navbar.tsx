import type { ReactNode } from 'react'
import Link from 'next/link'

import { MobileMenu } from '@/shared/layouts/MobileMenu'

interface NavbarProps {
  /**
   * The auth control (sign in / sign out). Passed in by the route layout so
   * this component stays presentational and shared/ never imports features/.
   */
  authSlot?: ReactNode
}

function Navbar({ authSlot }: NavbarProps) {
  return (
    <header className="w-full bg-slate-800 text-slate-200 flex justify-evenly items-center text-center px-6 py-8 border-b-2 border-b-violet-500">
      <Link href="/" className="text-3xl md:text-4xl text-violet-500 ml-6">
        NexCoin
      </Link>
      <nav className="flex justify-center w-full">
        <ul className="hidden md:flex gap-6">
          <li className="hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out">
            <Link href="/" className="block w-full h-full">
              Chi siamo
            </Link>
          </li>
          <li className="hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out">
            <Link href="/crypto" className="block w-full h-full">
              Le nostre Crypto
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-6 mr-6">
        <MobileMenu />
        {authSlot}
      </div>
    </header>
  )
}

export default Navbar