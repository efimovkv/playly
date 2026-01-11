"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "../lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "./ui/cn";
import { Button } from "./ui/Button";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
  }, [pathname]);

  const nav = [
    { href: "/", label: "Корты" },
    { href: "/me/bookings", label: "Мои брони" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-lime-300 text-sm font-semibold text-[#0a1208] shadow-[0_10px_30px_rgba(163,230,53,0.25)]">
              TB
            </span>
            <span className="font-semibold tracking-tight text-white/90">Tennis Booking</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-white/[0.06] text-white/90 ring-1 ring-white/10" : "text-white/65 hover:bg-white/[0.06]",
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
              <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white/90">
                Вход
              </Link>
              <Link href="/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
}

