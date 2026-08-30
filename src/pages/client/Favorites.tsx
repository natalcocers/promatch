import { Link, useNavigate } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

// Favoritos del cliente (mapa de UX sección 7, docs/promatch_favoritos_mockup.html).
export default function Favorites() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: favorites, isLoading } = useFavorites(profile?.id);

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-10">
      <h1 className="font-rounded text-lg font-bold text-navy dark:text-cream">Favoritos</h1>
      <p className="mb-4 font-tech text-xs text-navy/50 dark:text-cream/50">Tus profesionales de confianza</p>

      {isLoading && <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Cargando...</p>}

      {favorites?.map((p) => (
        <div key={p.profile_id} className="mb-2">
          <Link to={`/profesional/${p.profile_id}`}>
            <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
              <Avatar name={p.profile.full_name} src={p.profile.avatar_url} size="sm" />
              <div className="flex-1">
                <p className="flex items-center gap-1 font-caption text-sm font-semibold text-navy dark:text-cream">
                  {p.profile.full_name}
                  {p.profile.identity_verified && (
                    <Icon name="rosette-discount-check" className="text-xs text-green-functional" />
                  )}
                </p>
                <p className="font-caption text-xs text-navy/50 dark:text-cream/50 capitalize">
                  {p.specialties[0]} · usado {p.times_used} {p.times_used === 1 ? "vez" : "veces"}
                </p>
              </div>
              {p.available_now ? <Badge tone="available">Disponible</Badge> : <Badge tone="neutral">No disponible</Badge>}
            </div>
          </Link>
          <button
            onClick={() => navigate(`/profesional/${p.profile_id}/contacto`)}
            className="mt-0.5 block w-full text-right font-tech text-xs text-accent"
          >
            Contactar directo →
          </button>
        </div>
      ))}

      {!isLoading && !favorites?.length && (
        <>
          <div className="my-4 h-px bg-navy/10 dark:bg-cream/10" />
          <p className="mb-2 text-center font-tech text-xs text-navy/50 dark:text-cream/50">¿Buscás algo nuevo?</p>
          <Link
            to="/"
            className="block rounded-xl border-2 border-dashed border-navy/30 dark:border-cream/30 bg-cream dark:bg-navy-dark py-3 text-center font-tech text-sm text-navy/50 dark:text-cream/50"
          >
            Explorar categorías
          </Link>
        </>
      )}

      <TabBar mode="client" />
    </div>
  );
}
