# Your Tasks (Manual Steps)

These require your login/credentials. Do these after the code changes are in place.

---

## 1. Supabase SQL (run in SQL Editor)

Go to **Supabase Dashboard → SQL Editor** and run each script.

### 1.1 Add submitted_by column (for Dashboard)

If your `projects` table doesn't have `submitted_by` yet:

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_by TEXT;
```

### 1.2 Comments count trigger

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

### 1.3 Storage bucket (for media uploads)

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

### 1.4 RLS for direct insert (if needed)

If project insert fails with `status = 'approved'`:

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
| `VITE_TREASURY_WALLET` | Optional | XRPL address for 1 XRP submission fee |

---

## 3. XUMM Developer Console

If using Connect Wallet or payment-on-submit:

1. Go to [apps.xumm.dev](https://apps.xumm.dev)
2. Add **Origin/Redirect URIs**:
   - Production: `https://your-app.vercel.app`
   - Dev: `http://localhost:5173` (or whatever port Vite uses)

---

## 4. Create treasury wallet (for 1 XRP fee)

If you want to charge 1 XRP on submit:

1. Create a new XRPL address (e.g. with XUMM or xrpl.js)
2. Add it to Vercel env as `VITE_TREASURY_WALLET`
3. For testing, use Testnet: get test XRP from [faucet.xrpl.org](https://faucet.xrpl.org)

---

## 5. UptimeRobot (keep-alive)

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free)
2. Add monitor:
   - **URL:** `https://your-app.vercel.app/api/keepalive`
   - **Interval:** 5 minutes
   - **Type:** HTTP(s)

---

## 6. Deploy

1. Push to GitHub
2. Vercel auto-deploys
3. Verify: submit a project, post a comment, connect wallet, check Dashboard
