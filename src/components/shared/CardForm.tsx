'use client'

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Internal imports
import { loginSchema, type LoginSchema } from "../../schemas/authSchemas"

// External libs
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import MotionButton from "./MotionButton"
import { loginAction } from "../../actions/actions"

export function CardForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true)
    const response = await loginAction(data)
    setIsSubmitting(false)

    if (response?.error) {
      setError("password", { message: response.error })
    }
  }

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
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
            <Input id="password" type="password" {...register("password")} />
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
