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

-- 5. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications readable by recipient" ON notifications
  FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Recipient can update read status" ON notifications
  FOR UPDATE USING (true);

-- 6. Notify on project status change
CREATE OR REPLACE FUNCTION notify_project_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('approved', 'rejected') AND OLD.status = 'pending' AND NEW.submitted_by IS NOT NULL AND NEW.submitted_by != '' THEN
    INSERT INTO notifications (project_id, recipient, type, message, link)
    VALUES (
      NEW.id,
      NEW.submitted_by,
      NEW.status,
      CASE WHEN NEW.status = 'approved' THEN 'Your project "' || NEW.name || '" was approved!' ELSE 'Your project "' || NEW.name || '" was not approved.' END,
      '/project/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_project_status_change ON projects;
CREATE TRIGGER on_project_status_change
AFTER UPDATE ON projects FOR EACH ROW
EXECUTE FUNCTION notify_project_status();

-- 7. Notify project owner on new comment
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  owner TEXT;
  proj_name TEXT;
BEGIN
  SELECT submitted_by, name INTO owner, proj_name FROM projects WHERE id = NEW.project_id;
  IF owner IS NOT NULL AND owner != '' AND (TG_OP = 'INSERT') THEN
    INSERT INTO notifications (project_id, recipient, type, message, link)
    VALUES (NEW.project_id, owner, 'comment', 'New comment on "' || proj_name || '"', '/project/' || NEW.project_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_comment ON comments;
CREATE TRIGGER on_new_comment
AFTER INSERT ON comments FOR EACH ROW
EXECUTE FUNCTION notify_new_comment();
