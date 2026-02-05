-- Board of Peace - Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Projects (tokens) table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  issuer TEXT NOT NULL,
  supply TEXT,
  holders TEXT,
  trust_lines TEXT,
  badges TEXT[] DEFAULT '{}',
  category TEXT,
  views INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  logo_url TEXT,
  banner_url TEXT,
  media_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  website TEXT,
  twitter TEXT,
  discord TEXT,
  telegram TEXT,
  github TEXT,
  whitepaper TEXT,
  roadmap JSONB DEFAULT '[]',
  team JSONB DEFAULT '[]',
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table (threaded)
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  wallet_address TEXT,
  display_name TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Projects: public read, authenticated write for submissions
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (status IN ('pending', 'approved'));

CREATE POLICY "Projects can be updated by admin" ON projects
  FOR UPDATE USING (true);

-- Comments: public read, authenticated write
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments can be updated (for votes)" ON comments
  FOR UPDATE USING (true);

-- Seed data (Board of Peace, Peace Ducks, Harmony Arts) - run once
INSERT INTO projects (name, ticker, tagline, description, issuer, supply, holders, trust_lines, badges, category, views, comments_count, status) VALUES
  ('Board of Peace', 'BOP', 'United Stewards on XRPL – Join the Harmony', 'Born from the Potheads XRP community in 2017, Board of Peace represents a collective of XRPL enthusiasts united by peace through art, cryptocurrency, and meaningful impact.', 'rGF1o7dsC776Hov8qKkPCN1wkVh18sz5bf', '1,000,000,000', '2,847', '3,124', ARRAY['Verified', 'Featured', 'OG'], 'Social', 15420, 89, 'approved'),
  ('Peace Ducks', 'DUCK', 'What the Duck! Meme meets meaning', 'Community meme token with charitable impact.', 'rN7n7otQDd6FczFgLdJqcdNCood2aR74h8', '500,000,000', '1,523', '1,890', ARRAY['New', 'Meme'], 'Meme', 8930, 45, 'approved'),
  ('Harmony Arts', 'HART', 'NFT collective for global peace', 'Artist collective creating NFTs for charity.', 'rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjQH', '100,000,000', '892', '1,234', ARRAY['Verified'], 'NFT', 6780, 34, 'approved');
