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

//Internal imports
import { useRouter } from "next/router"
import { type FormSchema, formSchema } from "../../schemas/formSchema";

//External libs
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'motion/react';

export function CardForm() {

  const {
      register, 
      handleSubmit, 
      formState: { errors, isSubmitted }
    } = useForm<FormSchema>({ resolver: zodResolver(formSchema) }
  );

  const onSubmit = () => {
    console.log('form submitted')
  }

  const MotionButton = motion(Button);
  const router = useRouter();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Accedi al tuo account</CardTitle>
        <CardDescription>
          Inserisci la tua email e la tua password per accedere
        </CardDescription>
        <CardAction>
          <Button variant="link">Accedi</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "il campo è obbligatorio",
                  minLength: { value: 3, message: "Deve contenere almeno 3 caratteri" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Inserisci un'email valida"
                  }
                })}
                placeholder="m@example.com"
              />
              { errors.email && (
                <p id="error-email" role="alert" className="bg-red-100 text-red-600 text-2xl p-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Hai dimenticato la tua password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                {...register("password", {
                    required: "il campo è obbligatorio",
                    minLength: { value: 8, message: "il campo non può essere vuoto" },
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Inserisci una password valida"
                    }
              })} />
              { errors.password && (
                <p id="error-password" role="alert" className="bg-red-100 text-red-600 text-2xl p-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="w-full">
        <MotionButton 
          type="submit" 
          onClick={() => router.push('/login')}
          className="w-1/2"
          whileHover={{ scale: 1 }}
          whileFocus={{ scale: 1 }}
          >
          Login
        </MotionButton>
      </CardFooter>
    </Card>
  )
}
