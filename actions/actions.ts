'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function FormLoginAction(data: { email:string, password: string}) {
  // qui fai:
  // - check database
  // - chiamata API
  const users = await prisma.User.findMany();
  // - set cookie / session

  console.log("Login server:", data)

  redirect("/dashboard")
}