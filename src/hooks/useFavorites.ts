import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ProviderListItem } from "@/types/database";

export interface FavoriteListItem extends ProviderListItem {
  times_used: number;
}

// Favoritos del cliente (mapa de UX sección 7): cada guardado con su
// disponibilidad actual + cuántas veces usó a ese profesional (servicios
// cerrados entre ambos), no la fecha de guardado.
export function useFavorites(clientId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", clientId],
    enabled: !!clientId,
    queryFn: async (): Promise<FavoriteListItem[]> => {
      // favorites.provider_id referencia profiles(id), no provider_details
      // — no hay foreign key directa entre favorites y provider_details
      // para que PostgREST la embeba en un solo select, así que se resuelve
      // en dos pasos: primero los ids guardados, después sus provider_details.
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select("provider_id, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!favorites?.length) return [];

      const providerIds = favorites.map((f) => f.provider_id);

      const { data: providers, error: providersError } = await supabase
        .from("provider_details")
        .select("*, profile:profiles!inner(id, full_name, avatar_url, identity_verified)")
        .in("profile_id", providerIds);
      if (providersError) throw providersError;

      const byId = new Map((providers ?? []).map((p: any) => [p.profile_id, p as ProviderListItem]));

      return Promise.all(
        favorites
          .filter((f) => byId.has(f.provider_id))
          .map(async (f) => {
            const { count } = await supabase
              .from("service_requests")
              .select("id", { count: "exact", head: true })
              .eq("client_id", clientId)
              .eq("provider_id", f.provider_id)
              .eq("status", "cerrada");

            return { ...byId.get(f.provider_id)!, times_used: count ?? 0 };
          })
      );
    }
  });
}

export function useIsFavorite(clientId: string | undefined, providerId: string | undefined) {
  return useQuery({
    queryKey: ["favorite", clientId, providerId],
    enabled: !!clientId && !!providerId,
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from("favorites")
        .select("client_id")
        .eq("client_id", clientId)
        .eq("provider_id", providerId)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    }
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { clientId: string; providerId: string; isFavorite: boolean }) => {
      if (input.isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("client_id", input.clientId)
          .eq("provider_id", input.providerId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ client_id: input.clientId, provider_id: input.providerId });
        if (error) throw error;
      }
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["favorite", vars.clientId, vars.providerId] });
      queryClient.invalidateQueries({ queryKey: ["favorites", vars.clientId] });
    }
  });
}
