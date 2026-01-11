"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl bg-slate-50 px-4 text-sm text-slate-900 ring-1 ring-black/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-600)]/25",
        className,
      )}
      {...props}
    />
  );
}

