import clsx from "clsx";

interface RingProps {
  corner?: "top-right" | "bottom-left" | "bottom-right" | "top-left";
  tone?: "orange" | "lime" | "accent" | "subtle";
  className?: string;
}

// Motivo recurrente del deck (docs/promatch-deck-design-rules.md): un
// anillo que ancla a una esquina y queda cortado por el borde del
// contenedor — nunca centrado ni completo. Un solo anillo por pantalla.
export function Ring({ corner = "bottom-right", tone = "orange", className }: RingProps) {
  const position = {
    "top-right": "-top-10 -right-10",
    "bottom-left": "-bottom-10 -left-10",
    "bottom-right": "-bottom-10 -right-10",
    "top-left": "-top-10 -left-10"
  }[corner];

  const color = {
    orange: "border-orange",
    lime: "border-green-lime",
    accent: "border-accent",
    subtle: "border-cream/20"
  }[tone];

  return (
    <span
      aria-hidden
      className={clsx(
        "pointer-events-none absolute h-32 w-32 rounded-full border-[10px]",
        position,
        color,
        className
      )}
    />
  );
}
