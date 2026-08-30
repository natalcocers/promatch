import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ProviderListItem } from "@/types/database";

// Listado filtrado por especialidad (mapa de UX 2.3). Solo trae
// prestadores que ya cumplen los tres estados de confianza: identidad
// verificada + fiscal aprobado + modo prestador activo — el resto no debe
// aparecer en búsquedas aunque tenga el perfil armado.
export function useProviders(specialty: string) {
  return useQuery({
    queryKey: ["providers", specialty],
    queryFn: async (): Promise<ProviderListItem[]> => {
      const { data, error } = await supabase
        .from("provider_details")
        .select(
          "*, profile:profiles!inner(id, full_name, avatar_url, identity_verified, fiscal_status, is_provider_active)"
        )
        .contains("specialties", [specialty])
        .eq("profile.identity_verified", true)
        .eq("profile.fiscal_status", "aprobado")
        .eq("profile.is_provider_active", true);

      if (error) throw error;
      return (data ?? []) as unknown as ProviderListItem[];
    }
  });
}

// "Cerca tuyo ahora" del home cliente (mapa de UX 2.1) — disponibles
// primero, cualquier especialidad (no hay geolocalización del cliente en
// este MVP, así que "cerca" queda como orden por disponibilidad).
export function useNearbyProviders(limit = 4) {
  return useQuery({
    queryKey: ["providers", "nearby", limit],
    queryFn: async (): Promise<ProviderListItem[]> => {
      const { data, error } = await supabase
        .from("provider_details")
        .select(
          "*, profile:profiles!inner(id, full_name, avatar_url, identity_verified, fiscal_status, is_provider_active)"
        )
        .eq("profile.identity_verified", true)
        .eq("profile.fiscal_status", "aprobado")
        .eq("profile.is_provider_active", true)
        .order("available_now", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as unknown as ProviderListItem[];
    }
  });
}

// Sin esto, buscar "martin" no encuentra "Martín": ilike de Postgres es
// case-insensitive pero no ignora acentos, y la mayoría escribe sin tilde.
// Se normaliza en el cliente en vez de en la query para no depender de la
// extensión unaccent en la base.
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Tab "Buscar" (mapa de UX 2.1, ícono de lupa en la barra de navegación
// inferior): busca por nombre del profesional entre los ya aprobados.
export function useSearchProviders(query: string) {
  return useQuery({
    queryKey: ["providers", "search", query],
    enabled: query.trim().length > 1,
    queryFn: async (): Promise<ProviderListItem[]> => {
      const { data, error } = await supabase
        .from("provider_details")
        .select(
          "*, profile:profiles!inner(id, full_name, avatar_url, identity_verified, fiscal_status, is_provider_active)"
        )
        .eq("profile.identity_verified", true)
        .eq("profile.fiscal_status", "aprobado")
        .eq("profile.is_provider_active", true);

      if (error) throw error;
      const results = (data ?? []) as unknown as ProviderListItem[];
      const needle = normalize(query);
      return results.filter((p) => normalize(p.profile.full_name).includes(needle));
    }
  });
}

export function useProvider(profileId: string | undefined) {
  return useQuery({
    queryKey: ["provider", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProviderListItem | null> => {
      const { data, error } = await supabase
        .from("provider_details")
        .select("*, profile:profiles(id, full_name, avatar_url, identity_verified, fiscal_status, is_provider_active)")
        .eq("profile_id", profileId)
        .single();

      if (error) throw error;
      return data as unknown as ProviderListItem;
    }
  });
}
