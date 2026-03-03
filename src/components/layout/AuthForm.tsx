"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, registerSchema, type LoginSchema, type RegisterSchema } from "../../schemas/authSchemas"
import { loginAction, registerAction } from "../../actions/actions"

import { AuthFormProps } from "@/types/authTypes"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
      <h2 className="text-2xl font-bold">
        {isRegister ? "Create account" : "Login"}
      </h2>

      <Input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="border p-2 rounded"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}

      <Input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="border p-2 rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message as string}</p>
      )}

      {isRegister && (
        <>
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            className="border p-2 rounded"
          />
          {"confirmPassword" in errors && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message as string}
            </p>
          )}
        </>
      )}

      <Button
        type="submit"
        className="bg-black text-white p-2 rounded"
      >
        {isRegister ? "Register" : "Login"}
      </Button>
    </form>
  )
}