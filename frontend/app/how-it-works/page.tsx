export default function HowItWorksPage() {
  return (
    <div className="hero-plus-pattern">
      <div className="site-container py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Как это работает</h1>
          <p className="mt-3 text-lg text-slate-600">
            Вы выбираете корт, дату и время — сервис показывает доступные слоты и вы подтверждаете бронь за пару кликов.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="surface rounded-3xl p-5">
              <div className="text-sm font-semibold text-slate-900">1) Найдите корт</div>
              <div className="mt-2 text-sm text-slate-600">По названию, адресу или фильтрам.</div>
            </div>
            <div className="surface rounded-3xl p-5">
              <div className="text-sm font-semibold text-slate-900">2) Выберите слот</div>
              <div className="mt-2 text-sm text-slate-600">Свободные интервалы на сегодня и завтра.</div>
            </div>
            <div className="surface rounded-3xl p-5">
              <div className="text-sm font-semibold text-slate-900">3) Забронируйте</div>
              <div className="mt-2 text-sm text-slate-600">Мгновенное подтверждение без звонков.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

