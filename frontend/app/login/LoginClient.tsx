"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { setToken } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

export function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = useMemo(() => search.get("next") || "/", [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await apiFetch<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(res.accessToken);
      router.push(next);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : String(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Вход</h1>
        <p className="mt-1 text-sm text-slate-600">Войдите, чтобы бронировать слоты и управлять бронями.</p>
      </div>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Данные для входа</CardTitle>
          <CardDescription>Email + пароль (JWT).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm">
              <div className="mb-1 text-slate-700">Email</div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm">
              <div className="mb-1 text-slate-700">Пароль</div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>
            <Button className="w-full" disabled={busy} type="submit">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-sm text-gray-600">
        Нет аккаунта?{" "}
        <Link className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4" href="/register">
          Регистрация
        </Link>
      </div>
    </div>
  );
}

