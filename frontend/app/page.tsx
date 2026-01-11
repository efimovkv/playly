"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Badge } from "./components/ui/Badge";

type Court = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
};

export default function Home() {
  const [courts, setCourts] = useState<Court[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiFetch<Court[]>("/courts")
      .then(setCourts)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const filtered = useMemo(() => {
    if (!courts) return null;
    const q = query.trim().toLowerCase();
    if (!q) return courts;
    return courts.filter((c) => `${c.name} ${c.location}`.toLowerCase().includes(q));
  }, [courts, query]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white/90">Играй сегодня.</h1>
            <p className="mt-1 text-sm text-white/55">
              Выберите корт, посмотрите свободные слоты и забронируйте на 1 час.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neutral">Москва</Badge>
              <Badge tone="neutral">07:00–00:00</Badge>
              <Badge tone="neutral">+24 часа вперёд</Badge>
            </div>
          </div>
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Поиск по названию или локации…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {!filtered ? (
        <div className="text-sm text-white/55">Загрузка…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/courts/${c.id}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <CardTitle className="leading-6">{c.name}</CardTitle>
                  <CardDescription>{c.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Слоты на сегодня/завтра</span>
                    <span className="text-sm font-medium text-lime-200">Открыть →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
