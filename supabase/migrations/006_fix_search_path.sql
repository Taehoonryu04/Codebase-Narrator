-- Migration: Fix mutable search_path on RPC functions
-- Fixes: Function Search Path Mutable warning (x2)
--
-- Adds SET search_path = public, pg_catalog to both functions so PostgreSQL
-- uses a fixed, predictable schema resolution path — preventing search_path
-- injection attacks. All function signatures and bodies are unchanged.

-- 1. Vector search RPC
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
) LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
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

-- 2. Keyword search RPC
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
) LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
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
