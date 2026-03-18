-- Migration: Enable Row Level Security on all public tables
-- Fixes: RLS Disabled in Public (x10) + Sensitive Columns Exposed (x2)
--
-- All data access goes through Prisma (postgres superuser) or supabaseAdmin (service role),
-- both of which bypass RLS. Enabling RLS with no permissive policies blocks PostgREST
-- public access without affecting any app functionality.

ALTER TABLE public."RateLimit"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Analysis"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CodeChunk"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embedding_jobs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_embeddings      ENABLE ROW LEVEL SECURITY;
