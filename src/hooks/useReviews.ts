import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Review } from "@/types/database";

export function useProviderReviews(providerId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", providerId],
    enabled: !!providerId,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    }
  });
}

export interface RatingSummary {
  avg: number;
  count: number;
}

// Promedio + cantidad de reseñas por prestador, para tarjetas de listado
// (mapa de UX 2.3/2.1) donde no vale la pena traer cada reseña completa.
export function useProviderRatings(providerIds: string[]) {
  return useQuery({
    queryKey: ["reviews", "ratings", providerIds],
    enabled: providerIds.length > 0,
    queryFn: async (): Promise<Record<string, RatingSummary>> => {
      const { data, error } = await supabase.from("reviews").select("provider_id, rating").in("provider_id", providerIds);
      if (error) throw error;

      const summary: Record<string, RatingSummary> = {};
      for (const row of (data ?? []) as { provider_id: string; rating: number }[]) {
        const current = summary[row.provider_id] ?? { avg: 0, count: 0 };
        const total = current.avg * current.count + row.rating;
        current.count += 1;
        current.avg = total / current.count;
        summary[row.provider_id] = current;
      }
      return summary;
    }
  });
}

interface SubmitReviewInput {
  serviceRequestId: string;
  reviewerId: string;
  providerId: string;
  rating: number;
  quickTags: string[];
  comment?: string;
}

// Pantalla de calificación (mapa de UX 5.3) — estrellas obligatorias +
// etiquetas rápidas, comentario opcional. "Omitir por ahora" simplemente
// no llama a este hook.
export function useSubmitReview() {
  return useMutation({
    mutationFn: async (input: SubmitReviewInput) => {
      const { error } = await supabase.from("reviews").insert({
        service_request_id: input.serviceRequestId,
        reviewer_id: input.reviewerId,
        provider_id: input.providerId,
        rating: input.rating,
        quick_tags: input.quickTags,
        comment: input.comment ?? null
      });
      if (error) throw error;

      await supabase.from("notifications").insert({
        profile_id: input.providerId,
        type: "resena_nueva",
        title: "Nueva reseña recibida",
        body: `${input.rating} estrellas${input.quickTags[0] ? ` · "${input.quickTags[0]}"` : ""}`,
        urgency: "informativo"
      });
    }
  });
}
