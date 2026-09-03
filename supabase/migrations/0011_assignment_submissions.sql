-- Separate from assignment_resources (admin-provided materials): this is
-- the student's own submitted work. Different writer, different purpose —
-- same reasoning as keeping task_reports separate from notes.
create table if not exists assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'code' check (type in ('code')),
  url text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table assignment_submissions enable row level security;

create policy "assignment_submissions readable by authenticated users"
  on assignment_submissions for select to authenticated using (true);

create policy "assignment_submissions insertable by the student only"
  on assignment_submissions for insert to authenticated
  with check (
    student_id = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role = 'student')
  );

create policy "assignment_submissions deletable by author or admin"
  on assignment_submissions for delete to authenticated
  using (student_id = auth.uid() or is_admin());