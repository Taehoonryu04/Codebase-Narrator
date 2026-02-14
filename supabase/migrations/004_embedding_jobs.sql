-- Migration 004: Embedding jobs + atomic swap support
-- Run this in Supabase SQL Editor

-- 1. Add batch_id to code_embeddings for atomic swap deletion
ALTER TABLE code_embeddings ADD COLUMN IF NOT EXISTS batch_id UUID DEFAULT gen_random_uuid();

-- Index to speed up old-batch cleanup (DELETE WHERE batch_id != ?)
CREATE INDEX IF NOT EXISTS idx_code_embeddings_batch
  ON code_embeddings(user_id, repo_full_name, batch_id);

-- 2. Embedding jobs table — tracks progress of background embedding work
CREATE TABLE IF NOT EXISTS embedding_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,
  batch_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',   -- in_progress | completed | failed
  total_chunks INTEGER NOT NULL DEFAULT 0,
  embedded_chunks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Fast lookup: latest job for a given user + repo
CREATE INDEX IF NOT EXISTS idx_embedding_jobs_lookup
  ON embedding_jobs(user_id, repo_full_name, created_at DESC);
