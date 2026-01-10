"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { setToken } from "@/app/lib/auth";

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
      <h1 className="text-2xl font-semibold">Вход</h1>
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-3 rounded border bg-white p-4">
        <label className="block text-sm">
          <div className="mb-1 text-gray-700">Email</div>
          <input
            className="w-full rounded border px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <div className="mb-1 text-gray-700">Пароль</div>
          <input
            className="w-full rounded border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          className="w-full rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          Войти
        </button>
      </form>
      <div className="text-sm text-gray-600">
        Нет аккаунта? <Link className="underline" href="/register">Регистрация</Link>
      </div>
    </div>
  );
}

