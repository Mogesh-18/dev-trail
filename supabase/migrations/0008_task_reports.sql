create table if not exists task_reports (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  title text,
  body text not null,
  created_at timestamptz not null default now()
);

alter table task_reports enable row level security;

create policy "task_reports readable by authenticated users"
  on task_reports for select to authenticated using (true);

create policy "task_reports insertable by the student only"
  on task_reports for insert to authenticated
  with check (
    student_id = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role = 'student')
  );

-- Deletable by the authoring student (undo a mistaken entry) OR the admin
-- (moderation) — using the is_admin() helper from 0007_hardening.sql.
create policy "task_reports deletable by author or admin"
  on task_reports for delete to authenticated
  using (student_id = auth.uid() or is_admin());