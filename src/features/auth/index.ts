// Public surface of the auth feature. Other features and routes import from
// here, never from a deep path inside it.
export { AuthForm } from './components/AuthForm'
export { AuthNavButton } from './components/AuthNavButton'
export { AuthNav } from './components/AuthNav'
// CardForm is a login-only duplicate of AuthForm; Phase 5 folds it in.
export { CardForm } from './components/CardForm'
export { loginAction, registerAction } from './actions'
export {
  loginSchema,
  registerSchema,
  type LoginSchema,
  type RegisterSchema,
} from './schemas/authSchemas'
export type { AuthFormProps, AuthResponse, AuthNavButtonProps } from './types'
