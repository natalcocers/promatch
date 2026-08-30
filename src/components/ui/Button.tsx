import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "neutral" | "ghost";
}

// Naranja = único color de CTA de acción ("Contactar", "Continuar",
// "Aceptar"). "neutral" es para acciones sin fricción como "Rechazar".
// Ver docs/ProMatch-mapa-completo-UX.md sección 4.
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-pill px-6 py-3 font-tech font-semibold transition duration-150 disabled:opacity-50 disabled:active:scale-100 active:scale-95",
        variant === "primary" && "bg-orange text-cream hover:brightness-110",
        variant === "neutral" && "bg-cream text-navy border-2 border-navy/15 hover:bg-navy/5",
        variant === "ghost" && "bg-transparent text-accent hover:underline",
        className
      )}
      {...props}
    />
  );
}
