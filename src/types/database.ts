// Tipos manuales que reflejan supabase/migrations/0001_init.sql.
// Cuando el proyecto tenga Supabase CLI conectado, esto se puede
// reemplazar por tipos autogenerados (`supabase gen types typescript`)
// sin cambiar la forma en que se usan en los hooks.

export type FiscalStatus = "pendiente" | "en_revision" | "aprobado";
export type RequestMode = "ahora" | "agendado";
export type RequestStatus =
  | "buscando"
  | "pendiente"
  | "aceptada"
  | "rechazada"
  | "expirada"
  | "completada"
  | "cerrada";
export type SubscriptionStatus = "activa" | "pago_pendiente" | "pausada" | "cancelada";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  location_label: string | null;
  identity_verified: boolean;
  is_provider_active: boolean;
  fiscal_status: FiscalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProviderDetails {
  profile_id: string;
  category: string;
  specialties: string[];
  bio: string | null;
  work_zone: string | null;
  available_now: boolean;
  // Estadística pública opcional (se completa al importar un prestador con
  // historial previo a la app) — cuando está presente, la UI la prioriza
  // por sobre el promedio calculado de reviews en vivo. Ver migración 0004.
  rating_avg: number | null;
  rating_count: number | null;
  // Texto libre tipo "Mañana 9:00" para prestadores en modalidad
  // Agendado, mostrado en vez del badge "Disponible ahora".
  next_slot_label: string | null;
  // Para el mapa de "cerca tuyo" (Listing.tsx) — ver migración 0005.
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderListItem extends ProviderDetails {
  profile: Pick<Profile, "id" | "full_name" | "avatar_url" | "identity_verified">;
  distance_km?: number;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  provider_id: string | null;
  specialty: string;
  reason_chips: string[];
  description: string | null;
  photo_url: string | null;
  mode: RequestMode;
  status: RequestStatus;
  scheduled_for: string | null;
  attempt_count: number;
  max_attempts: number;
  requested_at: string;
  responded_at: string | null;
  completed_at: string | null;
  closed_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  service_request_id: string;
  client_id: string;
  provider_id: string;
  archived: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface Review {
  id: string;
  service_request_id: string;
  reviewer_id: string;
  provider_id: string;
  rating: number;
  quick_tags: string[];
  comment: string | null;
  created_at: string;
}

export interface ProviderGalleryItem {
  id: string;
  profile_id: string;
  image_url: string;
  created_at: string;
}

export interface Favorite {
  client_id: string;
  provider_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  profile_id: string;
  plan: string;
  amount_ars: number;
  status: SubscriptionStatus;
  renews_at: string | null;
}

export interface Notification {
  id: string;
  profile_id: string;
  type: string;
  title: string;
  body: string | null;
  urgency: "urgente" | "confirmacion" | "informativo";
  read_at: string | null;
  related_request_id: string | null;
  created_at: string;
}
