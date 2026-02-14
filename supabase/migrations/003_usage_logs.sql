-- Phase 5-3: Performance & Cost Monitoring
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS usage_logs (
  id                 UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            TEXT,                        -- NULL for unauthenticated
  ip_address         TEXT,                        -- for anon rate limiting
  event_type         TEXT          NOT NULL,      -- 'analyze' | 'chat'
  repo_full_name     TEXT,

  -- Timing
  execution_time_ms  INTEGER,
  rag_retrieval_ms   INTEGER,                     -- chat only

  -- Tokens (from Gemini usageMetadata)
  input_tokens       INTEGER,
  output_tokens      INTEGER,
  total_tokens       INTEGER,

  -- Context efficiency (analyze only)
  total_files        INTEGER,
  files_sent         INTEGER,

  -- Cost estimate
  estimated_cost_usd NUMERIC(12, 8),

  created_at         TIMESTAMPTZ   DEFAULT NOW()
);

-- Index for anon rate limit lookups (by IP, recent analyze events)
CREATE INDEX IF NOT EXISTS idx_usage_logs_ip
  ON usage_logs (ip_address, created_at)
  WHERE user_id IS NULL;

-- Index for authenticated user queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user
  ON usage_logs (user_id, created_at)
  WHERE user_id IS NOT NULL;
