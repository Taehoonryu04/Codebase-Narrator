-- Phase 5-1: Source Traceability — add start_line / end_line to code_embeddings.
-- Run this in the Supabase SQL Editor.

-- 1. Add line-number columns (DEFAULT 1 backfills existing rows; real values
--    are written on the next analysis run via storeEmbeddings).
ALTER TABLE code_embeddings
  ADD COLUMN IF NOT EXISTS start_line int NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS end_line   int NOT NULL DEFAULT 1;

-- 2. Update vector-search RPC to return the new columns.
DROP FUNCTION IF EXISTS match_code_chunks(vector, text, text, integer);
CREATE OR REPLACE FUNCTION match_code_chunks(
  query_embedding vector(768),
  match_user_id   text,
  match_repo      text,
  match_count     int
) RETURNS TABLE (
  file_path   text,
  chunk_index int,
  content     text,
  start_line  int,
  end_line    int,
  similarity  float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.file_path,
    ce.chunk_index,
    ce.content,
    ce.start_line,
    ce.end_line,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM code_embeddings ce
  WHERE ce.user_id        = match_user_id
    AND ce.repo_full_name = match_repo
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 3. Update keyword-search RPC to return the new columns.
DROP FUNCTION IF EXISTS keyword_search_code_chunks(text, text, text, integer);
CREATE OR REPLACE FUNCTION keyword_search_code_chunks(
  match_user_id text,
  match_repo    text,
  keyword_query text,
  match_count   int
) RETURNS TABLE (
  file_path   text,
  chunk_index int,
  content     text,
  start_line  int,
  end_line    int,
  rank        float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.file_path,
    ce.chunk_index,
    ce.content,
    ce.start_line,
    ce.end_line,
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
