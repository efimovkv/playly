"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { getToken } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";

type Booking = {
  id: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  court: { id: string; name: string; location: string };
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await apiFetch<Booking[]>("/bookings/my", { auth: true });
    setItems(res);
  }

  useEffect(() => {
    if (!getToken()) {
      router.push("/login?next=/me/bookings");
      return;
    }
    load().catch((e) => setError(e instanceof Error ? e.message : String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancel(id: string) {
    setError(null);
    setBusyId(id);
    try {
      await apiFetch(`/bookings/${id}`, { method: "DELETE", auth: true });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Мои брони</h1>
          <p className="mt-1 text-sm text-white/55">Здесь можно посмотреть и отменить свои брони.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
      ) : null}

      {!items ? (
        <Card>
          <CardHeader>
            <CardTitle>Загрузка…</CardTitle>
            <CardDescription>Получаем ваши брони.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/[0.06]" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Пока пусто</CardTitle>
            <CardDescription>У вас ещё нет броней. Выберите корт и забронируйте удобный слот.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge tone="neutral">Совет: начните с главной страницы</Badge>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((b) => {
            const start = DateTime.fromISO(b.startAt).setZone("Europe/Moscow");
            const end = DateTime.fromISO(b.endAt).setZone("Europe/Moscow");
            return (
              <Card key={b.id} className="h-full">
                <CardHeader>
                  <CardTitle className="truncate">{b.court.name}</CardTitle>
                  <CardDescription className="truncate">{b.court.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{start.toFormat("dd.MM.yyyy")}</Badge>
                    <Badge tone="neutral">
                      {start.toFormat("HH:mm")}–{end.toFormat("HH:mm")}
                    </Badge>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={busyId === b.id}
                    onClick={() => cancel(b.id)}
                  >
                    Отменить бронь
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

