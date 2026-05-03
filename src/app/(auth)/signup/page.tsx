import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams?: { error?: string };
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  const error = searchParams?.error;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
        <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign up with your email and password to get started.
        </p>

        {error ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <form action={signupWithEmailPassword} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full"
              placeholder="Choose a secure password"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Sign up
          </Button>
        </form>
      </div>
    </main>
  );
}

async function signupWithEmailPassword(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(
      `/auth/signup?error=${encodeURIComponent("Email and password are required.")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/signin");
}
