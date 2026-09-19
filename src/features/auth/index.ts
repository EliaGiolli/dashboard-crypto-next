// Public surface of the auth feature. Other features and routes import from
// here, never from a deep path inside it.
//
// NOTE: this barrel re-exports server-only session helpers, so it must be
// imported from Server Components and Server Functions only. A Client
// Component inside this feature imports its neighbours relatively
// (`../hooks/useAuthForm`), which is the project convention anyway.
export { AuthForm } from './components/AuthForm'
export { AuthNavButton } from './components/AuthNavButton'
export { AuthNav } from './components/AuthNav'
export { LogoutButton } from './components/LogoutButton'
// CardForm is a login-only duplicate of AuthForm; Phase 5 folds it in.
export { CardForm } from './components/CardForm'
export { loginAction, registerAction, logoutAction } from './actions'
export { getSession, getCurrentUser, requireUser } from './lib/session'
export {
  loginSchema,
  registerSchema,
  type LoginSchema,
  type RegisterSchema,
} from './schemas/authSchemas'
export type {
  AuthFormProps,
  AuthFormValues,
  AuthMode,
  AuthResponse,
  AuthNavButtonProps,
} from './types'
