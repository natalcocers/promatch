import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ProviderGalleryItem } from "@/types/database";

// Galería de trabajos realizados (perfil del profesional y perfil
// editable del prestador, mapa de UX 2.4 y 3.3). Sin upload todavía —
// no hay bucket de Storage configurado en este MVP, ver README.
export function useProviderGallery(profileId: string | undefined) {
  return useQuery({
    queryKey: ["gallery", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProviderGalleryItem[]> => {
      const { data, error } = await supabase
        .from("provider_gallery")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProviderGalleryItem[];
    }
  });
}
