-- La política original de notifications ("for all" con profile_id =
-- auth.uid()) solo dejaba a cada usuario escribir en su propia bandeja —
-- pero las notificaciones se generan cuando OTRA persona hace algo (el
-- cliente pide un servicio y hay que avisarle al prestador, etc.), así
-- que quien inserta nunca es el destinatario. Se separa insert del resto:
-- cualquier autenticado puede crear una notificación (siempre disparada
-- desde una acción real de la app, no un formulario libre), pero solo el
-- destinatario puede leer/marcar como leída/borrar la suya.
drop policy if exists "notifications: el propio destinatario" on notifications;

create policy "notifications: cualquier autenticado puede crear" on notifications
  for insert with check (auth.role() = 'authenticated');

create policy "notifications: el propio destinatario lee y administra" on notifications
  for select using (profile_id = auth.uid());

create policy "notifications: el propio destinatario actualiza" on notifications
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "notifications: el propio destinatario borra" on notifications
  for delete using (profile_id = auth.uid());
