import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h1 className="text-4xl font-bold text-violet-600">404 — Pagina non trovata 🕳️</h1>
      <p className="text-gray-600">Oops! La pagina che stai cercando non esiste.</p>
      <Button asChild variant="default">
        <Link href="/">Torna alla home</Link>
      </Button>
    </div>
  )
}
