-- Ubicación de texto libre del cliente (ej. "Palermo, CABA"), para el
-- saludo del home cliente (docs/promatch_home_cliente_mockup.html). No
-- confundir con provider_details.location (geography, para "cerca tuyo").
-- Es texto libre porque no hay geolocalización real del cliente en este
-- MVP — lo carga la persona misma en "Mi perfil".
alter table profiles add column if not exists location_label text;
