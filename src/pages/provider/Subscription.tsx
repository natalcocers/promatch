import { BackHeader } from "@/components/layout/BackHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useSetSubscriptionStatus, useStartSubscription, useSubscription } from "@/hooks/useSubscription";

const badgeTone = { activa: "verified", pago_pendiente: "warning", pausada: "neutral", cancelada: "neutral" } as const;
const statusLabel = { activa: "Activa", pago_pendiente: "Pago pendiente", pausada: "Pausada", cancelada: "Cancelada" };

// Suscripción del prestador (mapa de UX sección 9, docs/promatch_suscripcion_mockup.html).
// Método de pago e historial de facturación quedan fuera: el esquema
// (supabase/migrations/0001_init.sql) todavía no tiene esas tablas — se
// agregan cuando exista la integración con Mercado Pago (ver README).
export default function ProviderSubscription() {
  const { profile } = useAuth();
  const { data: subscription, isLoading } = useSubscription(profile?.id);
  const startSubscription = useStartSubscription();
  const setStatus = useSetSubscriptionStatus();

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-6 pb-10">
      <BackHeader label="Mi suscripción" to="/prestador/perfil" />

      {isLoading && <p className="mt-6 font-tech text-sm text-navy/50 dark:text-cream/50">Cargando...</p>}

      {!isLoading && !subscription && (
        <div className="mt-6 rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-4 text-center">
          <p className="font-rounded text-sm font-bold text-navy dark:text-cream">Todavía no activaste el Plan Profesional</p>
          <p className="mt-1 font-tech text-xs text-navy/50 dark:text-cream/50">
            $20.000 ARS/mes · sin comisión por servicio. El pago con Mercado Pago se integra en una próxima etapa —
            por ahora activás el plan en estado "pago pendiente".
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => profile && startSubscription.mutate(profile.id)}
            disabled={startSubscription.isPending}
          >
            Activar Plan Profesional
          </Button>
        </div>
      )}

      {subscription && (
        <>
          <div className="mt-6 rounded-2xl bg-navy p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-rounded text-sm font-semibold text-cream">Plan Profesional</span>
              <Badge tone={badgeTone[subscription.status]}>{statusLabel[subscription.status]}</Badge>
            </div>
            <p className="font-rounded text-xl font-semibold text-cream">
              ${subscription.amount_ars.toLocaleString("es-AR")}
              <span className="font-tech text-xs font-normal text-cream/60">/mes</span>
            </p>
            <p className="font-tech text-xs text-cream/60">
              {subscription.renews_at ? `Renueva el ${subscription.renews_at} · ` : ""}Sin comisión por servicio
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1.5 px-0.5">
            <Icon name="shield-check" className="text-sm text-navy/50 dark:text-cream/50" />
            <span className="font-tech text-[11px] text-navy/50 dark:text-cream/50">
              Presupuestos siempre directos entre las partes, sin comisiones ocultas
            </span>
          </div>

          <p className="mb-2 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Método de pago</p>
          <p className="rounded-xl border-2 border-dashed border-navy/25 dark:border-cream/25 bg-cream dark:bg-navy-dark px-3 py-3 font-tech text-xs text-navy/50 dark:text-cream/50">
            Todavía no hay integración de pago — se suma cuando esté Mercado Pago conectado.
          </p>

          {subscription.status !== "cancelada" && (
            <button
              onClick={() =>
                profile &&
                setStatus.mutate({
                  id: subscription.id,
                  profileId: profile.id,
                  status: subscription.status === "pausada" ? "activa" : "pausada"
                })
              }
              className="mt-6 w-full text-center font-tech text-xs text-navy/50 dark:text-cream/50 underline"
            >
              {subscription.status === "pausada" ? "Reactivar suscripción" : "Pausar o cancelar suscripción"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
