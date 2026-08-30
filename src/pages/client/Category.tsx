import { Link, useParams } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { BackHeader } from "@/components/layout/BackHeader";
import { Icon } from "@/components/ui/Icon";
import { categories } from "@/lib/catalog";

// Pantalla de categoría (mapa de UX 2.2). Las especialidades habilitadas
// dependen de la categoría (ver src/lib/catalog.ts) — el resto queda
// visible como mapa de lo que falta, deshabilitado.
export default function ClientCategory() {
  const { categoryId } = useParams();
  const category = categories.find((c) => c.id === categoryId);
  const specialties = category?.specialties ?? [];

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-6">
      <BackHeader label="Categorías" to="/" />
      <h1 className="mb-4 mt-2 font-caption text-lg font-bold text-navy dark:text-cream">{category?.label ?? categoryId}</h1>

      <div className="grid grid-cols-2 gap-2.5">
        {specialties.map((sp) =>
          sp.enabled ? (
            <Link key={sp.id} to={`/categoria/${categoryId}/${sp.id}`}>
              <div className="flex items-center justify-center gap-2 rounded-pill border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 hover:border-accent">
                <Icon name={sp.icon} className="text-lg text-navy dark:text-cream" />
                <span className="font-caption text-base font-bold text-navy dark:text-cream">{sp.label}</span>
              </div>
            </Link>
          ) : (
            <div key={sp.id} className="flex items-center justify-center gap-2 rounded-pill border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 opacity-40">
              <Icon name={sp.icon} className="text-lg text-navy dark:text-cream" />
              <span className="font-caption text-base font-bold text-navy dark:text-cream">{sp.label}</span>
            </div>
          )
        )}
      </div>

      <TabBar mode="client" />
    </div>
  );
}
