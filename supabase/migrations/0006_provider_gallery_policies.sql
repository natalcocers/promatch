-- provider_gallery tenía RLS activado (0001_init.sql) pero nunca se le
-- creó ninguna política — con RLS encendido y cero políticas, Postgres
-- deniega todo por default, así que "Trabajos realizados" en el perfil
-- del profesional siempre devolvía vacío para cualquier usuario. Mismo
-- criterio que reviews (lectura pública) y provider_details (el propio
-- prestador administra lo suyo).
create policy "provider_gallery: lectura pública" on provider_gallery
  for select using (true);

create policy "provider_gallery: el propio prestador administra" on provider_gallery
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
