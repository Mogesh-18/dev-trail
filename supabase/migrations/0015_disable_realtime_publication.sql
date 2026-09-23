-- Finishes removing Realtime at the database level. The client-side
-- RealtimeProvider and useTaskPresence were already deleted from the
-- app; this stops Postgres from publishing change events for these
-- tables at all, which is the DB-side equivalent of removing the
-- feature.
--
-- This does NOT drop any actual tables or columns — Realtime never
-- created dedicated tables/columns of its own. Migrations 0010 and
-- 0013 only added these existing, actively-used data tables to the
-- supabase_realtime publication. Dropping the tables themselves would
-- delete your tasks/progress/assignments data, which isn't what
-- "remove the realtime feature" means here.

alter publication supabase_realtime drop table tasks;
alter publication supabase_realtime drop table progress;
alter publication supabase_realtime drop table assignments;
alter publication supabase_realtime drop table task_dependencies;