'use client'

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginAction, registerAction } from '../actions'
import { loginSchema, registerSchema } from '../schemas/authSchemas'
import type { AuthFormValues, AuthMode } from '../types'

/**
 * All of the auth form's behaviour: which schema validates it, which Server
 * Function it calls, and how a server error lands back on a field.
 *
 * Keeping it here leaves `AuthForm` as JSX and props, and makes the validation
 * rules unit-testable with `renderHook` without rendering a card.
 *
 * Pending state comes from RHF's `formState.isSubmitting`, not `useFormStatus`:
 * that hook reads the nearest enclosing `<form action={...}>`, and this form
 * deliberately has no `action` prop — it submits through `onSubmit`.
 */
export function useAuthForm(mode: AuthMode) {
  const isRegister = mode === 'register'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(
      isRegister ? registerSchema : loginSchema
    ) as Resolver<AuthFormValues>,
    defaultValues: isRegister
      ? { email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    const action = isRegister ? registerAction : loginAction
    const response = await action(values)

    // A successful call ends in a redirect and never returns, so anything that
    // comes back is a failure to show on the password field.
    if (response?.error) {
      setError('password', { message: response.error })
    }
  })

  return { isRegister, register, errors, isSubmitting, onSubmit }
}
