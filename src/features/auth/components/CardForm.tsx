'use client'

import Link from "next/link"

import { Button } from "@/shared/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import MotionButton from "@/shared/ui/MotionButton"

import { useAuthForm } from "../hooks/useAuthForm"

/**
 * Login-only card used by the landing page's call to action.
 *
 * It now shares `useAuthForm` with `AuthForm` instead of keeping a second copy
 * of the RHF wiring and its own `isSubmitting` state. Phase 5 folds the whole
 * component into `<AuthForm mode="login" />`.
 */
export function CardForm() {
  const { register, errors, isSubmitting, onSubmit } = useAuthForm("login")

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Accedi al tuo account</CardTitle>
        <CardDescription>
          Inserisci la tua email e la tua password per accedere
        </CardDescription>
        <CardAction>
          <Link href="/auth/register">
            <Button variant="outline">Non hai un account? Registrati</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <p
                id="error-email"
                role="alert"
                className="bg-red-100 text-red-600 text-sm p-2 rounded-md"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "error-password" : undefined}
            />
            {errors.password && (
              <p
                id="error-password"
                role="alert"
                className="bg-red-100 text-red-600 text-sm p-2 rounded-md"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <CardFooter className="flex flex-col items-stretch gap-3 p-0">
            <MotionButton disabled={isSubmitting}>
              {isSubmitting ? "Accesso in corso..." : "Login"}
            </MotionButton>
            <p className="text-sm text-center text-slate-600">
              Oppure usa il{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 hover:text-slate-900"
              >
                form completo di login
              </Link>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
