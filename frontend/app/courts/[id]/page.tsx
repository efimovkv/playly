"use client";

import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { getToken } from "@/app/lib/auth";

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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{court ? court.name : "Корт"}</h1>
        <p className="text-sm text-gray-600">{court ? court.location : `ID: ${courtId || "—"}`}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-700">Дата:</span>
        <button
          className={`rounded px-3 py-1.5 text-sm ${
            date === today ? "bg-gray-900 text-white" : "border bg-white hover:border-gray-400"
          }`}
          onClick={() => setDate(today)}
        >
          Сегодня
        </button>
        <button
          className={`rounded px-3 py-1.5 text-sm ${
            date === tomorrow ? "bg-gray-900 text-white" : "border bg-white hover:border-gray-400"
          }`}
          onClick={() => setDate(tomorrow)}
        >
          Завтра
        </button>
        <span className="ml-auto text-sm text-gray-600">График: 07:00–00:00</span>
      </div>

      {!courtId ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Не удалось определить ID корта из URL.
        </div>
      ) : null}

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}
      {info ? (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{info}</div>
      ) : null}

      {!availability ? (
        <div className="text-sm text-gray-600">Загрузка слотов…</div>
      ) : (
        <div className="rounded border bg-white">
          <div className="border-b px-4 py-2 text-sm font-medium">Слоты на {availability.date}</div>
          <ul className="divide-y">
            {availability.slots.map((s) => (
              <li key={s.startAt} className="flex items-center justify-between px-4 py-2">
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-gray-600">Длительность: 1 час</div>
                </div>
                {s.isAvailable ? (
                  <button
                    className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-black disabled:opacity-50"
                    disabled={busy}
                    onClick={() => book(s.startAt)}
                  >
                    Забронировать
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Занято</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Можно бронировать максимум за 24 часа вперёд.
      </div>
    </div>
  );
}

