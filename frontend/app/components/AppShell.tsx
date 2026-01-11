"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";

function shouldHideChrome(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/register");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = shouldHideChrome(pathname);

  return (
    <>
      {hideChrome ? null : <Header />}
      <div className={hideChrome ? "min-h-screen" : "min-h-[calc(100vh-64px)]"}>
        {children}
      </div>
      {hideChrome ? null : (
        <footer className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 text-xs text-slate-500">
            Москва • График кортов 07:00–00:00 • Бронь максимум за 24 часа
          </div>
        </footer>
      )}
    </>
  );
}

