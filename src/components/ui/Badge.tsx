import clsx from "clsx";

interface BadgeProps {
  tone: "verified" | "available" | "warning" | "urgent" | "neutral";
  children: React.ReactNode;
  className?: string;
}

// El verde funcional (#56c689) es EXCLUSIVO de "Verificado" y "Disponible
// ahora" — nunca decorativo, nunca color de acción genérica (brand-brief +
// mapa de UX sección 4). "warning" (ámbar) es para fiscal "en_revision" y
// pago pendiente — nunca verde hasta que el estado esté aprobado.
export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-bold animate-[pm-pop_0.25s_ease-out]",
        tone === "verified" && "font-caption bg-green-functional/15 text-green-functional",
        tone === "available" && "font-caption bg-green-functional text-cream dark:text-navy",
        tone === "warning" && "font-rounded bg-amber-100 text-amber-700",
        tone === "urgent" && "font-rounded bg-orange text-navy",
        tone === "neutral" && "font-rounded bg-navy/5 text-navy/60",
        className
      )}
    >
      {children}
    </span>
  );
}
