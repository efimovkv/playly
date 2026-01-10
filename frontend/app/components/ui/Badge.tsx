"use client";

import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "danger";
};

export function Badge({ className, tone = "neutral", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        tone === "neutral" && "bg-slate-50 text-slate-700 ring-slate-200",
        tone === "success" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
        tone === "danger" && "bg-rose-50 text-rose-700 ring-rose-200",
        className,
      )}
      {...props}
    />
  );
}

