"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "./lib/api";

type Court = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
};

export default function Home() {
  const [courts, setCourts] = useState<Court[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Court[]>("/courts")
      .then(setCourts)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Корты в Москве</h1>
        <p className="text-sm text-gray-600">Выберите корт, чтобы посмотреть слоты и забронировать.</p>
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!courts ? (
        <div className="text-sm text-gray-600">Загрузка…</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {courts.map((c) => (
            <Link
              key={c.id}
              href={`/courts/${c.id}`}
              className="rounded border bg-white p-4 hover:border-gray-400"
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-600">{c.location}</div>
              <div className="mt-2 text-sm text-gray-900">Открыто: 07:00–00:00</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
