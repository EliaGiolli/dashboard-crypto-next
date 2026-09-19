import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { logoutAction } = vi.hoisted(() => ({ logoutAction: vi.fn() }))

vi.mock('../actions', () => ({ logoutAction }))

import { AuthNavButton } from './AuthNavButton'

beforeEach(() => {
  logoutAction.mockReset()
})

describe('AuthNavButton', () => {
  it('offers a login link when signed out', () => {
    render(<AuthNavButton isAuthenticated={false} />)

    const link = screen.getByRole('link', { name: /accedi/i })
    expect(link).toHaveAttribute('href', '/auth/login')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  // The regression this locks in: an authenticated user used to be shown
  // "Accedi" pointing at /auth/login, with no way to sign out.
  it('offers a sign-out control when signed in', async () => {
    const user = userEvent.setup()
    render(<AuthNavButton isAuthenticated />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /esci/i }))
    expect(logoutAction).toHaveBeenCalledTimes(1)
  })
})
