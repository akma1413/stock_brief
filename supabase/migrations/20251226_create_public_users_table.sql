-- Create a table for public profiles (Leads DB)
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  provider text,
  meta_data jsonb, -- Stores all raw metadata (locale, verified status, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_sign_in_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;

-- Users can view their own profile
create policy "Users can view their own profile"
  on public.users for select
  using ( auth.uid() = id );

-- Service role/Admins can view all profiles (for marketing purposes)
create policy "Admins can view all profiles"
    on public.users for select
    using ( true );

-- Create a function to handle new user entries
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
    new.raw_user_meta_data, -- Capture all metadata for marketing
    new.created_at,
    new.last_sign_in_at
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically run the function when a new user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
