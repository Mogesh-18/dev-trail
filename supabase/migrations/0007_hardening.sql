-- Centralizes the "is this user the admin?" check used across every
-- admin-only write policy so far. Not rewriting the ~15 existing policies to
-- use it — that's a lot of drop/recreate statements to hand-type correctly
-- across chat with no real security upside — but every new admin-only
-- policy from here on should use this instead of repeating the subquery.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Gap from Milestone 8: users could upload/replace an avatar but had no
-- policy allowing them to delete one.
create policy "avatar files deletable by their owner"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);