import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { useAuth } from "@/context/AuthContext";
import { useProviderAgenda } from "@/hooks/useServiceRequests";

const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

// Calendario del prestador (mapa de UX sección 8, docs/promatch_calendario_prestador_mockup.html).
// Muestra los turnos confirmados reales (service_requests agendados y
// aceptados) del día elegido. Sin franjas de "disponibilidad base"
// dibujadas todavía: ese dato viviría en un horario semanal recurrente que
// este MVP no modela (solo hay bio/zona de trabajo en provider_details) —
// se agrega cuando exista esa tabla, en vez de fabricar bloques sin datos.
export default function ProviderCalendar() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selected, setSelected] = useState(() => new Date());
  const weekStart = useMemo(() => startOfWeek(selected), [selected]);
  const week = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 86400000)),
    [weekStart]
  );

  const { data: agenda } = useProviderAgenda(profile?.id);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const dayAppointments = (agenda ?? [])
    .filter((r) => r.scheduled_for && sameDay(new Date(r.scheduled_for), selected))
    .sort((a, b) => new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime());

  const urgentDays = new Set(
    (agenda ?? [])
      .filter((r) => r.mode === "ahora" && ["buscando", "pendiente"].includes(r.status))
      .map((r) => new Date(r.requested_at).toDateString())
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-10">
      <h1 className="mb-4 font-rounded text-lg font-bold text-navy dark:text-cream">Mi calendario</h1>

      <div className="flex justify-between">
        {week.map((day) => {
          const isSelected = sameDay(day, selected);
          const isPast = day < startOfWeek(new Date());
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelected(day)}
              className="flex flex-col items-center gap-0.5"
            >
              <span className={`font-tech text-[10px] ${isSelected ? "font-bold text-accent" : "text-navy/40 dark:text-cream/40"}`}>
                {dayLabels[day.getDay()]}
              </span>
              <span
                className={`relative flex h-7 w-7 items-center justify-center rounded-full font-tech text-xs ${
                  isSelected ? "bg-navy text-cream" : isPast ? "text-navy/30 dark:text-cream/30" : "text-navy dark:text-cream"
                }`}
              >
                {day.getDate()}
                {urgentDays.has(day.toDateString()) && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-orange" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm bg-accent" />
        <span className="font-tech text-[10px] text-navy/50 dark:text-cream/50">Turno confirmado</span>
      </div>

      <div className="mt-3 space-y-2 border-t border-navy/10 dark:border-cream/10 pt-3">
        {!dayAppointments.length && (
          <p className="py-4 text-center font-tech text-sm text-navy/40 dark:text-cream/40">No tenés turnos confirmados este día.</p>
        )}
        {dayAppointments.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/prestador/solicitudes/${r.id}`)}
            className="block w-full rounded-lg bg-accent px-3 py-2 text-left"
          >
            <p className="font-rounded text-xs font-semibold text-cream capitalize">
              {r.reason_chips[0] ?? r.specialty}
            </p>
            <p className="mt-0.5 font-tech text-[10px] text-cream/80">
              {new Date(r.scheduled_for!).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </button>
        ))}
      </div>

      <TabBar mode="provider" />
    </div>
  );
}
