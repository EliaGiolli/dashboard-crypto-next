import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ToggleFavoriteResult } from '../types'

// The Server Function pulls in Prisma and Better Auth; the integration suite
// covers it. Here only the optimistic wiring is under test.
const { toggleFavorite } = vi.hoisted(() => ({ toggleFavorite: vi.fn() }))

vi.mock('../actions', () => ({ toggleFavorite }))

import { FavoriteButton } from './FavoriteButton'

/** A promise the test resolves by hand, to observe the pending state. */
function deferred() {
  let resolve!: (value: ToggleFavoriteResult) => void
  const promise = new Promise<ToggleFavoriteResult>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

beforeEach(() => {
  toggleFavorite.mockReset()
})

describe('FavoriteButton', () => {
  it('names the coin for screen readers, not just the action', () => {
    render(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" isFavorite={false} />)

    expect(
      screen.getByRole('button', { name: /aggiungi ai preferiti: bitcoin/i })
    ).toBeInTheDocument()
  })

  it('flips immediately, before the Server Function answers', async () => {
    const pending = deferred()
    toggleFavorite.mockReturnValue(pending.promise)

    const user = userEvent.setup()
    render(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" isFavorite={false} />)

    await user.click(screen.getByRole('button'))

    expect(toggleFavorite).toHaveBeenCalledWith('bitcoin')
    expect(screen.getByRole('button')).toHaveTextContent('Nei preferiti')
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')

    pending.resolve({ ok: true, isFavorite: true })

    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
    )
  })

  it('reverts and explains itself when the Server Function fails', async () => {
    toggleFavorite.mockResolvedValue({
      ok: false,
      error: 'Accedi per salvare i preferiti.',
    })

    const user = userEvent.setup()
    render(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" isFavorite={false} />)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Accedi per salvare i preferiti.'
    )
    // The prop never changed, so once the transition settles the optimistic
    // value falls back to it.
    expect(screen.getByRole('button')).toHaveTextContent('Aggiungi ai preferiti')
  })

  it('follows the server once the prop catches up', async () => {
    toggleFavorite.mockResolvedValue({ ok: true, isFavorite: false })

    const user = userEvent.setup()
    const { rerender } = render(
      <FavoriteButton coinId="bitcoin" coinName="Bitcoin" isFavorite />
    )

    await user.click(screen.getByRole('button'))

    // What updateTag's re-render does in the real app.
    rerender(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" isFavorite={false} />)

    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveTextContent('Aggiungi ai preferiti')
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
