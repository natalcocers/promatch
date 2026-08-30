-- Latitud/longitud en texto plano para el mapa de "cerca tuyo" (mapa de
-- UX 2.3, pedido explícito de Natalia). provider_details ya tenía una
-- columna `location geography(point,4326)` reservada para búsquedas por
-- radio con PostGIS, pero leerla de vuelta vía PostgREST devuelve WKB
-- hexadecimal (no apto para consumir directo del cliente sin decodificar).
-- Para el mapa en sí, dos columnas numéricas simples alcanzan y evitan esa
-- complejidad — la columna geography queda intacta para el día que se
-- necesite una búsqueda real por distancia en el backend.
alter table provider_details add column if not exists location_lat double precision;
alter table provider_details add column if not exists location_lng double precision;
