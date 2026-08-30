import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { BackHeader } from "@/components/layout/BackHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useProviders } from "@/hooks/useProviders";
import { useProviderRatings } from "@/hooks/useReviews";
import { categoryLabel, specialtyLabel } from "@/lib/catalog";
import { ProvidersMap } from "@/components/ui/ProvidersMap";

const filters = ["Disponible ahora", "Mejor calificado", "Más cerca"] as const;

// Listado filtrado (mapa de UX 2.3). El check de verificado va como ícono
// junto al nombre, no como chip — el badge verde queda reservado para
// "Disponible ahora".
export default function ClientListing() {
  const { categoryId, specialtyId } = useParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const { data: providers, isLoading, error } = useProviders(specialtyId ?? "");
  const { data: ratings } = useProviderRatings((providers ?? []).map((p) => p.profile_id));

  function toggleFilter(f: string) {
    setActiveFilters((current) => (current.includes(f) ? current.filter((x) => x !== f) : [...current, f]));
  }

  function ratingOf(profileId: string, providerRatingAvg: number | null) {
    return providerRatingAvg ?? ratings?.[profileId]?.avg ?? 0;
  }

  let visible = providers ?? [];
  if (activeFilters.includes("Disponible ahora")) visible = visible.filter((p) => p.available_now);
  if (activeFilters.includes("Mejor calificado")) {
    visible = [...visible].sort(
      (a, b) => ratingOf(b.profile_id, b.rating_avg) - ratingOf(a.profile_id, a.rating_avg)
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-6">
      <BackHeader label={categoryLabel(specialtyId) || "Categorías"} to={`/categoria/${categoryId ?? "hogar"}`} />
      <h1 className="mb-3 mt-2 font-rounded text-lg font-bold text-navy dark:text-cream">{specialtyLabel(specialtyId)}</h1>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => {
            const selected = activeFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`shrink-0 rounded-pill border-2 px-3.5 py-2 font-tech text-xs ${
                  selected
                    ? "border-[#327af3] bg-navy text-[#327af3] dark:bg-cream dark:text-navy"
                    : "border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark text-navy dark:text-cream"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 gap-1 rounded-pill border-2 border-navy/15 dark:border-cream/15 p-1">
          <button
            onClick={() => setView("lista")}
            aria-pressed={view === "lista"}
            className={`rounded-pill px-2.5 py-1.5 text-xs ${
              view === "lista" ? "bg-navy text-cream" : "text-navy/60 dark:text-cream/60"
            }`}
          >
            <Icon name="list" />
          </button>
          <button
            onClick={() => setView("mapa")}
            aria-pressed={view === "mapa"}
            className={`rounded-pill px-2.5 py-1.5 text-xs ${
              view === "mapa" ? "bg-navy text-cream" : "text-navy/60 dark:text-cream/60"
            }`}
          >
            <Icon name="map-2" />
          </button>
        </div>
      </div>

      <section className="mt-4 space-y-2.5">
        {isLoading && <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Buscando profesionales cerca tuyo...</p>}

        {!isLoading && view === "mapa" && visible.length > 0 && <ProvidersMap providers={visible} />}

        {error && (
          <p className="font-tech text-sm text-orange">
            No pudimos conectar con el backend todavía. Revisá tu .env de Supabase.
          </p>
        )}

        {providers?.length === 0 && (
          <div className="rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-4 text-center">
            <p className="font-rounded font-bold text-navy dark:text-cream">No hay profesionales disponibles ahora</p>
            <p className="mt-1 font-tech text-sm text-navy/60 dark:text-cream/60">
              Probá agendar para más tarde o ampliar el radio de búsqueda.
            </p>
            <Button variant="neutral" className="mt-4">
              Agendar para más tarde
            </Button>
          </div>
        )}

        {view === "lista" && visible.map((p) => (
          <Link key={p.profile_id} to={`/profesional/${p.profile_id}`}>
            <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
              <Avatar name={p.profile.full_name} src={p.profile.avatar_url} />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-caption text-sm font-bold text-navy dark:text-cream">{p.profile.full_name}</span>
                  {p.profile.identity_verified && (
                    <Icon name="rosette-discount-check" className="text-xs text-green-functional" />
                  )}
                </div>
                <p className="font-caption text-xs text-navy/50 dark:text-cream/50">{specialtyLabel(p.specialties[0])} · {p.work_zone}</p>
                {(p.rating_avg ?? ratings?.[p.profile_id]?.avg) !== undefined && (
                  <p className="font-tech text-xs text-amber-700">
                    {(p.rating_avg ?? ratings?.[p.profile_id]?.avg ?? 0).toFixed(1)} <Icon name="star" /> (
                    {p.rating_count ?? ratings?.[p.profile_id]?.count ?? 0})
                  </p>
                )}
              </div>
              {p.available_now ? (
                <Badge tone="available">Disponible ahora</Badge>
              ) : (
                p.next_slot_label && <Badge tone="neutral">{p.next_slot_label}</Badge>
              )}
            </div>
          </Link>
        ))}
      </section>

      <TabBar mode="client" />
    </div>
  );
}
