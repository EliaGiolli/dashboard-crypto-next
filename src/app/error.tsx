'use client'
//internal imports
import { useEffect } from 'react'
//Components
import { Button } from '../components/ui/button'
//Icons
import { Ban } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div 
        className="bg-red-200 text-slate-200 flex flex-col items-center justify-center h-screen text-center gap-4"
        aria-labelledby='error-main-title'
    >
      <h2 id='error-main-title' className="text-2xl font-bold text-red-500"><Ban size={30}/>Qualcosa è andato storto 💥</h2>
      <p className="text-red-400">{error.message}</p>
      <Button onClick={() => reset()} variant="error">
        Riprova
      </Button>
    </div>
  )
}
