import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// The hook calls Server Functions, which pull in Better Auth and Prisma.
// Those belong to the integration suite; here only the wiring is under test.
const { loginAction, registerAction } = vi.hoisted(() => ({
  loginAction: vi.fn(),
  registerAction: vi.fn(),
}))

vi.mock('../actions', () => ({ loginAction, registerAction }))

import { useAuthForm } from './useAuthForm'
import type { AuthMode } from '../types'

/** Minimal markup so the hook has real inputs to register against. */
function Harness({ mode }: { mode: AuthMode }) {
  const { register, errors, isSubmitting, onSubmit } = useAuthForm(mode)

  return (
    <form onSubmit={onSubmit} noValidate>
      <input aria-label="email" {...register('email')} />
      <input aria-label="password" type="password" {...register('password')} />
      {mode === 'register' && (
        <input
          aria-label="confirm"
          type="password"
          {...register('confirmPassword')}
        />
      )}
      <button type="submit" disabled={isSubmitting}>
        submit
      </button>
      <p data-testid="email-error">{errors.email?.message}</p>
      <p data-testid="password-error">{errors.password?.message}</p>
      <p data-testid="confirm-error">{errors.confirmPassword?.message}</p>
    </form>
  )
}

beforeEach(() => {
  loginAction.mockReset()
  registerAction.mockReset()
})

describe('useAuthForm', () => {
  it('blocks submission and reports a malformed email', async () => {
    const user = userEvent.setup()
    render(<Harness mode="login" />)

    await user.type(screen.getByLabelText('email'), 'not-an-email')
    await user.type(screen.getByLabelText('password'), 'correct-horse')
    await user.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email')
    )
    expect(loginAction).not.toHaveBeenCalled()
  })

  it('blocks submission when the password is too short', async () => {
    const user = userEvent.setup()
    render(<Harness mode="login" />)

    await user.type(screen.getByLabelText('email'), 'user@example.com')
    await user.type(screen.getByLabelText('password'), 'short')
    await user.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByTestId('password-error')).toHaveTextContent(
        'at least 6 characters'
      )
    )
    expect(loginAction).not.toHaveBeenCalled()
  })

  it('calls loginAction with the validated values', async () => {
    const user = userEvent.setup()
    render(<Harness mode="login" />)

    await user.type(screen.getByLabelText('email'), 'user@example.com')
    await user.type(screen.getByLabelText('password'), 'correct-horse')
    await user.click(screen.getByRole('button'))

    await waitFor(() => expect(loginAction).toHaveBeenCalledTimes(1))
    expect(loginAction).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'correct-horse',
    })
  })

  it('rejects a register submission whose passwords do not match', async () => {
    const user = userEvent.setup()
    render(<Harness mode="register" />)

    await user.type(screen.getByLabelText('email'), 'user@example.com')
    await user.type(screen.getByLabelText('password'), 'correct-horse')
    await user.type(screen.getByLabelText('confirm'), 'different-horse')
    await user.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByTestId('confirm-error')).toHaveTextContent(
        'Passwords do not match'
      )
    )
    expect(registerAction).not.toHaveBeenCalled()
  })

  it('maps an error returned by the Server Function onto the password field', async () => {
    loginAction.mockResolvedValue({ error: 'Email o password non corretti.' })

    const user = userEvent.setup()
    render(<Harness mode="login" />)

    await user.type(screen.getByLabelText('email'), 'user@example.com')
    await user.type(screen.getByLabelText('password'), 'correct-horse')
    await user.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByTestId('password-error')).toHaveTextContent(
        'Email o password non corretti.'
      )
    )
  })
})
