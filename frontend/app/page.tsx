import { HeroSearch } from "./components/HeroSearch";

export default function Home() {
  return (
    <div className="hero-plus-pattern">
      <div className="site-container py-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-[color:var(--brand-700)] ring-1 ring-emerald-100">
            <span className="h-2 w-2 rounded-full bg-[color:var(--brand-600)]" />
            Более 200 кортов по всему городу
          </div>

          <h1 className="mt-8 text-balance text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Бронируйте корты{" "}
            <span className="text-[color:var(--brand-600)]">за минуту</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-slate-600">
            Теннис, падел, бадминтон — выберите спорт, время и место. <br className="hidden sm:block" />
            Мгновенное подтверждение, никаких звонков.
          </p>

          <div className="mt-10">
            <HeroSearch />
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-900">200+</div>
              <div className="mt-1 text-sm text-slate-600">Кортов</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-900">15K+</div>
              <div className="mt-1 text-sm text-slate-600">Бронирований</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-900">4.9</div>
              <div className="mt-1 text-sm text-slate-600">Рейтинг</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
