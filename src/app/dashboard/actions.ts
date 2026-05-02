"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function errQuery(msg: string) {
  return `?error=${encodeURIComponent(msg)}`;
}

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    redirect(`/dashboard${errQuery("Name and email are required.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("users").insert({ name, email });

  if (error) {
    redirect(`/dashboard${errQuery(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
