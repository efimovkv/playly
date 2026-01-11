"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-lime-300 text-[#0a1208] shadow-[0_10px_30px_rgba(163,230,53,0.25)] hover:bg-lime-200",
        variant === "secondary" &&
          "bg-white/[0.04] text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/[0.06]",
        variant === "ghost" && "bg-transparent text-white/70 hover:bg-white/[0.06]",
        variant === "danger" &&
          "bg-rose-500/90 text-white shadow-[0_12px_30px_rgba(244,63,94,0.18)] hover:bg-rose-500",
        className,
      )}
      {...props}
    />
  );
}

