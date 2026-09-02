create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  context_type text not null check (context_type in ('task','assignment','progress','admin_feedback')),
  context_id uuid not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

create policy "notes readable by authenticated users"
  on notes for select to authenticated using (true);

create policy "notes insertable by the author only"
  on notes for insert to authenticated
  with check (author_id = auth.uid());

create policy "notes deletable by the author only"
  on notes for delete to authenticated
  using (author_id = auth.uid());