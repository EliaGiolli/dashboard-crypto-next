'use client'

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
import { useRouter } from "next/navigation"
import { formSchema, type FormSchema } from "../../schemas/formSchema"

// External libs
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import MotionButton from "./MotionButton"

export function CardForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormSchema) => {
    console.log("Form submitted:", data)
    router.push("/login") // temporaneo, finché non aggiungi le server actions
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Accedi al tuo account</CardTitle>
        <CardDescription>
          Inserisci la tua email e la tua password per accedere
        </CardDescription>
        <CardAction>
          <Button variant="outline">Accedi</Button>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm underline-offset-4 hover:underline"
              >
                Hai dimenticato la tua password?
              </a>
            </div>
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

          <CardFooter className="p-0">
           <MotionButton> 
              Login
           </MotionButton>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
