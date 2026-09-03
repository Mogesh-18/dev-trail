-- Enables Supabase Realtime (postgres_changes) events for the tables the
-- app subscribes to for live admin<->student sync. If any of these are
-- already in the publication (e.g. you enabled Realtime via the Table
-- Editor UI at some point), that one line will error with "already a
-- member" — just delete that line and re-run.
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table progress;
alter publication supabase_realtime add table assignments;