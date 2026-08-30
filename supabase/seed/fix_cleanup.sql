-- Limpieza: borra los 3 usuarios de prueba que quedaron corruptos al
-- insertarlos directo por SQL en auth.users. El "on delete cascade" en
-- profiles/provider_details/subscriptions se encarga de borrar también
-- todo lo que dependía de ellos.
delete from auth.users where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);
