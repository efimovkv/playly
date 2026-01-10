"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { getToken } from "@/app/lib/auth";

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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Мои брони</h1>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!items ? (
        <div className="text-sm text-gray-600">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="rounded border bg-white p-4 text-sm text-gray-700">У вас пока нет броней.</div>
      ) : (
        <div className="rounded border bg-white">
          <ul className="divide-y">
            {items.map((b) => {
              const start = DateTime.fromISO(b.startAt).setZone("Europe/Moscow");
              const end = DateTime.fromISO(b.endAt).setZone("Europe/Moscow");
              return (
                <li key={b.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{b.court.name}</div>
                    <div className="truncate text-sm text-gray-600">{b.court.location}</div>
                    <div className="text-sm text-gray-900">
                      {start.toFormat("dd.MM.yyyy HH:mm")}–{end.toFormat("HH:mm")}
                    </div>
                  </div>
                  <button
                    className="rounded border px-3 py-1.5 text-sm hover:border-gray-400 disabled:opacity-50"
                    disabled={busyId === b.id}
                    onClick={() => cancel(b.id)}
                  >
                    Отменить
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

