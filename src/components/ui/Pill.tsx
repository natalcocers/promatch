import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: "accent" | "cream";
}

// Reglas del deck (docs/promatch-deck-design-rules.md): forma píldora
// completa, fuente redondeada bold, alternancia estricta entre relleno
// azul acento + texto blanco, o relleno cream + texto navy. El verde
// funcional NO se usa acá — queda reservado para "verificado".
export function Pill({ selected = false, tone = "accent", className, ...props }: PillProps) {
  const activeTone =
    tone === "accent"
      ? "bg-accent text-cream"
      : "bg-cream text-navy border-2 border-navy/15";

  return (
    <button
      className={clsx(
        "rounded-pill px-4 py-2 text-sm font-rounded font-bold whitespace-nowrap transition duration-150 active:scale-95",
        selected ? activeTone : "bg-navy/5 text-navy/60 hover:bg-navy/10",
        className
      )}
      {...props}
    />
  );
}
