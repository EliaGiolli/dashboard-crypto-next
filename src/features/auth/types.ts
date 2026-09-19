
// AuthForm.tsx
export type AuthMode = "login" | "register"

export interface AuthFormProps {
  mode: AuthMode
}

// actions.ts — Server Functions return an error message for the form to show,
// or nothing at all (success ends in a redirect).
export type AuthResponse = {
    error?: string
}

export type AuthNavButtonProps = {
  isAuthenticated: boolean
}

/**
 * The union of every field the auth forms can render. `confirmPassword` is
 * optional because the login form does not have it; `useAuthForm` swaps the
 * zod resolver per mode, which is what actually enforces its presence.
 */
export type AuthFormValues = {
  email: string
  password: string
  confirmPassword?: string
}
