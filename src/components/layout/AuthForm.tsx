"use client"

import Link from "next/link"

import { useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, registerSchema, type LoginSchema, type RegisterSchema } from "../../schemas/authSchemas"
import { loginAction, registerAction } from "../../actions/actions"

import { AuthFormProps } from "@/types/authTypes"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card"
import { Label } from "../ui/label"

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register"

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema | RegisterSchema>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  })

  const onSubmit = async (data: RegisterSchema | LoginSchema) => {
    const action = isRegister ? registerAction : loginAction
    const response = await action(data as RegisterSchema | LoginSchema)

    if (response && "error" in response && response.error) {
      setError("password", {
        message: response.error,
      })
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isRegister ? "Crea il tuo account" : "Accedi al tuo account"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Registrati per iniziare a usare la tua dashboard crypto personalizzata."
            : "Inserisci le tue credenziali per accedere alla tua dashboard."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "auth-email-error" : undefined}
            />
            {errors.email && (
              <p
                id="auth-email-error"
                role="alert"
                className="text-sm text-red-600"
              >
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "auth-password-error" : undefined
              }
            />
            {errors.password && (
              <p
                id="auth-password-error"
                role="alert"
                className="text-sm text-red-600"
              >
                {errors.password.message as string}
              </p>
            )}
          </div>

          {isRegister && (
            (() => {
              const registerErrors = errors as FieldErrors<RegisterSchema>

              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Conferma password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    aria-invalid={!!registerErrors.confirmPassword}
                    aria-describedby={
                      registerErrors.confirmPassword
                        ? "auth-confirm-password-error"
                        : undefined
                    }
                  />
                  {registerErrors.confirmPassword && (
                    <p
                      id="auth-confirm-password-error"
                      role="alert"
                      className="text-sm text-red-600"
                    >
                      {registerErrors.confirmPassword.message as string}
                    </p>
                  )}
                </div>
              )
            })()
          )}

          <Button type="submit" className="mt-2 w-full">
            {isRegister ? "Registrati" : "Accedi"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        {isRegister ? (
          <p className="text-sm text-slate-600">
            Hai già un account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold underline underline-offset-4 hover:text-slate-900"
            >
              Vai al login
            </Link>
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Non hai ancora un account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold underline underline-offset-4 hover:text-slate-900"
            >
              Registrati
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}