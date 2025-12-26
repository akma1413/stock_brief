-- Function to text match news items using vector similarity
create or replace function match_news_items (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  ticker text,
  title text,
  link text,
  source text,
  snippet text,
  published_at timestamp with time zone,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    news_items.id,
    news_items.ticker,
    news_items.title,
    news_items.link,
    news_items.source,
    news_items.snippet,
    news_items.published_at,
    1 - (news_items.embedding <=> query_embedding) as similarity
  from news_items
  where 1 - (news_items.embedding <=> query_embedding) > match_threshold
  order by news_items.embedding <=> query_embedding
  limit match_count;
end;
$$;
