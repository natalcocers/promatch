import { useParams, Link } from "react-router-dom";
import { BackHeader } from "@/components/layout/BackHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useProvider } from "@/hooks/useProviders";
import { useProviderReviews } from "@/hooks/useReviews";
import { useProviderGallery } from "@/hooks/useGallery";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { categoryLabel, specialtyLabel } from "@/lib/catalog";

// Perfil del profesional (mapa de UX 2.4, docs/promatch_perfil_profesional_mockup.html).
// Sin precio publicado a propósito — se negocia en el chat (Transparencia
// Radical, brand-brief).
export default function ProviderProfile() {
  const { providerId } = useParams();
  const { profile } = useAuth();
  const { data: provider, isLoading } = useProvider(providerId);
  const { data: reviews } = useProviderReviews(providerId);
  const { data: gallery } = useProviderGallery(providerId);
  const { data: isFavorite } = useIsFavorite(profile?.id, providerId);
  const toggleFavorite = useToggleFavorite();

  if (isLoading) return <p className="p-6 font-tech text-sm text-navy/50 dark:text-cream/50">Cargando perfil...</p>;
  if (!provider) return <p className="p-6 font-tech text-sm text-orange">No encontramos este perfil.</p>;

  // rating_avg/rating_count en provider_details es una estadística pública
  // opcional para prestadores importados con historial previo a la app —
  // cuando está presente, prioriza por sobre el promedio calculado en vivo.
  const computedCount = reviews?.length ?? 0;
  const computedAvg = computedCount ? reviews!.reduce((sum, r) => sum + r.rating, 0) / computedCount : 0;
  const ratingCount = provider.rating_count ?? computedCount;
  const ratingAvg = provider.rating_avg ?? computedAvg;

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark pb-32">
      <div className="flex items-center justify-between px-6 pt-6">
        <BackHeader label={categoryLabel(provider.specialties[0]) || "Profesional"} to="/" />
        {profile && profile.id !== providerId && (
          <button
            onClick={() =>
              profile &&
              providerId &&
              toggleFavorite.mutate({ clientId: profile.id, providerId, isFavorite: !!isFavorite })
            }
            aria-label="Guardar en favoritos"
            className="text-lg"
          >
            <Icon
              name={isFavorite ? "heart-solid" : "heart"}
              className={isFavorite ? "text-orange" : "text-navy/30 dark:text-cream/30"}
            />
          </button>
        )}
      </div>

      <div className="px-6 pt-3">
        <div className="flex items-center gap-3">
          <Avatar name={provider.profile.full_name} src={provider.profile.avatar_url} size="lg" />
          <div className="flex-1">
            <p className="flex items-center gap-1 font-caption text-base font-semibold text-navy dark:text-cream">
              {provider.profile.full_name}
              {provider.profile.identity_verified && (
                <Icon name="rosette-discount-check" className="text-sm text-green-functional" />
              )}
            </p>
            <p className="font-caption text-xs text-navy/50 dark:text-cream/50">
              {specialtyLabel(provider.specialties[0])} · {provider.work_zone}
            </p>
            {ratingCount > 0 && (
              <p className="font-tech text-xs text-amber-700">
                {ratingAvg.toFixed(1)} <Icon name="star" /> · {ratingCount} reseñas
              </p>
            )}
          </div>
        </div>

        {provider.available_now ? (
          <Badge tone="available" className="mt-4">Disponible ahora</Badge>
        ) : (
          provider.next_slot_label && (
            <Badge tone="neutral" className="mt-4 !font-caption">Agendado — {provider.next_slot_label}</Badge>
          )
        )}

        <p className="mb-1.5 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Sobre mí</p>
        <p className="font-caption text-sm leading-relaxed text-navy/70 dark:text-cream/70">{provider.bio || "Todavía no cargó su bio."}</p>

        <p className="mb-2 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Trabajos realizados</p>
        <div className="flex gap-2">
          {(gallery?.length ? gallery : [null, null, null]).slice(0, 3).map((item, i) =>
            item ? (
              <img key={item.id} src={item.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div key={i} className="h-16 w-16 rounded-lg bg-navy/10 dark:bg-cream/10" />
            )
          )}
        </div>

        <p className="mb-2 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Reseñas</p>
        {!reviews?.length && <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Todavía sin reseñas.</p>}
        {reviews?.slice(0, 2).map((r) => (
          <div key={r.id} className="mb-2 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
            <p className="text-xs text-amber-700">{"★".repeat(r.rating)}</p>
            {r.comment && <p className="mt-1 font-caption text-sm text-navy dark:text-cream">{r.comment}</p>}
            <div className="mt-1 flex flex-wrap gap-1">
              {r.quick_tags.map((tag) => (
                <span key={tag} className="rounded-pill bg-navy/5 dark:bg-cream/5 px-2 py-0.5 text-xs text-navy/60 dark:text-cream/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {ratingCount > 2 && (
          <p className="text-center font-tech text-xs text-accent underline">Ver las {ratingCount} reseñas</p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark p-4">
        <Link to={`/profesional/${providerId}/contacto`}>
          <Button className="w-full">Contactar</Button>
        </Link>
      </div>
    </div>
  );
}
