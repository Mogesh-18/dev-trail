create table if not exists task_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructions text,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  estimated_minutes integer,
  completion_criteria text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table task_templates enable row level security;

create policy "task_templates readable by authenticated users"
  on task_templates for select to authenticated using (true);

create policy "task_templates writable by admin only"
  on task_templates for insert to authenticated
  with check (is_admin());

create policy "task_templates deletable by admin only"
  on task_templates for delete to authenticated
  using (is_admin());