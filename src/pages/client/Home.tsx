import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { RoleSwitch } from "@/components/ui/RoleSwitch";
import { useAuth } from "@/context/AuthContext";
import { useNearbyProviders } from "@/hooks/useProviders";
import { categories, specialtyLabel } from "@/lib/catalog";

export default function ClientHome() {
  const { profile } = useAuth();
  const { data: nearby, isLoading } = useNearbyProviders();
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark pb-24">
      <header className="flex items-start justify-between px-6 pt-10">
        <div>
          <p className="font-rounded text-base font-semibold text-navy dark:text-cream">Hola, {firstName}</p>
          {profile?.location_label ? (
            <p className="mt-0.5 flex items-center gap-1 font-tech text-xs text-navy/50 dark:text-cream/50">
              <Icon name="map-pin" className="text-xs" />
              {profile.location_label}
            </p>
          ) : (
            <Link to="/perfil" className="mt-0.5 block font-tech text-xs text-accent underline">
              Agregá tu ubicación
            </Link>
          )}
          {profile?.is_provider_active && (
            <div className="mt-2">
              <RoleSwitch active="client" />
            </div>
          )}
        </div>
        <NotificationBell />
      </header>

      <div className="px-6 pt-4">
        <Link
          to="/categoria/hogar"
          className="flex items-center gap-2 rounded-pill border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-2.5"
        >
          <Icon name="search" className="text-navy dark:text-cream" />
          <span className="font-tech text-sm text-navy/40 dark:text-cream/40">¿Qué necesitás resolver hoy?</span>
        </Link>
      </div>

      <section className="px-6 pt-6">
        <p className="mb-2 font-rounded text-sm font-bold text-navy dark:text-cream">Categorías</p>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/categoria/${cat.id}`}>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark py-3 text-center hover:border-accent">
                <Icon name={cat.icon} className="text-lg text-navy dark:text-cream" />
                <span className="font-caption text-[11px] font-bold text-navy dark:text-cream">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pt-6">
        <p className="mb-2 font-rounded text-sm font-bold text-navy dark:text-cream">Cerca tuyo ahora</p>

        {isLoading && <p className="font-tech text-sm text-navy/40 dark:text-cream/40">Buscando profesionales...</p>}
        {!isLoading && !nearby?.length && (
          <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Todavía no hay profesionales aprobados.</p>
        )}

        <div className="space-y-2">
          {nearby?.map((p) => (
            <Link key={p.profile_id} to={`/profesional/${p.profile_id}`}>
              <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
                <Avatar name={p.profile.full_name} src={p.profile.avatar_url} size="sm" />
                <div className="flex-1">
                  <p className="font-caption text-sm font-semibold text-navy dark:text-cream">{p.profile.full_name}</p>
                  <p className="font-caption text-xs text-navy/50 dark:text-cream/50">{specialtyLabel(p.specialties[0])}</p>
                </div>
                {p.available_now ? (
                  <Badge tone="available">Disponible</Badge>
                ) : p.next_slot_label ? (
                  <Badge tone="neutral">{p.next_slot_label}</Badge>
                ) : (
                  <Badge tone="neutral">No disponible</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TabBar mode="client" />
    </div>
  );
}
