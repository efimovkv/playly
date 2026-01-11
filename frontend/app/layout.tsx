import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Бронирование теннисных кортов",
  description: "MVP сервиса бронирования теннисных кортов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 app-bg" />
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 app-noise" />
        <Header />
        <div className="min-h-[calc(100vh-56px)]">
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-5xl px-4 pb-10 pt-2 text-xs text-white/45">
            Москва • График кортов 07:00–00:00 • Бронь максимум за 24 часа
          </footer>
        </div>
      </body>
    </html>
  );
}
