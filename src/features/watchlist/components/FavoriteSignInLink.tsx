import Link from 'next/link'

import { buttonVariants } from '@/shared/ui/button-variants'

import type { FavoriteSignInLinkProps } from '../types'

/**
 * What a signed-out visitor sees in place of the star. Favorites belong to an
 * account now, so there is nothing to toggle without one.
 *
 * A server-rendered <Link> styled with `buttonVariants()`: navigation is a
 * link, not a button, and it needs no client JavaScript.
 */
export function FavoriteSignInLink({ coinName }: FavoriteSignInLinkProps) {
  return (
    <Link href="/auth/login" className={buttonVariants({ variant: 'outline' })}>
      Accedi per salvare
      <span className="sr-only"> {coinName} nei preferiti</span>
    </Link>
  )
}
