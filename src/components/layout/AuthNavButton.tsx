'use client'

import Link from 'next/link'
import { LogIn } from 'lucide-react'

import { AuthNavButtonProps } from '@/types/authTypes'

export function AuthNavButton({ isAuthenticated }: AuthNavButtonProps) {
  const href = isAuthenticated ? '/auth/login' : '/auth/register'
  const label = isAuthenticated ? 'Accedi' : 'Registrati'

  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-slate-200 hover:text-violet-700 transition-colors duration-200"
    >
      <LogIn size={30} aria-hidden="true" />
      <span className="hidden md:inline text-sm font-medium">
        {label}
      </span>
    </Link>
  )
}

