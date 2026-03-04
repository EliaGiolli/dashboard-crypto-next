import { cookies } from 'next/headers'
import { MobileMenu } from '../../components/shared/MobileMenu'
//Internal imports
import Link from 'next/link'
import { AuthNavButton } from '@/components/layout/AuthNavButton'

async function Navbar() {
  const cookieStore = await cookies()
  const isAuthenticated = !!cookieStore.get('session')

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
        <AuthNavButton isAuthenticated={isAuthenticated} />
      </div>
    </header>
  )
}

export default Navbar