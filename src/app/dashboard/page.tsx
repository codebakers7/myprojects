import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DeleteUserDialog } from "@/components/delete-user-dialog";
import { EditUserDialog } from "@/components/edit-user-dialog";

import { createUser, signOut } from "./actions";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
};

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const inputClass =
  "h-11 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-base shadow-inner shadow-slate-200/40 transition-[box-shadow,border-color,background-color] placeholder:text-slate-400 hover:bg-white focus-visible:bg-white focus-visible:shadow-md md:text-[0.95rem]";

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = (await searchParams) ?? {};
  const formError = params.error;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userEmail = session?.user?.email ?? "Unknown";

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email")
    .order("created_at", { ascending: true });

  const rows = (users ?? []) as UserRow[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white px-4 py-14 sm:px-8 lg:py-20">
      <section className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-600/90">
            Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            User Management
          </h1>
          <p className="mt-4 text-pretty text-slate-600 sm:text-lg">
            Welcome to your dashboard — add teammates and browse everyone below.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Signed in as <span className="font-medium text-slate-900">{userEmail}</span>
          </p>
          <form action={signOut} className="w-full sm:w-auto">
            <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
              Log out
            </Button>
          </form>
        </div>

        <div className="mt-12 flex justify-center">
          <form
            action={createUser}
            className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add a user
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Name and email are saved to Supabase.
              </p>
            </div>

            {formError ? (
              <p className="rounded-xl border border-purple-200 bg-yellow-50 px-4 py-3 text-sm leading-relaxed text-red-800">
                {formError}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                placeholder="jane@example.com"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full rounded-xl font-semibold shadow-sm shadow-emerald-900/15"
            >
              Add user
            </Button>
          </form>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-xl font-semibold text-slate-900 sm:text-2xl">
            All users
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-500">
            {rows.length} {rows.length === 1 ? "person" : "people"} in your
            workspace
          </p>

          <div className="mt-8">
            {error ? (
              <p className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
                Could not load users: {error.message}
              </p>
            ) : rows.length === 0 ? (
              <p className="mx-auto max-w-md rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center text-slate-500 shadow-sm">
                No users yet. Add someone with the form above.
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((user) => {
                  const initials = (user.name ?? user.email ?? "?")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <li key={user.id}>
                      <article className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/80">
                        <div className="flex items-start gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-pink-600 text-sm font-bold text-white shadow-sm">
                            {initials.slice(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-slate-900">
                              {user.name ?? "Unknown"}
                            </h3>
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {user.email ?? "—"}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start">
                            <EditUserDialog
                              userId={user.id}
                              userName={user.name}
                              userEmail={user.email}
                            />
                            <DeleteUserDialog
                              userId={user.id}
                              userName={user.name}
                              userEmail={user.email}
                            />
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
