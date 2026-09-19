import Link from 'next/link'
import { LogIn } from 'lucide-react'

import { LogoutButton } from './LogoutButton'
import type { AuthNavButtonProps } from '../types'

/**
 * The navbar's auth control.
 *
 * Not a client component: signed out it is a plain <Link>, and signed in it
 * renders `LogoutButton`, which is the only part that needs interactivity.
 *
 * The condition used to be inverted — an authenticated user was shown
 * "Accedi" pointing at the login page, with no way to sign out at all.
 */
export function AuthNavButton({ isAuthenticated }: AuthNavButtonProps) {
  if (isAuthenticated) {
    return <LogoutButton />
  }

  return (
    <Link
      href="/auth/login"
      className="flex items-center gap-2 text-slate-200 hover:text-violet-700 transition-colors duration-200"
    >
      <LogIn size={30} aria-hidden="true" />
      <span className="hidden md:inline text-sm font-medium">Accedi</span>
    </Link>
  )
}
