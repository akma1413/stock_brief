-- Create user_portfolios table
create table user_portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  ticker text not null,
  name text,
  exchange text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicate tickers for same user
  unique(user_id, ticker)
);

-- Enable Row Level Security
alter table user_portfolios enable row level security;

-- Create Policies
create policy "Users can view their own portfolio"
  on user_portfolios for select
  using ( auth.uid() = user_id );

create policy "Users can add to their own portfolio"
  on user_portfolios for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from their own portfolio"
  on user_portfolios for delete
  using ( auth.uid() = user_id );
