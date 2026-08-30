-- Agrega la columna de ubicación del cliente (si no existía) y crea el
-- perfil del usuario de prueba creado desde "Add user" en el panel.
alter table profiles add column if not exists location_label text;

insert into profiles (id, full_name, avatar_url, identity_verified, is_provider_active, fiscal_status, location_label)
values ('a34d6132-cd09-4608-9dcd-5b5236ef371b', 'Cliente Demo', null, true, false, 'pendiente', 'Palermo, CABA')
on conflict (id) do update set
  full_name = excluded.full_name,
  identity_verified = excluded.identity_verified,
  location_label = excluded.location_label;
