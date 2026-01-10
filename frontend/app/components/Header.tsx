"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "../lib/auth";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
  }, [pathname]);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Бронирование кортов
          </Link>
          <Link href="/" className="text-sm text-gray-700 hover:text-black">
            Корты
          </Link>
          <Link href="/me/bookings" className="text-sm text-gray-700 hover:text-black">
            Мои брони
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!hasToken ? (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-black">
                Вход
              </Link>
              <Link href="/register" className="text-sm text-gray-700 hover:text-black">
                Регистрация
              </Link>
            </>
          ) : (
            <button
              className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-black"
              onClick={() => {
                clearToken();
                setHasToken(false);
                router.push("/");
              }}
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

