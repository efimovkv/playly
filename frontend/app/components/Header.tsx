"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "../lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "./ui/cn";
import { Button } from "./ui/Button";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.2c-4.4 0-8 2.3-8 5.2 0 .3.2.6.6.6h14.8c.4 0 .6-.3.6-.6 0-2.9-3.6-5.2-8-5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 7.5 10 12.5l5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
  }, [pathname]);

  const nav = [
    { href: "/courts", label: "Корты" },
    { href: "/how-it-works", label: "Как это работает" },
    { href: "/me/bookings", label: "Мои брони" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[color:var(--brand-600)]">playly</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && item.href !== "/courts" && pathname.startsWith(item.href)) ||
                (item.href === "/courts" && (pathname === "/courts" || pathname.startsWith("/courts/")));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-slate-900" : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!hasToken ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="h-4 w-4" />
                Войти
              </Link>
              <Link href="/courts">
                <Button size="sm" className="px-5">
                  Забронировать
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                onClick={() => router.push("/me/bookings")}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-50 text-[color:var(--brand-700)]">
                  <UserIcon className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">Аккаунт</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-500" />
              </button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  clearToken();
                  setHasToken(false);
                  router.push("/");
                }}
              >
                Выйти
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

