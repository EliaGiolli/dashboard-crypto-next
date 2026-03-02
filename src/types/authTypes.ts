
// AuthForm.tsx
type AuthMode = "login" | "register"

export interface AuthFormProps {
  mode: AuthMode
}

// actions.ts
export type AuthResponse = {
    error?: string
}