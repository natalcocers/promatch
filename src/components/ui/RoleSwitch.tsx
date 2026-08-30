import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useCircleTransition, CIRCLE_TRANSITION_DURATION_MS } from "@/context/CircleTransitionContext";

// Switch de rol cliente/prestador (mapa de UX, arquitectura general y
// mockup de home prestador): solo tiene sentido para quien ya activó el
// modo prestador — se muestra en el header de ambos homes en ese caso.
export function RoleSwitch({ active }: { active: "client" | "provider" }) {
  const navigate = useNavigate();
  const { trigger } = useCircleTransition();

  function switchTo(role: "client" | "provider", e: MouseEvent) {
    if (role === active) return;
    const to = role === "client" ? "/" : "/prestador";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      navigate(to);
      return;
    }

    trigger(e.clientX, e.clientY);
    // Navega recién cuando el círculo tapa toda la pantalla (mitad de la
    // animación, ver pm-circle-reveal en index.css) — el cambio de ruta
    // queda oculto detrás.
    setTimeout(() => navigate(to), CIRCLE_TRANSITION_DURATION_MS / 2);
  }

  return (
    <div className="flex gap-0.5 rounded-pill bg-navy p-1">
      <button
        onClick={(e) => switchTo("client", e)}
        className={clsx(
          "rounded-pill px-3 py-1.5 font-rounded text-xs font-bold",
          active === "client" ? "bg-accent text-cream" : "text-accent/60"
        )}
      >
        Cliente
      </button>
      <button
        onClick={(e) => switchTo("provider", e)}
        className={clsx(
          "rounded-pill px-3 py-1.5 font-rounded text-xs font-bold",
          active === "provider" ? "bg-accent text-cream" : "text-accent/60"
        )}
      >
        Prestador
      </button>
    </div>
  );
}
