create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instructions text,
  requirements text,
  acceptance_criteria text,
  status text not null default 'not_started' check (status in ('not_started','in_progress','submitted','under_review','changes_requested','completed')),
  deadline date,
  estimated_minutes integer,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assignment_task_links (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (assignment_id, task_id)
);

create table if not exists assignment_resources (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  type text not null check (type in ('file','link','note')),
  url text not null,
  label text,
  created_at timestamptz not null default now()
);

alter table assignments enable row level security;
alter table assignment_task_links enable row level security;
alter table assignment_resources enable row level security;

create policy "assignments readable by authenticated users"
  on assignments for select to authenticated using (true);
create policy "assignments writable by admin only"
  on assignments for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "assignments updatable by admin only"
  on assignments for update to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "assignments deletable by admin only"
  on assignments for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "assignment_task_links readable by authenticated users"
  on assignment_task_links for select to authenticated using (true);
create policy "assignment_task_links writable by admin only"
  on assignment_task_links for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "assignment_task_links deletable by admin only"
  on assignment_task_links for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "assignment_resources readable by authenticated users"
  on assignment_resources for select to authenticated using (true);
create policy "assignment_resources writable by admin only"
  on assignment_resources for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "assignment_resources deletable by admin only"
  on assignment_resources for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Storage bucket for uploaded assignment files (private; served via signed URLs)
insert into storage.buckets (id, name, public)
values ('assignment-resources', 'assignment-resources', false)
on conflict (id) do nothing;

create policy "assignment resource files readable by authenticated users"
  on storage.objects for select to authenticated
  using (bucket_id = 'assignment-resources');

create policy "assignment resource files writable by admin only"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'assignment-resources'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "assignment resource files deletable by admin only"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'assignment-resources'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );