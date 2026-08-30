-- Activa Realtime (mensajes instantáneos en el chat) para las tablas que
-- lo necesitan. Sin esto, los mensajes nuevos solo aparecen al recargar
-- la página en vez de en el momento.
alter publication supabase_realtime add table messages;
