import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Subscription } from "@/types/database";

// Suscripción del prestador (mapa de UX sección 9). Plan Profesional fijo,
// sin comisión por servicio — ver docs/promatch-brand-brief.md.
export function useSubscription(profileId: string | undefined) {
  return useQuery({
    queryKey: ["subscription", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<Subscription | null> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("profile_id", profileId)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    }
  });
}

// Activa el Plan Profesional en estado "pago_pendiente" — el pago real
// (Mercado Pago) queda fuera de este MVP (ver README), esto solo crea el
// registro para que el resto de la UI tenga algo real que mostrar.
export function useStartSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase.from("subscriptions").insert({ profile_id: profileId });
      if (error) throw error;
    },
    onSuccess: (_data, profileId) => queryClient.invalidateQueries({ queryKey: ["subscription", profileId] })
  });
}

export function useSetSubscriptionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; profileId: string; status: Subscription["status"] }) => {
      const { error } = await supabase.from("subscriptions").update({ status: input.status }).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => queryClient.invalidateQueries({ queryKey: ["subscription", vars.profileId] })
  });
}
