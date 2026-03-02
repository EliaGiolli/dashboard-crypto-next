import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"

export async function createUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)

  return isValid ? user : null
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session")
}