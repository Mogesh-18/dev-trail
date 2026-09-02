-- Allow each user to edit their own display name/avatar, but never role or
-- email (prevents privilege escalation): revoke broad update access, then
-- grant back only the two safe columns, plus a row-scoped RLS policy.
revoke update on profiles from authenticated;
grant update (display_name, avatar_url) on profiles to authenticated;

create policy "profiles updatable by owner only"
  on profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Public bucket for profile photos — fine for a public-by-nature asset;
-- everything sensitive (assignment files) stays in the private bucket from
-- Milestone 5.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar files readable by everyone"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatar files writable by their owner"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar files updatable by their owner"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);