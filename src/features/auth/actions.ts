'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { APIError } from 'better-auth/api'

import { auth } from '@/core/lib/auth'

import { loginSchema, registerSchema } from './schemas/authSchemas'
import type { AuthResponse } from './types'

/**
 * Server Functions are reachable by a direct POST, not only through the UI, so
 * every one of these re-validates its input with the same zod schema the form
 * used. Client-side validation is a convenience; this is the enforcement.
 *
 * `redirect()` works by throwing, so it always stays OUTSIDE the try/catch —
 * inside, the catch would swallow it and the navigation would never happen.
 */

const GENERIC_ERROR = 'Qualcosa è andato storto. Riprova.'

/** Turns a Better Auth APIError into copy a user can act on. */
function toFormError(error: unknown, fallback: string): string {
  if (!(error instanceof APIError)) {
    return fallback
  }

  switch (error.body?.code) {
    case 'USER_ALREADY_EXISTS':
      return 'Esiste già un account con questa email.'
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_PASSWORD':
      return 'Email o password non corretti.'
    case 'PASSWORD_TOO_SHORT':
      return 'La password deve contenere almeno 6 caratteri.'
    default:
      return error.body?.message ?? fallback
  }
}

// LOGIN
export async function loginAction(data: unknown): Promise<AuthResponse | void> {
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Email o password non corretti.' }
  }

  try {
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: await headers(),
    })
  } catch (error) {
    return { error: toFormError(error, 'Email o password non corretti.') }
  }

  // The root layout's auth slot is rendered per request; this drops the
  // client router cache so the navbar does not keep showing the logged-out
  // control after the navigation. Phase 3 revisits it under cacheComponents.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// REGISTER
export async function registerAction(data: unknown): Promise<AuthResponse | void> {
  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR }
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        // Better Auth requires a name on its User model. The register form
        // only asks for an email, so the local part seeds a display name the
        // user can change later rather than adding a field the design has no
        // room for.
        name: parsed.data.email.split('@')[0],
      },
      headers: await headers(),
    })
  } catch (error) {
    return { error: toFormError(error, GENERIC_ERROR) }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// LOGOUT
export async function logoutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() })

  revalidatePath('/', 'layout')
  redirect('/')
}
