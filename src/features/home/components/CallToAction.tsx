import { AuthForm } from "@/features/auth"

/**
 * The landing page's sign-in card. It used to render `CardForm`, a second,
 * login-only copy of `AuthForm` with its own markup and error styling; the
 * one form now serves both places.
 */
function CallToAction() {
  return (
    <div className="w-full flex justify-center">
      <AuthForm mode="login" />
    </div>
  )
}

export default CallToAction
