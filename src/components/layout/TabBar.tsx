import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";

interface Tab {
  to: string;
  label: string;
  icon: string;
}

// Íconos y orden tomados 1:1 de los mockups de home cliente/prestador
// (docs/promatch_home_*_mockup.html): tab bar sin texto, solo ícono,
// activo en cream, inactivo en gris. A diferencia del resto de la app,
// esta barra NO sigue el fondo cream/navy-dark del toggle de modo
// oscuro — se pidió que se quede siempre "navy oscura" en los dos modos,
// pero con un tono de navy específico por modo (#05256a en claro,
// pedido explícito; navy-dark #070d34 en oscuro, el mismo de siempre).
const clientTabs: Tab[] = [
  { to: "/", label: "Inicio", icon: "home-2" },
  { to: "/buscar", label: "Buscar", icon: "search" },
  { to: "/favoritos", label: "Favoritos", icon: "heart" },
  { to: "/mensajes", label: "Mensajes", icon: "message" },
  { to: "/perfil", label: "Perfil", icon: "user" }
];

const providerTabs: Tab[] = [
  { to: "/prestador", label: "Inicio", icon: "home-2" },
  { to: "/prestador/solicitudes", label: "Solicitudes", icon: "list-details" },
  { to: "/prestador/calendario", label: "Calendario", icon: "calendar" },
  { to: "/prestador/mensajes", label: "Mensajes", icon: "message" },
  { to: "/prestador/perfil", label: "Perfil", icon: "user" }
];

export function TabBar({ mode }: { mode: "client" | "provider" }) {
  const tabs = mode === "client" ? clientTabs : providerTabs;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-cream/10 bg-[#05256a]/95 dark:bg-navy-dark/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end
              aria-label={tab.label}
              className={({ isActive }) =>
                clsx("flex items-center justify-center p-2 text-lg", isActive ? "text-cream" : "text-cream/30")
              }
            >
              <Icon name={tab.icon} />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
