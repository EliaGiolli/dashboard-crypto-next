'use client'

import { Button } from '../components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center gap-4">
        <h1 className="text-3xl font-bold text-red-600">Errore inaspettato ⚠️</h1>
        <p className="text-gray-700">{error.message}</p>
        <Button onClick={() => reset()} variant="error">
          Ricarica l'app
        </Button>
      </body>
    </html>
  )
}
