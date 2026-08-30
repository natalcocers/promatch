-- Estadística pública opcional del prestador (rating_avg/rating_count) y
-- etiqueta de próximo turno para modalidad Agendado (next_slot_label,
-- ej. "Mañana 9:00"). Se usan para prestadores importados con historial
-- previo a la app — cuando están presentes, la UI las prioriza por sobre
-- el promedio calculado en vivo de la tabla reviews.
alter table provider_details add column if not exists rating_avg numeric(2, 1);
alter table provider_details add column if not exists rating_count int;
alter table provider_details add column if not exists next_slot_label text;
