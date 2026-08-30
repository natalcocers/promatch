import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-cream/95 border-2 border-navy/10 shadow-sm p-4 transition duration-150 active:scale-[0.98]",
        className
      )}
      {...props}
    />
  );
}
