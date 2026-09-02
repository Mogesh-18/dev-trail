create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('in_progress','completed','skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, task_id)
);

create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  entity_type text not null check (entity_type in ('task','assignment')),
  entity_id uuid not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table progress enable row level security;
alter table activity enable row level security;

create policy "progress readable by owner or admin"
  on progress for select to authenticated
  using (
    student_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "progress writable by owning student only"
  on progress for insert to authenticated
  with check (student_id = auth.uid());

create policy "progress updatable by owning student only"
  on progress for update to authenticated
  using (student_id = auth.uid());

create policy "progress deletable by owning student only"
  on progress for delete to authenticated
  using (student_id = auth.uid());

create policy "activity readable by owner or admin"
  on activity for select to authenticated
  using (
    actor_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "activity insertable by the acting user only"
  on activity for insert to authenticated
  with check (actor_id = auth.uid());