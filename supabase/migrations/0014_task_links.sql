-- Multiple reference links per task (docs, videos, repos, etc.),
-- separate from assignment_resources (which belong to assignments,
-- not tasks) and separate from notes/reports (which are free text).

create table if not exists task_links (
    id uuid primary key default gen_random_uuid(),
    task_id uuid not null references tasks(id) on delete cascade,
    url text not null,
    label text,
    created_at timestamptz not null default now()
);

create index if not exists task_links_task_id_idx on task_links(task_id);

alter table task_links enable row level security;

-- Both roles can read links for any task.
create policy "task_links_select" on task_links
    for select
    using (auth.uid() is not null);

-- Only admin can add/remove links (mirrors assignment_resources' admin-only write pattern).
create policy "task_links_insert_admin" on task_links
    for insert
    with check (is_admin());

create policy "task_links_delete_admin" on task_links
    for delete
    using (is_admin());