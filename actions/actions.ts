'use server';

import { redirect } from "next/navigation";

export async function FormLoginAction(data: { email:string, password: string}) {
  // qui fai:
  // - check database
  // - chiamata API
  // - set cookie / session

  console.log("Login server:", data)

  redirect("/dashboard")
}