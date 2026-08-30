import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Conversation, Message } from "@/types/database";

// Busca (o crea) la conversación de un pedido. Un service_request tiene
// como mucho una conversación — se crea al aceptar la solicitud.
export function useConversationForRequest(serviceRequestId: string | undefined) {
  return useQuery({
    queryKey: ["conversation", serviceRequestId],
    enabled: !!serviceRequestId,
    queryFn: async (): Promise<Conversation | null> => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("service_request_id", serviceRequestId)
        .maybeSingle();
      if (error) throw error;
      return data as Conversation | null;
    }
  });
}

// Idempotente a propósito: tanto el cliente (al armar el pedido) como el
// prestador (al aceptar) llaman a esto para el mismo service_request — sin
// este chequeo previo terminan en dos conversaciones distintas para el
// mismo pedido, cada uno viendo solo la mitad del chat.
export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { serviceRequestId: string; clientId: string; providerId: string }) => {
      const { data: existing, error: existingError } = await supabase
        .from("conversations")
        .select("*")
        .eq("service_request_id", input.serviceRequestId)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) return existing as Conversation;

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          service_request_id: input.serviceRequestId,
          client_id: input.clientId,
          provider_id: input.providerId
        })
        .select()
        .single();
      if (error) throw error;
      return data as Conversation;
    },
    onSuccess: (_data, vars) =>
      queryClient.invalidateQueries({ queryKey: ["conversation", vars.serviceRequestId] })
  });
}

export interface ConversationWithParties extends Conversation {
  client: { id: string; full_name: string; avatar_url: string | null };
  provider: { id: string; full_name: string; avatar_url: string | null };
}

// Trae la conversación con nombre/avatar de ambas partes, para el header
// del chat (mapa de UX 5.1) — "Martín Pérez" en vez de "Conversación".
export function useConversationDetails(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["conversation-details", conversationId],
    enabled: !!conversationId,
    queryFn: async (): Promise<ConversationWithParties> => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          "*, client:profiles!conversations_client_id_fkey(id, full_name, avatar_url), provider:profiles!conversations_provider_id_fkey(id, full_name, avatar_url)"
        )
        .eq("id", conversationId)
        .single();
      if (error) throw error;
      return data as unknown as ConversationWithParties;
    }
  });
}

// Mensajes con Realtime: carga el historial y se suscribe a inserts
// nuevos sobre la misma conversación (chat, mapa de UX 5.1).
export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    setLoading(true);

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active) {
          setMessages((data ?? []) as Message[]);
          setLoading(false);
        }
      });

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { messages, loading };
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (input: { conversationId: string; senderId: string; body: string }) => {
      const { error } = await supabase.from("messages").insert({
        conversation_id: input.conversationId,
        sender_id: input.senderId,
        body: input.body
      });
      if (error) throw error;
    }
  });
}
