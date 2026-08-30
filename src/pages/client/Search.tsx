import { useState } from "react";
import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useSearchProviders } from "@/hooks/useProviders";

// Tab "Buscar" del home cliente (ícono de lupa en la barra inferior,
// docs/promatch_home_cliente_mockup.html) — búsqueda libre por nombre de
// profesional entre los ya aprobados.
export default function Search() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useSearchProviders(query);

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-10">
      <div className="flex items-center gap-2 rounded-pill border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-2.5">
        <Icon name="search" className="text-navy dark:text-cream" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar un profesional por nombre"
          className="flex-1 bg-transparent font-tech text-sm text-navy dark:text-cream placeholder:text-navy/40 dark:placeholder:text-cream/40 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-2">
        {query.trim().length <= 1 && (
          <p className="text-center font-tech text-sm text-navy/40 dark:text-cream/40">Escribí al menos 2 letras para buscar.</p>
        )}
        {isLoading && <p className="font-tech text-sm text-navy/40 dark:text-cream/40">Buscando...</p>}
        {!isLoading && query.trim().length > 1 && !results?.length && (
          <p className="text-center font-tech text-sm text-navy/40 dark:text-cream/40">No encontramos profesionales con ese nombre.</p>
        )}
        {results?.map((p) => (
          <Link key={p.profile_id} to={`/profesional/${p.profile_id}`}>
            <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
              <Avatar name={p.profile.full_name} src={p.profile.avatar_url} size="sm" />
              <div className="flex-1">
                <p className="font-caption text-sm font-semibold text-navy dark:text-cream">{p.profile.full_name}</p>
                <p className="font-caption text-xs text-navy/50 dark:text-cream/50 capitalize">{p.specialties[0]}</p>
              </div>
              {p.available_now && <Badge tone="available">Disponible</Badge>}
            </div>
          </Link>
        ))}
      </div>

      <TabBar mode="client" />
    </div>
  );
}
