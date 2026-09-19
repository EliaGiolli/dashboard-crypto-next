"use client"

import Link from "next/link"

import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"

import { useAuthForm } from "../hooks/useAuthForm"
import type { AuthFormProps } from "../types"

/**
 * Presentational: every decision (schema, Server Function, error mapping)
 * lives in `useAuthForm`. This file is markup.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const { isRegister, register, errors, isSubmitting, onSubmit } =
    useAuthForm(mode)

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
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
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
                {errors.email.message}
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
                {errors.password.message}
              </p>
            )}
          </div>

          {isRegister && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Conferma password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "auth-confirm-password-error"
                    : undefined
                }
              />
              {errors.confirmPassword && (
                <p
                  id="auth-confirm-password-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isRegister
                ? "Registrazione in corso..."
                : "Accesso in corso..."
              : isRegister
                ? "Registrati"
                : "Accedi"}
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
