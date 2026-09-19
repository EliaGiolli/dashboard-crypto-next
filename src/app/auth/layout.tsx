import Link from "next/link"
import React, { Suspense } from 'react'

import { getCurrentUser } from '@/features/auth'
import { Button } from '@/shared/ui/button'

/**
 * The CTA is the only part of this layout that depends on the session, so it
 * is the only part inside the boundary. A layout cannot rely on its own
 * `loading.tsx` — that wraps the page beneath it, not the layout itself — so
 * an async layout would have pushed the boundary requirement up to the root.
 */
async function AuthCta() {
  const isAuthenticated = !!(await getCurrentUser())

  return (
    <Button asChild>
      <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
        {isAuthenticated ? 'Vai alla dashboard' : 'Crea un account'}
      </Link>
    </Button>
  )
}

function AuthLayout({ children }: { children: React.ReactNode}) {
  return (
    <main className='grid grid-cols-1 md:grid-cols-2 min-h-screen bg-slate-300 text-slate-800'>
      <section className='flex flex-col items-center justify-center p-8 gap-y-8'>
        <h1 className="font-bold text-2xl md:text-3xl text-violet-700">Tired of searching for the best crypto dashboard? You&apos;ve found it!</h1>
        <p className="text-lg text-slate-600">NexCoin is the best crypto dashboard for tracking your favorite cryptocurrencies. It&apos;s easy to use and provides a lot of information.</p>
        <Suspense fallback={<div className="h-9 w-40" aria-hidden="true" />}>
          <AuthCta />
        </Suspense>
      </section>
      <section className="m-auto p-8">
        {children}
      </section>
    </main>
  )
}

export default AuthLayout;
