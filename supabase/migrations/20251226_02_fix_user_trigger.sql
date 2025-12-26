-- Fix user creation trigger to be more robust
-- 1. Use ON CONFLICT to handle cases where the user might already exist
-- 2. Set search_path to public to ensure correct table resolution (Critical fix for "Database error saving new user")
-- 3. Use SECURITY DEFINER to ensure it runs with privileges

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url, provider, meta_data, created_at, last_sign_in_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.app_metadata->>'provider',
    new.raw_user_meta_data,
    new.created_at,
    new.last_sign_in_at
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    provider = excluded.provider,
    meta_data = excluded.meta_data,
    last_sign_in_at = excluded.last_sign_in_at;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Ensure the trigger is set
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
