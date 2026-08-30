import { useState } from "react";
import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useOwnProviderDetails, useActivateProviderMode } from "@/hooks/useOwnProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { useProviderGallery } from "@/hooks/useGallery";
import { supabase } from "@/lib/supabaseClient";

// Perfil profesional editable (mapa de UX 3.3, docs/promatch_perfil_prestador_editable_mockup.html).
// Separación clara entre lo editable y los estados de confianza de solo
// lectura. La edición inline de especialidades/zona/horarios queda para
// una próxima pasada — acá se activa el modo prestador y se muestra todo
// con datos reales; "Horarios habituales" no tiene tabla propia todavía
// (solo bio/zona en provider_details), así que se marca honestamente sin
// dato en vez de inventar un horario.
export default function ProviderProfile() {
  const { profile, refreshProfile } = useAuth();
  const { data: details } = useOwnProviderDetails(profile?.id);
  const { data: subscription } = useSubscription(profile?.id);
  const { data: gallery } = useProviderGallery(profile?.id);
  const activate = useActivateProviderMode();
  const [bio, setBio] = useState("");
  const [workZone, setWorkZone] = useState("");

  const isActive = profile?.is_provider_active;

  async function handleActivate() {
    if (!profile) return;
    await activate.mutateAsync({ profileId: profile.id, specialties: ["plomeria"], bio, workZone });
    await refreshProfile();
  }

  async function handleLogout() {
    if (window.confirm("¿Cerrar sesión?")) await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-10">
      <div className="flex items-center justify-between">
        <h1 className="font-rounded text-base font-semibold text-navy dark:text-cream">Mi perfil profesional</h1>
        <button onClick={handleLogout} aria-label="Más opciones">
          <Icon name="dots" className="text-navy/50 dark:text-cream/50" />
        </button>
      </div>

      {!isActive ? (
        <div className="mt-6 rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-4">
          <h2 className="font-rounded font-bold text-navy dark:text-cream">Activar modo prestador</h2>
          <p className="mt-1 font-tech text-sm text-navy/60 dark:text-cream/60">
            Especialidad: Plomería (categoría Hogar) — la única disponible en este MVP.
          </p>
          <textarea
            placeholder="Contanos tu experiencia"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-3 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream"
          />
          <input
            placeholder="Zona de trabajo"
            value={workZone}
            onChange={(e) => setWorkZone(e.target.value)}
            className="mt-3 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream"
          />
          <Button className="mt-4 w-full" onClick={handleActivate} disabled={activate.isPending}>
            {activate.isPending ? "Activando..." : "Activar modo prestador"}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2.5">
            <Avatar name={profile.full_name} src={profile.avatar_url} size="md" />
            <div className="flex-1">
              <p className="font-caption text-sm font-semibold text-navy dark:text-cream">{profile.full_name}</p>
              <p className="font-tech text-xs text-navy/50 dark:text-cream/50">{details?.bio ? "Prestador activo" : "Completá tu perfil"}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-3 py-1">
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-1.5 font-tech text-xs text-navy dark:text-cream">
                <Icon name="fingerprint" className="text-sm text-green-functional" />
                Identidad verificada
              </span>
              {profile.identity_verified ? (
                <Icon name="check" className="text-sm text-green-functional" />
              ) : (
                <Badge tone="warning">Pendiente</Badge>
              )}
            </div>
            <div className="h-px bg-navy/10 dark:bg-cream/10" />
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-1.5 font-tech text-xs text-navy dark:text-cream">
                <Icon name="file-invoice" className="text-sm text-amber-700" />
                Situación fiscal
              </span>
              {profile.fiscal_status === "aprobado" ? (
                <Icon name="check" className="text-sm text-green-functional" />
              ) : (
                <Badge tone="warning">{profile.fiscal_status === "en_revision" ? "En revisión" : "Pendiente"}</Badge>
              )}
            </div>
          </div>

          <p className="mb-2 mt-4 font-rounded text-sm font-bold text-navy dark:text-cream">Especialidades</p>
          <div className="flex flex-wrap gap-1.5">
            {details?.specialties?.map((s) => (
              <span key={s} className="rounded-pill bg-navy px-3 py-1.5 font-tech text-xs capitalize text-cream">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-3 py-2.5">
            <span className="flex items-center gap-1.5 font-tech text-xs text-navy dark:text-cream">
              <Icon name="map-pin" className="text-sm text-navy dark:text-cream" />
              Zona de trabajo
            </span>
            <span className="font-tech text-xs text-navy/50 dark:text-cream/50">{details?.work_zone || "No configurado"}</span>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-3 py-2.5">
            <span className="flex items-center gap-1.5 font-tech text-xs text-navy dark:text-cream">
              <Icon name="clock" className="text-sm text-navy dark:text-cream" />
              Horarios habituales
            </span>
            <span className="font-tech text-xs text-navy/50 dark:text-cream/50">No configurado</span>
          </div>

          <Link to="/prestador/suscripcion">
            <div className="mt-2 flex items-center justify-between rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-3 py-2.5">
              <span className="flex items-center gap-1.5 font-tech text-xs text-navy dark:text-cream">
                <Icon name="credit-card" className="text-sm text-navy dark:text-cream" />
                Suscripción
              </span>
              <span className="font-tech text-xs text-navy/50 dark:text-cream/50">
                {subscription ? (subscription.status === "activa" ? "Activa" : subscription.status.replace("_", " ")) : "Sin activar"}
              </span>
            </div>
          </Link>

          <p className="mb-2 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Trabajos realizados</p>
          <div className="flex gap-2">
            {gallery?.map((item) => (
              <img key={item.id} src={item.image_url} alt="" className="h-[60px] w-[60px] rounded-lg object-cover" />
            ))}
            {!gallery?.length && (
              <p className="font-tech text-xs text-navy/40 dark:text-cream/40">Todavía no subiste fotos de trabajos.</p>
            )}
          </div>
        </>
      )}

      <TabBar mode="provider" />
    </div>
  );
}
