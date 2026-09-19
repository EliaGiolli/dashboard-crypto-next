'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'

import { logoutAction } from '../actions'

/**
 * The only client island in the navbar's auth slot: it needs an onClick.
 * The sign-out itself is a Server Function, so the session row is destroyed
 * server-side rather than by clearing a cookie in the browser.
 */
export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => { await logoutAction() })}
      className="flex items-center gap-2 text-slate-200 hover:text-violet-700 transition-colors duration-200 disabled:opacity-60"
    >
      <LogOut size={30} aria-hidden="true" />
      <span className="hidden md:inline text-sm font-medium">
        {isPending ? 'Uscita...' : 'Esci'}
      </span>
    </button>
  )
}
