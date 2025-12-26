-- Create user_settings table
create table if not exists user_settings (
  user_id uuid references auth.users not null primary key,
  tone text default 'professional' check (tone in ('professional', 'beginner', 'witty')),
  length text default 'concise' check (length in ('concise', 'detailed')),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table user_settings enable row level security;

-- Create Policy: Users can view their own settings
create policy "Users can view their own settings"
  on user_settings for select
  using ( auth.uid() = user_id );

-- Create Policy: Users can update their own settings
-- (Upsert is handled by insert with on conflict)
create policy "Users can insert/update their own settings"
  on user_settings for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Create a handle to auto-create settings on user signup (Trigger) - Optional but good practice
-- For now, we'll handle 'missing settings' in the application logic (lazy creation).
