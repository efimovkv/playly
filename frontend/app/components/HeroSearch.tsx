"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { cn } from "./ui/cn";

const sports = [
  { value: "all", label: "Вид спорта" },
  { value: "tennis", label: "Теннис" },
  { value: "padel", label: "Падел" },
  { value: "badminton", label: "Бадминтон" },
  { value: "volleyball", label: "Волейбол" },
  { value: "basketball", label: "Баскетбол" },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center text-slate-500">
      {children}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M4.5 9h15M6.5 6h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [sport, setSport] = useState("all");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const canSubmit = useMemo(() => Boolean(date || time || sport !== "all"), [date, time, sport]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sport !== "all") params.set("sport", sport);
    if (date) params.set("date", date);
    if (time) params.set("time", time);
    const qs = params.toString();
    router.push(`/courts${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface mx-auto w-full max-w-4xl rounded-[28px] p-3"
    >
      <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_160px] md:items-center">
        <div className={cn("flex items-center rounded-2xl bg-slate-50 ring-1 ring-black/10")}>
          <Icon>
            <SearchIcon />
          </Icon>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="h-11 w-full bg-transparent pr-4 text-sm font-semibold text-slate-700 outline-none"
            aria-label="Вид спорта"
          >
            {sports.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center rounded-2xl bg-slate-50 ring-1 ring-black/10">
          <Icon>
            <CalendarIcon />
          </Icon>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full bg-transparent pr-4 text-sm font-semibold text-slate-700 outline-none"
            aria-label="Дата"
          />
        </div>

        <div className="flex items-center rounded-2xl bg-slate-50 ring-1 ring-black/10">
          <Icon>
            <ClockIcon />
          </Icon>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-11 w-full bg-transparent pr-4 text-sm font-semibold text-slate-700 outline-none"
            aria-label="Время"
          />
        </div>

        <Button type="submit" className="h-11 w-full rounded-2xl px-6" disabled={!canSubmit}>
          Найти
        </Button>
      </div>
    </form>
  );
}

