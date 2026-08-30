-- Perfil completo del prestador de prueba: identidad verificada + fiscal
-- aprobado + modo prestador activo (los tres requisitos para aparecer en
-- búsquedas, ver supabase/migrations/0001_init.sql) + disponible ahora +
-- suscripción activa.
insert into profiles (id, full_name, avatar_url, identity_verified, is_provider_active, fiscal_status)
values ('823c24ea-8c42-4507-8a25-cc82a8bdca30', 'Martín Pérez', null, true, true, 'aprobado')
on conflict (id) do update set
  full_name = excluded.full_name,
  identity_verified = excluded.identity_verified,
  is_provider_active = excluded.is_provider_active,
  fiscal_status = excluded.fiscal_status;

insert into provider_details (profile_id, category, specialties, bio, work_zone, available_now)
values (
  '823c24ea-8c42-4507-8a25-cc82a8bdca30',
  'hogar',
  array['plomeria'],
  '8 años de experiencia en plomería residencial. Especializado en urgencias, instalaciones y mantenimiento preventivo.',
  'Palermo, CABA',
  true
)
on conflict (profile_id) do update set
  specialties = excluded.specialties,
  bio = excluded.bio,
  work_zone = excluded.work_zone,
  available_now = excluded.available_now;

insert into subscriptions (profile_id, plan, amount_ars, status, renews_at)
values ('823c24ea-8c42-4507-8a25-cc82a8bdca30', 'profesional', 20000, 'activa', current_date + interval '30 days')
on conflict do nothing;
