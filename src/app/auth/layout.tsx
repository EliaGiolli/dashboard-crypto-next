import { Button } from '@/components/ui/button';
import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode}) {
  const isAuthenticated = false;
  return (
    <main className='grid grid-cols-1 md:grid-cols-2 min-h-screen bg-slate-300 text-slate-800'>
      <section className='flex flex-col items-center justify-center p-8 gap-y-8'>
        <h1>Tired of searching for the best crypto dashboard? You've found it!</h1>
        <p>NexCoin is the best crypto dashboard for tracking your favorite cryptocurrencies. It's easy to use and provides a lot of information.</p>//
        {/* Bottone che porta a register se non hai un account, altrimenti porta a login */}
        <Button>
          {isAuthenticated ? 'Login' : 'Register'}
        </Button>
      </section>
      <section>
        {children}
      </section>
    </main>
  )
}

export default AuthLayout;