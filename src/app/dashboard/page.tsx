import { requireUser } from '@/features/auth'

/**
 * The route both auth Server Functions redirect to. It did not exist before
 * Phase 2, so every successful login and registration landed on a 404.
 *
 * `requireUser()` is the real access check; `src/proxy.ts` only does the
 * optimistic cookie test in front of it.
 */
export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-violet-400">
          La tua dashboard
        </h1>
        <p className="text-slate-300">
          Bentornato, <span className="font-semibold">{user.name}</span>.
        </p>
        <p className="text-slate-400">
          Qui arriveranno le tue crypto preferite: la watchlist salvata sul
          server sostituisce i preferiti locali nella prossima fase.
        </p>
      </div>
    </main>
  )
}
