"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl bg-white/[0.03] px-3 text-sm text-white/85 ring-1 ring-white/10 placeholder:text-white/35 backdrop-blur focus:outline-none focus:ring-2 focus:ring-lime-300/20",
        className,
      )}
      {...props}
    />
  );
}

