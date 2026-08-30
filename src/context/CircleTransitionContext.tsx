import { createContext, useCallback, useContext, useState, type CSSProperties, type ReactNode } from "react";

interface CircleTransitionValue {
  trigger: (x: number, y: number) => void;
}

const CircleTransitionContext = createContext<CircleTransitionValue | undefined>(undefined);

// Duración total del "iris wipe": crece hasta cubrir la pantalla, y ahí
// recién se navega — con la pantalla tapada, el cambio de ruta no se ve —
// y encoge de vuelta revelando la pantalla nueva. Ver RoleSwitch.tsx, único
// lugar que lo dispara hoy (cambio cliente/prestador).
const DURATION_MS = 700;

// El overlay vive acá, afuera del <div key={pathname}> que remonta App en
// cada ruta (App.tsx) — si estuviera adentro, la propia navegación lo
// desmontaría a mitad de la animación.
export function CircleTransitionProvider({ children }: { children: ReactNode }) {
  const [circle, setCircle] = useState<{ x: number; y: number; id: number } | null>(null);

  const trigger = useCallback((x: number, y: number) => {
    setCircle({ x, y, id: Date.now() });
  }, []);

  return (
    <CircleTransitionContext.Provider value={{ trigger }}>
      {children}
      {circle && (
        <span
          key={circle.id}
          aria-hidden
          className="pm-circle-reveal"
          style={{ "--pm-cx": `${circle.x}px`, "--pm-cy": `${circle.y}px` } as CSSProperties}
          onAnimationEnd={() => setCircle(null)}
        />
      )}
    </CircleTransitionContext.Provider>
  );
}

export function useCircleTransition() {
  const ctx = useContext(CircleTransitionContext);
  if (!ctx) throw new Error("useCircleTransition debe usarse dentro de <CircleTransitionProvider>");
  return ctx;
}

export const CIRCLE_TRANSITION_DURATION_MS = DURATION_MS;
