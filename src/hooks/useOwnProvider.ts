import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ProviderDetails } from "@/types/database";

export function useOwnProviderDetails(profileId: string | undefined) {
  return useQuery({
    queryKey: ["own-provider-details", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProviderDetails | null> => {
      const { data, error } = await supabase
        .from("provider_details")
        .select("*")
        .eq("profile_id", profileId)
        .maybeSingle();
      if (error) throw error;
      return data as ProviderDetails | null;
    }
  });
}

// Activación del modo prestador (mapa de UX, arquitectura general): crea
// la fila de provider_details y prende is_provider_active en profiles.
// La aparición real en búsquedas sigue dependiendo de fiscal_status
// aprobado, que acá no se toca.
export function useActivateProviderMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { profileId: string; specialties: string[]; bio?: string; workZone?: string }) => {
      const { error: detailsError } = await supabase.from("provider_details").upsert({
        profile_id: input.profileId,
        category: "hogar",
        specialties: input.specialties,
        bio: input.bio ?? null,
        work_zone: input.workZone ?? null
      });
      if (detailsError) throw detailsError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_provider_active: true })
        .eq("id", input.profileId);
      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["own-provider-details"] });
    }
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { profileId: string; availableNow: boolean }) => {
      const { error } = await supabase
        .from("provider_details")
        .update({ available_now: input.availableNow })
        .eq("profile_id", input.profileId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["own-provider-details"] })
  });
}
