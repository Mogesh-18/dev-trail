create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructions text,
  order_index integer not null default 0,
  status text not null default 'not_set' check (status in ('not_set', 'in_progress', 'completed', 'skipped')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  estimated_minutes integer,
  due_date date,
  learning_objectives text[] not null default '{}',
  completion_criteria text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 'not_set' means no stored progress row for the student yet — the
-- available/locked distinction is DERIVED (see task-availability.service.js),
-- never stored, so it can't drift out of sync with dependency changes.

create table if not exists task_dependencies (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  prerequisite_task_id uuid not null references tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (task_id, prerequisite_task_id),
  check (task_id <> prerequisite_task_id)
);

alter table tasks enable row level security;
alter table task_dependencies enable row level security;

create policy "tasks readable by authenticated users"
  on tasks for select to authenticated using (true);

create policy "tasks writable by admin only"
  on tasks for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "tasks updatable by admin only"
  on tasks for update to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "tasks deletable by admin only"
  on tasks for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "task_dependencies readable by authenticated users"
  on task_dependencies for select to authenticated using (true);

create policy "task_dependencies writable by admin only"
  on task_dependencies for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "task_dependencies deletable by admin only"
  on task_dependencies for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));