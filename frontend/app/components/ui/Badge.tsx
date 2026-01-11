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
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur",
        tone === "neutral" && "bg-white/[0.04] text-white/70 ring-white/10",
        tone === "success" && "bg-lime-300/15 text-lime-200 ring-lime-300/20",
        tone === "danger" && "bg-rose-500/15 text-rose-200 ring-rose-400/20",
        className,
      )}
      {...props}
    />
  );
}

