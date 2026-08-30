import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { RoleSwitch } from "@/components/ui/RoleSwitch";
import { useAuth } from "@/context/AuthContext";
import { useOwnProviderDetails, useToggleAvailability } from "@/hooks/useOwnProvider";
import { useIncomingRequests } from "@/hooks/useServiceRequests";
import { useSubscription } from "@/hooks/useSubscription";

// Home prestador (mapa de UX 3.1 y docs/promatch_home_prestador_mockup.html).
// El toggle de disponibilidad es el elemento hero, en verde funcional — es
// el único lugar donde ese verde se usa como "acción" (la acción en sí es
// "estoy disponible").
export default function ProviderHome() {
  const { profile } = useAuth();
  const { data: details } = useOwnProviderDetails(profile?.id);
  const { data: requests } = useIncomingRequests(profile?.id);
  const { data: subscription } = useSubscription(profile?.id);
  const toggleAvailability = useToggleAvailability();

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark pb-24">
      <header className="flex items-center justify-between px-6 pt-10">
        <RoleSwitch active="provider" />
        <NotificationBell />
      </header>

      <div className="px-6 pt-4">
        <button
          onClick={() =>
            profile &&
            toggleAvailability.mutate({ profileId: profile.id, availableNow: !details?.available_now })
          }
          className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left ${
            details?.available_now ? "bg-green-functional" : "bg-navy/5 dark:bg-cream/5"
          }`}
        >
          <div>
            <p className={`font-rounded text-sm font-bold ${details?.available_now ? "text-[#173404]" : "text-navy dark:text-cream"}`}>
              {details?.available_now ? "Estás disponible ahora" : "No estás disponible"}
            </p>
            <p className={`mt-0.5 font-tech text-xs ${details?.available_now ? "text-[#27500a]" : "text-navy/50 dark:text-cream/50"}`}>
              {details?.available_now
                ? "Los clientes cercanos te ven en sus búsquedas"
                : "Tocá para empezar a recibir solicitudes"}
            </p>
          </div>
          <span
            className={`relative h-5 w-9 shrink-0 rounded-pill ${details?.available_now ? "bg-[#173404]" : "bg-navy/20 dark:bg-cream/20"}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-cream transition-all ${
                details?.available_now ? "right-0.5" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </div>

      <section className="px-6 pt-6">
        <p className="mb-2 font-rounded text-sm font-bold text-navy dark:text-cream">Solicitudes nuevas</p>

        {!requests?.length && (
          <p className="font-tech text-sm text-navy/50 dark:text-cream/50">No tenés solicitudes pendientes.</p>
        )}

        <div className="space-y-2">
          {requests?.map((r) => (
            <Link key={r.id} to={`/prestador/solicitudes/${r.id}`}>
              <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
                <div className="flex-1">
                  <p className="font-rounded text-sm font-semibold text-navy dark:text-cream capitalize">{r.specialty}</p>
                  <p className="font-tech text-xs text-navy/50 dark:text-cream/50">{r.reason_chips.join(", ")}</p>
                </div>
                {r.mode === "ahora" ? (
                  <Badge tone="urgent">Nueva</Badge>
                ) : (
                  <Badge tone="neutral">Agendado</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pt-6">
        <p className="mb-2 font-rounded text-sm font-bold text-navy dark:text-cream">Tu perfil</p>
        <Link to="/prestador/perfil">
          <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
            <Avatar name={profile?.full_name ?? ""} src={profile?.avatar_url} size="sm" />
            <div className="flex-1">
              <p className="font-caption text-sm font-semibold text-navy dark:text-cream">
                {profile?.full_name} · <span className="capitalize">{details?.specialties?.[0]}</span>
              </p>
              <p className="font-tech text-xs text-navy/50 dark:text-cream/50">
                {subscription
                  ? `Suscripción ${subscription.status === "activa" ? "activa" : subscription.status.replace("_", " ")}${
                      subscription.renews_at ? ` · vence ${subscription.renews_at}` : ""
                    }`
                  : "Sin suscripción activa"}
              </p>
            </div>
            <Icon name="chevron-right" className="text-navy/30 dark:text-cream/30" />
          </div>
        </Link>
      </section>

      <TabBar mode="provider" />
    </div>
  );
}
