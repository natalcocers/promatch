interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

// Mismo patrón de track+knob que el toggle "Disponible ahora" del home
// prestador (src/pages/provider/Home.tsx) — reusado acá para Configuración.
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-pill transition-colors ${checked ? "bg-accent" : "bg-navy/20 dark:bg-cream/20"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-cream transition-all dark:bg-navy-dark ${
          checked ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}
