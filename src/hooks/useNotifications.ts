import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Notification } from "@/types/database";

// Centro de notificaciones (mapa de UX sección 6). Se agrupan por
// recencia (Hoy / Ayer / Esta semana) en la pantalla, no acá — este hook
// solo trae la lista ordenada por fecha.
export function useNotifications(profileId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Notification[];
    }
  });
}
