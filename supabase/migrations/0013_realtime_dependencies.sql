-- Closes a real gap from the original Realtime setup (0010): prerequisite
-- changes never synced live because task_dependencies was never added to
-- the publication, even though the subscription code (below) needed it.
alter publication supabase_realtime add table task_dependencies;