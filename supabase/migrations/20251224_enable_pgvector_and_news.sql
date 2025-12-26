-- Enable pgvector extension to support vector embeddings
create extension if not exists vector;

-- Create table for storing news items with embeddings
create table if not exists public.news_items (
    id uuid not null default gen_random_uuid(),
    ticker text not null,
    title text not null,
    link text not null,
    source text not null, -- e.g., 'WSJ', 'Bloomberg', 'Hankyung'
    published_at timestamp with time zone not null,
    snippet text null,
    embedding vector(768) null, -- 768 dimensions for Gemini text-embedding-004
    created_at timestamp with time zone not null default now(),
    constraint news_items_pkey primary key (id),
    constraint news_items_link_key unique (link)
);

-- Enable Row Level Security (RLS)
alter table public.news_items enable row level security;

-- Policy: Authenticated users can read news items
create policy "Authenticated users can read news items"
    on public.news_items
    for select
    to authenticated
    using (true);

-- Policy: Service role has full access (Implicit in Supabase, but adding for clarity if needed later)
-- Note: Ingestion will likely happen via Service Role key which bypasses RLS.

-- Create HNSW index for fast similarity search
create index if not exists news_items_embedding_idx
    on public.news_items
    using hnsw (embedding vector_cosine_ops);
