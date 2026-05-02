export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white px-4 py-14 sm:px-8 lg:py-20">
      <section className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-slate-200/90" />
          <div className="mx-auto mt-4 h-12 w-3/5 max-w-sm animate-pulse rounded-lg bg-slate-200 sm:h-14" />
          <div className="mx-auto mt-4 h-5 w-full max-w-md animate-pulse rounded-md bg-slate-200/80" />
          <div className="mx-auto mt-2 h-5 max-w-xs animate-pulse rounded-md bg-slate-100" />
        </header>

        <div className="mt-12 flex justify-center">
          <div className="h-[340px] w-full max-w-md animate-pulse rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/50" />
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto h-7 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li
                key={i}
                className="h-[108px] animate-pulse rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30"
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
