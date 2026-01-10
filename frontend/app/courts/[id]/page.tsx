"use client";

import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { getToken } from "@/app/lib/auth";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { cn } from "@/app/components/ui/cn";

type Court = {
  id: string;
  name: string;
  location: string;
};

type AvailabilityResponse = {
  date: string;
  slots: Array<{
    startAt: string;
    endAt: string;
    label: string;
    isAvailable: boolean;
  }>;
};

export default function CourtPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const courtId = useMemo(() => {
    const raw = (params as any)?.id as string | string[] | undefined;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] ?? "" : raw;
  }, [params]);

  const [court, setCourt] = useState<Court | null>(null);
  const [date, setDate] = useState<string>(() => DateTime.now().setZone("Europe/Moscow").toISODate()!);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const today = useMemo(() => DateTime.now().setZone("Europe/Moscow").toISODate()!, []);
  const tomorrow = useMemo(
    () => DateTime.now().setZone("Europe/Moscow").plus({ days: 1 }).toISODate()!,
    [],
  );

  useEffect(() => {
    if (!courtId) return;
    apiFetch<Court[]>("/courts")
      .then((list) => {
        const found = list.find((c) => c.id === courtId) ?? null;
        setCourt(found);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [courtId]);

  useEffect(() => {
    if (!courtId) return;
    setError(null);
    setInfo(null);
    apiFetch<AvailabilityResponse>(`/courts/${courtId}/availability?date=${encodeURIComponent(date)}`)
      .then(setAvailability)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [courtId, date]);

  async function book(startAt: string) {
    setError(null);
    setInfo(null);

    const token = getToken();
    if (!token) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setBusy(true);
    try {
      await apiFetch(`/bookings`, {
        method: "POST",
        auth: true,
        body: { courtId, startAt },
      });
      setInfo("Бронь создана.");
      const next = await apiFetch<AvailabilityResponse>(
        `/courts/${courtId}/availability?date=${encodeURIComponent(date)}`,
      );
      setAvailability(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{court ? court.name : "Корт"}</h1>
        <p className="text-sm text-slate-600">{court ? court.location : `ID: ${courtId || "—"}`}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge tone="neutral">07:00–00:00</Badge>
          <Badge tone="neutral">1 час</Badge>
          <Badge tone="neutral">Макс. 24 часа вперёд</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Выбор даты</CardTitle>
            <CardDescription>Доступны сегодня и завтра.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                className={cn(
                  "h-10 rounded-xl text-sm font-medium ring-1 transition-colors",
                  date === today
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                )}
                onClick={() => setDate(today)}
              >
                Сегодня
              </button>
              <button
                className={cn(
                  "h-10 rounded-xl text-sm font-medium ring-1 transition-colors",
                  date === tomorrow
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                )}
                onClick={() => setDate(tomorrow)}
              >
                Завтра
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
              Слоты формируются по часовым интервалам. Последний старт — <b>23:00</b>.
            </div>
          </CardContent>
        </Card>

      {!courtId ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Не удалось определить ID корта из URL.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}
      {info ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{info}</div>
      ) : null}

      {!availability ? (
        <Card>
          <CardHeader>
            <CardTitle>Слоты</CardTitle>
            <CardDescription>Загрузка…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Слоты на {availability.date}</CardTitle>
              <CardDescription>Нажмите “Забронировать”, чтобы создать бронь на 1 час.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="success">Свободно</Badge>
              <Badge tone="neutral">Занято</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {availability.slots.map((s) => (
                <div key={s.startAt} className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{s.label}</div>
                    <div className="text-[11px] text-slate-600">1 час</div>
                  </div>
                  {s.isAvailable ? (
                    <Button size="sm" disabled={busy} onClick={() => book(s.startAt)}>
                      + 
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">—</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

