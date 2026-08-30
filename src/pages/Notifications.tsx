import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/types/database";

// Central de notificaciones (mapa de UX sección 6,
// docs/promatch_notificaciones_mockup.html). Agrupadas por recencia (Hoy /
// Ayer / Esta semana), no por tipo — prioriza lo más reciente.
const iconByType: Record<string, string> = {
  solicitud_nueva: "bolt",
  solicitud_aceptada: "check",
  solicitud_rechazada: "x",
  trabajo_terminado: "circle-check",
  mensaje_nuevo: "message",
  fiscal_aprobado: "check",
  resena_nueva: "star",
  suscripcion: "credit-card"
};

function groupLabel(date: Date): "Hoy" | "Ayer" | "Esta semana" {
  const now = new Date();
  const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return "Esta semana";
}

function relativeTime(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

function NotificationRow({ notification }: { notification: Notification }) {
  const icon = iconByType[notification.type] ?? "bell";

  const style =
    notification.urgency === "urgente"
      ? "bg-orange"
      : notification.urgency === "confirmacion"
        ? "bg-[#eaf3de]"
        : "border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark";

  const textColor =
    notification.urgency === "urgente" ? "text-navy dark:text-cream" : notification.urgency === "confirmacion" ? "text-[#27500a]" : "text-navy dark:text-cream";
  const subColor =
    notification.urgency === "urgente" ? "text-navy/80 dark:text-cream/80" : notification.urgency === "confirmacion" ? "text-[#27500a]/80" : "text-navy/50 dark:text-cream/50";
  const iconColor = notification.urgency === "confirmacion" ? "text-[#27500a]" : "text-navy dark:text-cream";

  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${style}`}>
      <Icon name={icon} className={`text-base ${iconColor}`} />
      <div className="flex-1">
        <p className={`font-rounded text-xs font-semibold ${textColor}`}>{notification.title}</p>
        {notification.body && <p className={`mt-0.5 font-tech text-[11px] ${subColor}`}>{notification.body}</p>}
        <p className={`mt-0.5 font-tech text-[10px] opacity-70 ${subColor}`}>{relativeTime(notification.created_at)}</p>
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: notifications, isLoading } = useNotifications(profile?.id);

  const groups: Record<string, Notification[]> = { Hoy: [], Ayer: [], "Esta semana": [] };
  for (const n of notifications ?? []) {
    groups[groupLabel(new Date(n.created_at))]?.push(n);
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-navy dark:text-cream">
        <Icon name="chevron-left" className="text-base" />
      </button>
      <h1 className="mb-5 mt-2 font-rounded text-lg font-bold text-navy dark:text-cream">Notificaciones</h1>

      {isLoading && <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Cargando...</p>}
      {!isLoading && !notifications?.length && (
        <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Todavía no tenés notificaciones.</p>
      )}

      {(["Hoy", "Ayer", "Esta semana"] as const).map(
        (label) =>
          groups[label].length > 0 && (
            <div key={label} className="mb-4">
              <p className="mb-2 font-tech text-[11px] uppercase tracking-wide text-navy/50 dark:text-cream/50">{label}</p>
              <div className="space-y-2">
                {groups[label].map((n) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
