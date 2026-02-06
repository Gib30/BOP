# BOP – Setup Instructions

**Current setup:** See [PROJECT_STATUS.md](PROJECT_STATUS.md). Production is live; XUMM, treasury, testnet, and submit flow are done.

Below: reference for initial setup or new environments.

---

## 1. Supabase SQL (run in SQL Editor)

Go to **Supabase Dashboard → SQL Editor** and run each script.

### 1.1 Add submitted_by column (for Dashboard)

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_by TEXT;
```

### 1.2 Comments count trigger

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

### 1.3 Storage bucket

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

### 1.4 RLS for direct insert (if needed)

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
| `VITE_TREASURY_WALLET` | Optional | XRPL address for submission fees (1 XRP) |

---

## 3. XUMM Developer Console (optional)

**Already done for production.** If using Connect Wallet:

1. Go to [apps.xumm.dev](https://apps.xumm.dev)
2. Add **Origin/Redirect URIs**:
   - `https://bop-green.vercel.app` (production) – configured
   - `http://localhost:5173` (dev) – only if testing locally

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

---

## 7. XUMM payment-on-submit

**Implemented.** Charge 1 XRP when users submit a project; payment goes to treasury. Requires `VITE_TREASURY_WALLET`, `VITE_XUMM_API_KEY`, and Xaman on testnet when `VITE_XRPL_NETWORK=testnet`.

### 7.1 Implementation details

1. **Treasury wallet** – Create a dedicated XRPL address for submission fees.
2. **Submit flow** – On Submit:
   - Validate form (name, ticker, issuer).
   - Create XUMM payload with Payment tx: 1 XRP → treasury.
   - Show QR / "Open in XUMM" link.
   - On sign success → upload media → insert to Supabase.
   - On reject → show error, do not insert.
3. **Env** – Add `VITE_TREASURY_WALLET` (destination address).
4. **XUMM payload** – Use `xumm.payload.createAndSubscribe()` with `txjson: { TransactionType: 'Payment', Destination, Amount: '1000000' }` (1 XRP in drops).

### 7.2 Testnet for development

- **Faucets**: [faucet.xrpl.org](https://faucet.xrpl.org) or [faucet.altnet.rippletest.net](https://faucet.altnet.rippletest.net/).
- **Testnet WebSocket**: `wss://s.altnet.rippletest.net:51233`
- **XUMM** – Configure app for Testnet in [XUMM Developer Console](https://apps.xumm.dev) to test with test XRP.
