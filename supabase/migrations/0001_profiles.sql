create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin', 'student')),
  display_name text,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Both accounts may read both profiles (only two users; admin needs to see
-- the student's name/avatar and vice versa).
create policy "profiles readable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

-- Deliberately NO insert/update/delete policy for the `authenticated` role.
-- That means role assignment can only happen via the service-role key in
-- /api/auth-allowlist-check.js, which bypasses RLS — never from the browser.