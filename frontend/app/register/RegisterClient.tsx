"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { setToken } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

export function RegisterClient() {
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
      const res = await apiFetch<{ accessToken: string }>("/auth/register", {
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
        <h1 className="text-3xl font-semibold tracking-tight text-white/90">Регистрация</h1>
        <p className="mt-1 text-sm text-white/55">Создайте аккаунт, чтобы бронировать корты.</p>
      </div>
      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Создать аккаунт</CardTitle>
          <CardDescription>Пароль — минимум 6 символов.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm">
              <div className="mb-1 text-white/65">Email</div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm">
              <div className="mb-1 text-white/65">Пароль</div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                placeholder="минимум 6 символов"
              />
            </label>
            <Button className="w-full" disabled={busy} type="submit">
              Создать аккаунт
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-sm text-white/55">
        Уже есть аккаунт?{" "}
        <Link className="font-medium text-lime-200 underline decoration-white/20 underline-offset-4" href="/login">
          Вход
        </Link>
      </div>
    </div>
  );
}

