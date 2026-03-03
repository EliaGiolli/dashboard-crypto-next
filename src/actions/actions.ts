'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import  {revalidatePath} from "next/cache";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { type AuthResponse } from "@/types/authTypes";

// LOGIN ACTION
export async function loginAction(data: { email:string, password: string }): Promise<AuthResponse | void> {

  // - check database
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return { error: "Utente non trovato" };
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    return { error: "Password errata" };
  }
  
  // - set cookie / session
  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  console.log("Login server:", data);
  revalidatePath("/dashboard");
  redirect("/dashboard")
}

// REGISTER ACTION
export async function registerAction(data: { email: string, password: string}): Promise<AuthResponse | void> {
  // - check database
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}