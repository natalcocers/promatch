-- Datos de ejemplo para probar el circuito Hogar → Plomería en local.
-- Se corre automáticamente con `supabase db reset` (Supabase CLI).
-- Crea usuarios directo en auth.users (solo válido en local/dev, nunca en
-- producción) para no depender del flujo de signup por email.

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'cliente.demo@promatch.test', crypt('promatch123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'plomero.rodriguez@promatch.test', crypt('promatch123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'plomera.gimenez@promatch.test', crypt('promatch123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
on conflict (id) do nothing;

-- Supabase Auth valida el login por email/contraseña contra auth.identities,
-- no solo auth.users — sin esta fila, "Invalid login credentials" aunque el
-- usuario y el hash de contraseña estén bien.
insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
  uuid_generate_v4(),
  id,
  id::text,
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  'email',
  now(),
  now(),
  now()
from auth.users
where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
)
on conflict do nothing;

insert into profiles (id, full_name, avatar_url, identity_verified, is_provider_active, fiscal_status)
values
  ('11111111-1111-1111-1111-111111111111', 'Cliente Demo', null, true, false, 'pendiente'),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Rodríguez', null, true, true, 'aprobado'),
  ('33333333-3333-3333-3333-333333333333', 'Marina Giménez', null, true, true, 'aprobado')
on conflict (id) do nothing;

insert into provider_details (profile_id, category, specialties, bio, work_zone, location, available_now)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'hogar',
    array['plomeria'],
    'Plomero matriculado, 12 años de experiencia en CABA. Especialista en destapes y pérdidas de agua.',
    'Palermo, CABA',
    st_setsrid(st_makepoint(-58.4260, -34.5885), 4326)::geography,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'hogar',
    array['plomeria'],
    'Instalaciones y reparaciones de plomería para hogares y comercios. Presupuesto sin cargo.',
    'Belgrano, CABA',
    st_setsrid(st_makepoint(-58.4560, -34.5620), 4326)::geography,
    false
  )
on conflict (profile_id) do nothing;

insert into subscriptions (profile_id, plan, amount_ars, status, renews_at)
values
  ('22222222-2222-2222-2222-222222222222', 'profesional', 20000, 'activa', current_date + interval '30 days'),
  ('33333333-3333-3333-3333-333333333333', 'profesional', 20000, 'activa', current_date + interval '12 days')
on conflict do nothing;
