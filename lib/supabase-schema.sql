-- ══════════════════════════════════════════════════════════════════════════
-- E-CELL FOUNDRY & REGISTRATION ARCHITECTURE (PostgreSQL / Supabase Schema)
-- ══════════════════════════════════════════════════════════════════════════

-- 1. CLEANUP / RESET SCRIPT (Run this in Supabase SQL Editor to wipe & rebuild)
-- DROP TABLE IF EXISTS founder_scores CASCADE;
-- DROP TABLE IF EXISTS founders CASCADE;
-- DROP TABLE IF EXISTS foundry_tracks CASCADE;
-- DROP TABLE IF EXISTS live_community_stats CASCADE;

-- 2. CREATE FOUNDRY TRACKS TABLE
CREATE TABLE IF NOT EXISTS foundry_tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial tracks
INSERT INTO foundry_tracks (id, name, tagline, badge_color) VALUES
  ('founder', 'Founder / Visionary', 'Lead venture strategy and orchestrate capital', '#e31e24'),
  ('builder', 'Product Builder / Full-Stack', 'Ship production-ready web & native applications', '#3b82f6'),
  ('ai_engineer', 'AI / ML Engineer', 'Fine-tune LLMs and architect neural pipelines', '#8b5cf6'),
  ('designer', 'Product Designer / UX', 'Design bespoke interfaces and visual design systems', '#ec4899'),
  ('growth', 'Growth & Marketing', 'Viral loops, distribution channels, and user acquisition', '#10b981'),
  ('operations', 'Operations & Strategy', 'Supply chain, logistics, and legal frameworks', '#f59e0b'),
  ('finance', 'Finance & Capital', 'Financial models, unit economics, and pitch decks', '#06b6d4'),
  ('blockchain', 'Web3 / Blockchain', 'Smart contracts, tokenomics, and decentralized tech', '#6366f1'),
  ('creator', 'Media & Content Creator', 'Storytelling, video production, and community building', '#f43f5e')
ON CONFLICT (id) DO NOTHING;

-- 3. MAIN FOUNDERS / APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id TEXT UNIQUE NOT NULL, -- e.g. "FD-2026-8492"
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  university_id TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  track_id TEXT NOT NULL REFERENCES foundry_tracks(id),
  
  -- Entrepreneurial Mindset Responses
  problem_statement TEXT NOT NULL,
  build_in_30_days TEXT NOT NULL,
  past_project TEXT NOT NULL,
  experience_summary TEXT,
  skills TEXT[] DEFAULT '{}',
  weekly_hours INTEGER NOT NULL DEFAULT 15,
  pledge_accepted BOOLEAN NOT NULL DEFAULT true,

  -- AI Scoring & Evaluation (via Groq API)
  founder_score INTEGER DEFAULT 85,
  score_problem_solving INTEGER DEFAULT 85,
  score_leadership INTEGER DEFAULT 80,
  score_execution INTEGER DEFAULT 90,
  score_overall INTEGER DEFAULT 85,
  ai_assessment_summary TEXT,
  startup_dna TEXT, -- e.g. "01 // High-Velocity Builder"
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'APPROVED_PENDING_BATCH', -- 'PENDING_REVIEW', 'APPROVED_PENDING_BATCH', 'ADMITTED', 'REJECTED'
  batch_name TEXT NOT NULL DEFAULT 'FOUNDRY BATCH 04',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE COMMUNITY STATS TABLE
CREATE TABLE IF NOT EXISTS live_community_stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  founders_joined INTEGER DEFAULT 342,
  ideas_submitted INTEGER DEFAULT 189,
  hackathons_held INTEGER DEFAULT 28,
  startups_formed INTEGER DEFAULT 19,
  active_mentors INTEGER DEFAULT 45,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial live counters
INSERT INTO live_community_stats (id, founders_joined, ideas_submitted, hackathons_held, startups_formed, active_mentors)
VALUES ('global', 342, 189, 28, 19, 45)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundry_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_community_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read of tracks & community stats
CREATE POLICY "Public Read Tracks" ON foundry_tracks FOR SELECT USING (true);
CREATE POLICY "Public Read Stats" ON live_community_stats FOR SELECT USING (true);

-- Allow public insertion for applications
CREATE POLICY "Public Submit Application" ON founders FOR INSERT WITH CHECK (true);
-- Allow public select of their own application by founder_id
CREATE POLICY "Public Read Own Founder ID" ON founders FOR SELECT USING (true);
