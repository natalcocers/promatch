import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

// Patrón de header repetido en casi todos los mockups de pantallas
// internas: chevron para volver + label chico gris (breadcrumb o título
// de sección). Ver docs/promatch_*_mockup.html.
export function BackHeader({ label, to }: { label: string; to?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-2 text-navy dark:text-cream"
      aria-label="Volver"
    >
      <Icon name="chevron-left" className="text-base" />
      <span className="font-tech text-xs text-navy/60 dark:text-cream/60">{label}</span>
    </button>
  );
}
