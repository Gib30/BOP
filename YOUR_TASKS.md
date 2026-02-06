# Your Tasks (Manual Steps)

Code is pushed. Vercel will auto-deploy. Do these to finish setup.

---

## 1. Supabase SQL

Open **Supabase Dashboard → SQL Editor → New query**, paste the contents of `run-supabase-migrations.sql`, click **Run**.  
If the storage bucket fails, create it manually: **Storage → New bucket** → name `project-media`, set **Public**.

---

## 2. Vercel environment variables

**Option A – Script (fast):**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create token
2. Add to `.env`: `VERCEL_TOKEN=your_token`
3. Add to `.env`: `ADMIN_PASSWORD=your_strong_password` (if not set)
4. Run: `node scripts/add-vercel-env.js`

**Option B – Manual:**
Vercel → Project → Settings → Environment Variables. Add from your `.env`:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (you have these)
- `ADMIN_PASSWORD` (choose one)
- `VITE_XUMM_API_KEY` (optional)

---

## 3. XUMM Developer Console

If using Connect Wallet or payment-on-submit:

1. Go to [apps.xumm.dev](https://apps.xumm.dev)
2. Add **Origin/Redirect URIs**:
   - Production: `https://your-app.vercel.app`
   - Dev: `http://localhost:5173` (or whatever port Vite uses)

---

## 4. Create treasury wallet (for 1 XRP fee)

Run: `node scripts/generate-treasury-wallet.js`

Copy the address to Vercel env as `VITE_TREASURY_WALLET`. Fund it at [faucet.xrpl.org](https://faucet.xrpl.org) (Testnet) or send real XRP (Mainnet). **Keep the secret safe** if you need to move funds later.

---

## 5. UptimeRobot (keep-alive)

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free)
2. Add monitor:
   - **URL:** `https://your-app.vercel.app/api/keepalive`
   - **Interval:** 5 minutes
   - **Type:** HTTP(s)

---

## 6. Verify

Deploy is automatic (already pushed). Check: submit a project, post a comment, connect wallet, Dashboard.
