import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Notification, RequestMode, ServiceRequest } from "@/types/database";

// Centro de notificaciones (mapa de UX sección 6) — se dispara acá, en el
// mismo punto donde cambia el estado real, para no duplicar la lógica de
// "qué pasó" en cada pantalla que consume notifications.
function notify(input: Pick<Notification, "profile_id" | "type" | "title" | "body" | "urgency"> & { related_request_id?: string }) {
  return supabase.from("notifications").insert({
    profile_id: input.profile_id,
    type: input.type,
    title: input.title,
    body: input.body,
    urgency: input.urgency,
    related_request_id: input.related_request_id ?? null
  });
}

interface CreateRequestInput {
  clientId: string;
  providerId: string;
  specialty: string;
  reasonChips: string[];
  description?: string;
  mode: RequestMode;
  scheduledFor?: string;
}

// Formulario de contacto → arma el pedido (mapa de UX 2.5). Al crearse,
// el llamador es responsable de abrir/crear la conversación asociada
// (ver useConversation) para que el pedido sea la primera tarjeta pineada.
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRequestInput): Promise<ServiceRequest> => {
      const { data, error } = await supabase
        .from("service_requests")
        .insert({
          client_id: input.clientId,
          provider_id: input.providerId,
          specialty: input.specialty,
          reason_chips: input.reasonChips,
          description: input.description ?? null,
          mode: input.mode,
          scheduled_for: input.scheduledFor ?? null,
          status: input.mode === "ahora" ? "buscando" : "pendiente"
        })
        .select()
        .single();

      if (error) throw error;

      await notify({
        profile_id: input.providerId,
        type: "solicitud_nueva",
        title: input.mode === "ahora" ? "Nueva solicitud urgente" : "Nueva solicitud agendada",
        body: input.reasonChips[0] ?? input.specialty,
        urgency: input.mode === "ahora" ? "urgente" : "informativo",
        related_request_id: data.id
      });

      return data as ServiceRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    }
  });
}

export function useServiceRequest(id: string | undefined, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["service-request", id],
    enabled: !!id,
    refetchInterval: options?.refetchInterval,
    queryFn: async (): Promise<ServiceRequest> => {
      const { data, error } = await supabase.from("service_requests").select("*").eq("id", id).single();
      if (error) throw error;
      return data as ServiceRequest;
    }
  });
}

// Solicitudes entrantes del prestador (mapa de UX 3.1) — más nuevas primero.
export function useIncomingRequests(providerId: string | undefined) {
  return useQuery({
    queryKey: ["service-requests", "incoming", providerId],
    enabled: !!providerId,
    queryFn: async (): Promise<ServiceRequest[]> => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("provider_id", providerId)
        .in("status", ["buscando", "pendiente"])
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as ServiceRequest[];
    }
  });
}

// Todas las solicitudes del prestador (mapa de UX sección 8) — el
// calendario necesita tanto los turnos agendados/aceptados como las
// solicitudes "ahora" pendientes (para el punto naranja del selector).
export function useProviderAgenda(providerId: string | undefined) {
  return useQuery({
    queryKey: ["service-requests", "agenda", providerId],
    enabled: !!providerId,
    queryFn: async (): Promise<ServiceRequest[]> => {
      const { data, error } = await supabase.from("service_requests").select("*").eq("provider_id", providerId);
      if (error) throw error;
      return (data ?? []) as ServiceRequest[];
    }
  });
}

export function useRespondToRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, accept }: { id: string; accept: boolean }) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({ status: accept ? "aceptada" : "rechazada", responded_at: new Date().toISOString() })
        .eq("id", id)
        .select("client_id, specialty, reason_chips")
        .single();
      if (error) throw error;

      await notify({
        profile_id: data.client_id,
        type: accept ? "solicitud_aceptada" : "solicitud_rechazada",
        title: accept ? "El profesional aceptó tu pedido" : "El profesional no puede tomar tu pedido",
        body: data.reason_chips?.[0] ?? data.specialty,
        urgency: "informativo",
        related_request_id: id
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] })
  });
}

// Cierre del servicio (mapa de UX 5.2): el prestador marca "terminado",
// el cliente confirma. Son dos pasos separados a propósito.
export function useMarkCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({ status: "completada", completed_at: new Date().toISOString() })
        .eq("id", id)
        .select("client_id, specialty, reason_chips")
        .single();
      if (error) throw error;

      await notify({
        profile_id: data.client_id,
        type: "trabajo_terminado",
        title: "El profesional marcó el trabajo como terminado",
        body: data.reason_chips?.[0] ?? data.specialty,
        urgency: "informativo",
        related_request_id: id
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] })
  });
}

// El cliente cancela la búsqueda mientras espera respuesta (mapa de UX
// 2.6) — "Cancelar búsqueda" siempre visible, nunca un callejón sin salida.
export function useCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_requests").update({ status: "expirada" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] })
  });
}

export function useConfirmClosed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: "cerrada", closed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] })
  });
}
