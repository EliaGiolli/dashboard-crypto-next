import Link from "next/link"
import { Button } from '@/shared/ui/button';
import React from 'react'

import { getCurrentUser } from '@/features/auth';

async function AuthLayout({ children }: { children: React.ReactNode}) {
  // Was hardcoded to `false` while the hand-rolled auth was in place, so the
  // CTA always read "Crea un account". Now it reflects the real session.
  const isAuthenticated = !!(await getCurrentUser());
  return (
    <main className='grid grid-cols-1 md:grid-cols-2 min-h-screen bg-slate-300 text-slate-800'>
      <section className='flex flex-col items-center justify-center p-8 gap-y-8'>
        <h1 className="font-bold text-2xl md:text-3xl text-violet-700">Tired of searching for the best crypto dashboard? You've found it!</h1>
        <p className="text-lg text-slate-600">NexCoin is the best crypto dashboard for tracking your favorite cryptocurrencies. It's easy to use and provides a lot of information.</p>
        {/* Bottone che porta a register se non hai un account, altrimenti porta a login */}
        <Link href={isAuthenticated ? "/auth/login" : "/auth/register"}>
          <Button>
            {isAuthenticated ? 'Vai al login' : 'Crea un account'}
          </Button>
        </Link>
      </section>
      <section className="m-auto p-8">
        {children}
      </section>
    </main>
  )
}

export default AuthLayout;