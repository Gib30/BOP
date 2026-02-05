-- BOP: Run this entire file in Supabase Dashboard → SQL Editor → New query
-- Copy-paste all and click Run

-- 1. Add submitted_by column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_by TEXT;

-- 2. Comments count trigger
CREATE OR REPLACE FUNCTION update_project_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET comments_count = comments_count - 1 WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_comments_count ON comments;
CREATE TRIGGER increment_comments_count
AFTER INSERT ON comments FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();

DROP TRIGGER IF EXISTS decrement_comments_count ON comments;
CREATE TRIGGER decrement_comments_count
AFTER DELETE ON comments FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();

-- 3. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Anonymous insert access" ON storage.objects;
CREATE POLICY "Anonymous insert access" ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'project-media');

-- 4. RLS for direct insert
DROP POLICY IF EXISTS "Anyone can insert projects (pending)" ON projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON projects;
CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (status IN ('pending', 'approved'));
