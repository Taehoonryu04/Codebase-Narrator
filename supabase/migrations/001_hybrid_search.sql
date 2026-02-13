-- Phase 4-2: Hybrid Search — FTS column + keyword search RPC
-- Run this in the Supabase SQL Editor.

-- 1. Add auto-generated tsvector column for full-text search.
--    GENERATED ALWAYS AS STORED auto-populates on INSERT/UPDATE
--    and backfills existing rows immediately.
ALTER TABLE code_embeddings
  ADD COLUMN content_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

-- 2. GIN index for fast FTS queries.
CREATE INDEX idx_code_embeddings_fts
  ON code_embeddings USING gin(content_tsv);

-- 3. Keyword search RPC using ts_rank + websearch_to_tsquery.
--    websearch_to_tsquery safely handles arbitrary user input
--    (stop words, punctuation, partial terms) without throwing.
CREATE OR REPLACE FUNCTION keyword_search_code_chunks(
  match_user_id text,
  match_repo    text,
  keyword_query text,
  match_count   int
) RETURNS TABLE (
  file_path   text,
  chunk_index int,
  content     text,
  rank        float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.file_path,
    ce.chunk_index,
    ce.content,
    ts_rank(ce.content_tsv,
            websearch_to_tsquery('english', keyword_query))::float AS rank
  FROM code_embeddings ce
  WHERE ce.user_id        = match_user_id
    AND ce.repo_full_name = match_repo
    AND ce.content_tsv   @@ websearch_to_tsquery('english', keyword_query)
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$;
