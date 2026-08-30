-- ProMatch — esquema inicial (MVP: circuito Hogar → Plomería)
-- Ver docs/ProMatch-mapa-completo-UX.md para el detalle de producto detrás
-- de cada tabla.

create extension if not exists "uuid-ossp";
create extension if not exists postgis;
create extension if not exists pgcrypto; -- crypt()/gen_salt() usados por supabase/seed/seed.sql

-- ─────────────────────────────────────────────────────────────────────────
-- Tipos
-- ─────────────────────────────────────────────────────────────────────────

-- identity_verified (bool, en profiles) y fiscal_status son ESTADOS DE
-- CONFIANZA INDEPENDIENTES (mapa de UX, sección 1): un prestador puede
-- tener la identidad verificada y el fiscal todavía "en_revision" — en ese
-- caso su perfil existe pero no aparece en búsquedas todavía.
create type fiscal_status as enum ('pendiente', 'en_revision', 'aprobado');

create type request_mode as enum ('ahora', 'agendado');

create type request_status as enum (
  'buscando',      -- reenviándose entre prestadores (solo modalidad "ahora")
  'pendiente',     -- esperando respuesta del prestador (modalidad "agendado")
  'aceptada',
  'rechazada',
  'expirada',      -- se agotaron los intentos de reenvío
  'completada',    -- prestador marcó "trabajo terminado"
  'cerrada'        -- cliente confirmó el cierre (puede calificar)
);

create type subscription_status as enum ('activa', 'pago_pendiente', 'pausada', 'cancelada');

-- ─────────────────────────────────────────────────────────────────────────
-- profiles — un único usuario, ambos roles posibles sobre la misma cuenta
-- ─────────────────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  phone text,

  identity_verified boolean not null default false,

  is_provider_active boolean not null default false,
  fiscal_status fiscal_status not null default 'pendiente',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un prestador solo debe aparecer en resultados de búsqueda cuando
-- identity_verified = true AND fiscal_status = 'aprobado' AND
-- is_provider_active = true. Esa condición se aplica en las queries de
-- listado (src/hooks/useProviders.ts), no acá — se deja documentada.

-- ─────────────────────────────────────────────────────────────────────────
-- provider_details — 1:1 con profiles cuando is_provider_active
-- ─────────────────────────────────────────────────────────────────────────
create table provider_details (
  profile_id uuid primary key references profiles(id) on delete cascade,
  category text not null default 'hogar',
  specialties text[] not null default '{}', -- ej. {"plomeria"}
  bio text,
  work_zone text,
  location geography(point, 4326), -- para "cerca tuyo" (PostGIS)
  available_now boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index provider_details_location_idx on provider_details using gist (location);

-- ─────────────────────────────────────────────────────────────────────────
-- provider_gallery — fotos de trabajos realizados (opcional en el perfil)
-- ─────────────────────────────────────────────────────────────────────────
create table provider_gallery (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- service_requests — el pedido armado por el cliente (form → chat)
-- ─────────────────────────────────────────────────────────────────────────
create table service_requests (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references profiles(id) on delete cascade,
  provider_id uuid references profiles(id) on delete set null,

  specialty text not null, -- ej. "plomeria"
  reason_chips text[] not null default '{}', -- ej. {"Pérdida de agua"}
  description text,
  photo_url text,

  mode request_mode not null,
  status request_status not null default 'pendiente',

  scheduled_for timestamptz, -- solo si mode = 'agendado'

  attempt_count int not null default 1, -- para el "Intento X de N" de modalidad "ahora"
  max_attempts int not null default 4,
  requested_at timestamptz not null default now(),
  responded_at timestamptz,

  completed_at timestamptz, -- prestador marcó "terminado"
  closed_at timestamptz,    -- cliente confirmó el cierre

  created_at timestamptz not null default now()
);

create index service_requests_client_idx on service_requests (client_id);
create index service_requests_provider_idx on service_requests (provider_id);

-- ─────────────────────────────────────────────────────────────────────────
-- conversations / messages — chat con tarjeta de contexto pineada
-- ─────────────────────────────────────────────────────────────────────────
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  provider_id uuid not null references profiles(id) on delete cascade,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on messages (conversation_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- reviews — calificación al cierre del servicio
-- ─────────────────────────────────────────────────────────────────────────
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  provider_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  quick_tags text[] not null default '{}', -- ej. {"Puntual","Prolijo"}
  comment text,
  created_at timestamptz not null default now(),
  unique (service_request_id) -- un solo review por servicio
);

-- ─────────────────────────────────────────────────────────────────────────
-- favorites — cliente + prestador guardado
-- ─────────────────────────────────────────────────────────────────────────
create table favorites (
  client_id uuid not null references profiles(id) on delete cascade,
  provider_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (client_id, provider_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- subscriptions — plan del prestador (Plan Profesional $20.000 ARS/mes)
-- ─────────────────────────────────────────────────────────────────────────
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  plan text not null default 'profesional',
  amount_ars numeric(10, 2) not null default 20000,
  status subscription_status not null default 'pago_pendiente',
  renews_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- notifications — centro in-app (push nativo queda para una fase posterior)
-- ─────────────────────────────────────────────────────────────────────────
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null, -- ej. "solicitud_nueva", "fiscal_aprobado", "mensaje_nuevo"
  title text not null,
  body text,
  urgency text not null default 'informativo', -- 'urgente' | 'confirmacion' | 'informativo'
  read_at timestamptz,
  related_request_id uuid references service_requests(id) on delete set null,
  created_at timestamptz not null default now()
);

create index notifications_profile_idx on notifications (profile_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security — encendido en todas las tablas con datos de usuario.
-- Políticas mínimas para el MVP: cada quien lee/escribe lo suyo; los
-- prestadores verificados+aprobados son visibles para cualquier cliente
-- autenticado.
-- ─────────────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table provider_details enable row level security;
alter table provider_gallery enable row level security;
alter table service_requests enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table subscriptions enable row level security;
alter table notifications enable row level security;

-- Lectura amplia para cualquier usuario autenticado: hace falta para
-- mostrar nombre/avatar de la otra parte en listados, perfiles de
-- prestador, chat y reseñas. Los datos realmente sensibles (fiscal_status,
-- phone) están acá porque el MVP no separa una vista pública todavía —
-- si más adelante se necesita ocultarlos de otros usuarios, se resuelve
-- con una view separada, no restringiendo esta policy (eso rompería el
-- resto de las queries que hacen join a profiles).
create policy "profiles: lectura para autenticados" on profiles
  for select using (auth.role() = 'authenticated');
create policy "profiles: actualizar el propio" on profiles
  for update using (auth.uid() = id);
create policy "profiles: insertar el propio" on profiles
  for insert with check (auth.uid() = id);

create policy "provider_details: lectura pública de prestadores aprobados" on provider_details
  for select using (
    exists (
      select 1 from profiles p
      where p.id = provider_details.profile_id
        and p.identity_verified = true
        and p.fiscal_status = 'aprobado'
        and p.is_provider_active = true
    )
    or profile_id = auth.uid()
  );
create policy "provider_details: el prestador edita lo suyo" on provider_details
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "service_requests: partes involucradas" on service_requests
  for all using (client_id = auth.uid() or provider_id = auth.uid())
  with check (client_id = auth.uid() or provider_id = auth.uid());

create policy "conversations: partes involucradas" on conversations
  for all using (client_id = auth.uid() or provider_id = auth.uid())
  with check (client_id = auth.uid() or provider_id = auth.uid());

create policy "messages: partes de la conversación" on messages
  for all using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.client_id = auth.uid() or c.provider_id = auth.uid())
    )
  );

create policy "reviews: lectura pública" on reviews for select using (true);
create policy "reviews: el cliente que califica" on reviews
  for insert with check (reviewer_id = auth.uid());

create policy "favorites: el propio cliente" on favorites
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());

create policy "subscriptions: el propio prestador" on subscriptions
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "notifications: el propio destinatario" on notifications
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
