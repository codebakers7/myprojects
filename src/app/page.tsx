import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          My First Next.js Project
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          A simple starter landing page created by me.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-emerald-600 text-white hover:bg-emerald-900"
        >
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </section>
    </main>
  );
}