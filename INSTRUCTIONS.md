# BOP – Setup Instructions (Your Action Required)

Complete these steps to finish MVP deployment.

---

## 1. Supabase SQL (run in SQL Editor)

Go to **Supabase Dashboard → SQL Editor** and run each script.

### 1.1 Comments count trigger

Run the contents of `supabase/migrations/20260203000000_comments_count_trigger.sql`:

```sql
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

CREATE TRIGGER increment_comments_count
AFTER INSERT ON comments FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();

CREATE TRIGGER decrement_comments_count
AFTER DELETE ON comments FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();
```

### 1.2 Storage bucket

Run the contents of `supabase/migrations/20260203000001_storage_project_media.sql`:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'project-media');

CREATE POLICY "Anonymous insert access" ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'project-media');
```

If the bucket insert fails, create it manually: **Storage → New bucket** → name: `project-media`, set **Public**.

### 1.3 RLS for direct insert (if needed)

If project insert fails with `status = 'approved'`, run:

```sql
DROP POLICY IF EXISTS "Anyone can insert projects (pending)" ON projects;
CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (status IN ('pending', 'approved'));
```

---

## 2. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | Yes | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `ADMIN_PASSWORD` | Yes | Password for /admin |
| `VITE_XUMM_API_KEY` | Optional | For Connect Wallet (from apps.xumm.dev) |

---

## 3. XUMM Developer Console (optional)

If using Connect Wallet:

1. Go to [apps.xumm.dev](https://apps.xumm.dev)
2. Add **Origin/Redirect URIs**:
   - `https://bop-green.vercel.app` (production)
   - `http://localhost:5173` (dev)

---

## 4. Keep-alive

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free)
2. Add monitor:
   - **URL:** `https://bop-green.vercel.app/api/keepalive`
   - **Interval:** 5 minutes
   - **Type:** HTTP(s)

---

## 5. Deploy

1. Push to GitHub
2. Vercel auto-deploys
3. Verify: submit a project with media, post a comment, connect wallet

---

## 6. Local .env

Create `.env` from `.env.example` with your values for local development.
