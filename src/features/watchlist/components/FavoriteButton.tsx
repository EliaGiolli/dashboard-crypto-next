'use client'

import { useOptimistic, useState, useTransition } from 'react'

import { Button } from '@/shared/ui/button'

import { toggleFavorite } from '../actions'
import type { FavoriteButtonProps } from '../types'

/**
 * The star flips the moment it is pressed; the Server Function catches up.
 *
 * `useOptimistic` holds the flipped value only while the transition is
 * pending. When it settles the value falls back to the `isFavorite` prop —
 * which `updateTag` in the Server Function has already refreshed on success,
 * and which is unchanged on failure. So a failed toggle reverts by itself;
 * all this component adds is the error message.
 *
 * It used to read and write a Zustand store persisted to `localStorage`: the
 * favorites never left the browser and the `Watchlist` table sat unused.
 */
export function FavoriteButton({
  coinId,
  coinName,
  isFavorite,
}: FavoriteButtonProps) {
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    setError(null)

    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite)

      const result = await toggleFavorite(coinId)

      if (!result.ok) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        type="button"
        variant={optimisticFavorite ? 'favorites' : 'default'}
        onClick={handleClick}
        aria-busy={isPending}
      >
        {optimisticFavorite ? 'Nei preferiti ⭐' : 'Aggiungi ai preferiti'}
        {/* The visible text alone is identical on every row of the table. */}
        <span className="sr-only">: {coinName}</span>
      </Button>
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
