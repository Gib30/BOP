# Board of Peace - XRPL Token Directory

XRPL token directory for the Board of Peace community. Built with React, Vite, Tailwind, and Supabase.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add assets** (optional)
   - Place `BoP.jpg` (logo) and `Banner__1_.jpg` (banner) in `public/assets/`
   - If missing, placeholder images are used

3. **Supabase** (optional, for backend)
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in the SQL Editor
   - Create `.env` with:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **XUMM / Xaman** (optional, for Connect Wallet and payment flow)
   - Get an API key from [Xumm Developer Console](https://apps.xumm.dev)
   - Add your app URLs to **Allowed origins**:
     - Production: `https://your-app.vercel.app`
     - Local dev: `http://localhost:5173`
   - Add `VITE_XUMM_API_KEY` to `.env` and Vercel
   - If using testnet (`VITE_XRPL_NETWORK=testnet`): in Xaman, enable Developer mode (Settings → Advanced), then switch network to **XRPL Testnet** via the network button on Home

5. **Run locally**
   ```bash
   npm run dev
   ```
   For local Admin auth and keepalive API, use `vercel dev` instead of `npm run dev`.

6. **Build**
   ```bash
   npm run build
   ```

## Deploy (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add env vars:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (required for backend)
   - `ADMIN_PASSWORD` (for /admin moderation)
   - `VITE_XUMM_API_KEY` (for Connect Wallet)
   - `VITE_TREASURY_WALLET` (XRPL address for 1 XRP submission fee)
   - `VITE_XRPL_NETWORK=testnet` (omit for mainnet)
4. Deploy

**Keep-alive:** Add `https://your-app.vercel.app/api/keepalive` to [UptimeRobot](https://uptimerobot.com) (or similar) with a 5-minute interval to prevent Supabase free-tier inactivity pause.

## Features

- Homepage with hero, search, filters, grid/list toggle, pagination
- Project detail pages with media gallery, roadmap, team, comments
- Threaded comments with upvote/downvote (Supabase)
- Project submission wizard
- Admin moderation queue (password-protected via `ADMIN_PASSWORD`)
- Connect Wallet (XUMM/Xaman) - requires `VITE_XUMM_API_KEY` and allowed origins in [Xumm Developer Console](https://apps.xumm.dev)
- XRPL Trust Token and DEX links
- Sidebar with categories, featured, trending
- Footer with XRPL resources
