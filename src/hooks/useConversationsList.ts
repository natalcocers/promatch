import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface ConversationListItem {
  id: string;
  service_request_id: string;
  other_name: string;
  other_avatar: string | null;
  archived: boolean;
  last_message: string | null;
}

// Lista de conversaciones del usuario actual, sea cliente o prestador en
// esa conversación puntual (un mismo usuario puede tener ambas si activó
// el modo prestador).
export function useConversationsList(profileId: string | undefined) {
  return useQuery({
    queryKey: ["conversations-list", profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ConversationListItem[]> => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, service_request_id, archived, client:profiles!conversations_client_id_fkey(id, full_name, avatar_url), provider:profiles!conversations_provider_id_fkey(id, full_name, avatar_url)"
        )
        .or(`client_id.eq.${profileId},provider_id.eq.${profileId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((c: any) => ({
        id: c.id,
        service_request_id: c.service_request_id,
        archived: c.archived,
        other_name: c.client?.id === profileId ? c.provider?.full_name : c.client?.full_name,
        other_avatar: c.client?.id === profileId ? c.provider?.avatar_url : c.client?.avatar_url,
        last_message: null
      }));
    }
  });
}
