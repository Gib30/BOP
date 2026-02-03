# Board of Peace – End-to-End Plan

**XRPL Token Directory for the Potheads XRP Community**  
*DISCOVER | BUILD | PROSPER*

---

## 1. Project Overview

Board of Peace (BOP) is an XRPL token directory that lets community members discover, submit, and discuss XRPL tokens. It combines a curated directory with project pages, comments, and submission tools.

**Tech stack:** React, Vite, Tailwind CSS, Supabase, Vercel, xrpl.js

**Live URL:** https://bop-green.vercel.app  
**GitHub:** https://github.com/Gib30/BOP

---

## 2. Full Feature Spec (from brainDump.md)

### 2.1 Homepage / Token Directory

| Feature | Status | Notes |
|---------|--------|-------|
| Search & filter bar (sticky) | Done | Name, ticker, issuer, category |
| Sort by popularity, views, comments, newest, trending | Done | |
| Grid/List view toggle | Done | |
| Token cards: logo, name, ticker, tagline, stats | Done | |
| Badges: Verified, Featured, New, Community Favorite | Done | |
| Issuer address (shortened + copy) | Done | |
| Holders, trust lines, supply | Done | |
| Pagination | Done | |
| Infinite scroll | Not done | Optional |
| Video thumbnail on hover | Not done | Optional |

### 2.2 Project Detail Page

| Feature | Status | Notes |
|---------|--------|-------|
| Hero: banner, token name, tagline | Done | |
| CTA buttons: Trust, DEX, Website, Whitepaper | Done | |
| Media gallery (carousel) | Done | |
| Rich text / Markdown description | Done | |
| Token details, issuer link | Done | |
| Social links (Twitter, Discord, Telegram, GitHub) | Done | |
| Roadmap section | Done | |
| Team section | Done | |
| Stats (holders, volume) | Partial | Volume from DEX not integrated |
| Comment section (threaded, upvote/downvote) | Done | |
| Real-time comment updates | Done | Supabase Realtime |
| Wallet auth for comments | Not done | Post as Anonymous for now |
| Emoji picker, attach image | Not done | Optional |

### 2.3 Project Submission

| Feature | Status | Notes |
|---------|--------|-------|
| Stepper wizard (4 steps) | Done | |
| Token basics: name, ticker, issuer, category | Done | |
| Description, tagline, links | Done | |
| Logo URL, Banner URL, Image URLs | Done | Paste URLs |
| Media file upload (drag-drop) | Partial | UI exists, no cloud upload |
| XRPL issuer validation | Done | Client-side format check |
| Preview before submit | Done | |
| Direct publish (no moderation) | Done | status=approved |
| Moderation queue | Done | Admin page, password-protected |

### 2.4 Admin & User Tools

| Feature | Status | Notes |
|---------|--------|-------|
| Admin moderation queue | Done | Approve/reject pending |
| Admin password protection | Done | /api/admin-auth |
| User dashboard | Placeholder | My tokens, comments, notifications |
| Keep-alive endpoint | Done | /api/keepalive for Supabase |

### 2.5 Site-Wide

| Feature | Status | Notes |
|---------|--------|-------|
| Sidebar: categories, featured, trending | Done | |
| Footer: XRPL resources, disclaimer, contact | Done | |
| XRPL Trust Token / DEX links | Done | XRPSCAN deep links |

---

## 3. Setup & Deployment (Step-by-Step)

### 3.1 Local Development

```bash
# 1. Clone
git clone https://github.com/Gib30/BOP.git
cd BOP

# 2. Install
npm install

# 3. Assets (optional)
# Place BoP.jpg and Banner__1_.jpg in public/assets/
# If missing, placeholders are used

# 4. Environment
cp .env.example .env
# Edit .env with your values (see 3.2)

# 5. Run
npm run dev
# Opens at http://localhost:5173
```

### 3.2 Environment Variables

| Variable | Required | Where to get | Used for |
|----------|----------|--------------|----------|
| `VITE_SUPABASE_URL` | Yes (for backend) | Supabase Dashboard → Project Settings → API → Project URL | Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Yes (for backend) | Supabase Dashboard → API → Publishable API Key (anon) | Supabase client |
| `ADMIN_PASSWORD` | Yes (for admin) | Choose a strong password | /admin page, /api/admin-auth |
| `SUPABASE_DB_PASSWORD` | Optional | Supabase → Project Settings → Database | `npm run db:schema` |

**Supabase Dashboard:** Project URL and Publishable API Key are under **Project Settings → API**.

### 3.3 Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Open **SQL Editor**
3. Run `supabase/schema.sql` (creates tables, RLS, seed data)
4. For direct-approved submissions (no moderation), run:

```sql
DROP POLICY IF EXISTS "Anyone can insert projects (pending)" ON projects;
CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (status IN ('pending', 'approved'));
```

5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`

### 3.4 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import `Gib30/BOP`
3. Configure:
   - **Root Directory:** `./`
   - **Framework:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
5. Deploy

### 3.5 Post-Deploy: Keep-Alive

Supabase free tier pauses after 1 week of inactivity.

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free)
2. Add monitor:
   - **URL:** `https://bop-green.vercel.app/api/keepalive`
   - **Interval:** 5 minutes
   - **Type:** HTTP(s)

---

## 4. Project Structure

```
BOP/
├── api/                    # Vercel serverless functions
│   ├── keepalive.js        # Pings Supabase to prevent pause
│   └── admin-auth.js       # Password check for /admin
├── public/
│   └── assets/             # BoP.jpg, Banner__1_.jpg
├── src/
│   ├── components/         # Reusable UI
│   ├── hooks/              # useProjects, useComments
│   ├── lib/                # supabase, constants, xrpl
│   ├── pages/              # HomePage, ProjectDetailPage, etc.
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── schema.sql          # Full schema + seed
│   └── migrations/
├── .env.example
├── vercel.json
├── vite.config.js
└── package.json
```

---

## 5. Database Schema (Supabase)

### projects

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | Primary key |
| name, ticker, issuer | TEXT | Required |
| tagline, description | TEXT | |
| supply, holders, trust_lines | TEXT | Display strings |
| badges | TEXT[] | Verified, Featured, New, etc. |
| category | TEXT | DeFi, NFT, Meme, etc. |
| logo_url, banner_url | TEXT | Image URLs |
| media_urls | TEXT[] | Gallery image URLs |
| video_url | TEXT | |
| website, twitter, discord, telegram, github, whitepaper | TEXT | |
| roadmap, team | JSONB | Arrays of objects |
| status | TEXT | pending, approved, rejected |
| views, comments_count | INTEGER | |
| created_at, updated_at | TIMESTAMPTZ | |

### comments

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | Primary key |
| project_id | BIGINT | FK to projects |
| parent_id | BIGINT | For threading |
| content | TEXT | |
| wallet_address, display_name | TEXT | Optional |
| upvotes, downvotes | INTEGER | |
| created_at | TIMESTAMPTZ | |

---

## 6. Remaining Work (Prioritized)

### Phase A: Content & Polish (Low effort)

- [ ] Add more projects (via Submit page or SQL)
- [ ] Fix banner/logo display if broken (check paths in `public/assets/`)
- [ ] Fix layout overflow ("things spilling out") if present

### Phase B: Backend Enhancements (Medium effort)

- [ ] Supabase Storage for media uploads (replace URL paste)
- [ ] Comments count sync (update `projects.comments_count` when comment posted)
- [ ] Optional: Re-enable moderation (status=pending, admin approves)

### Phase C: Auth & Advanced (Higher effort)

- [ ] Wallet auth (XUMM) for verified comment badges
- [ ] User dashboard: my tokens, comment history, notifications
- [ ] DEX stats: holders, volume from XRPSCAN or similar API

### Phase D: Nice-to-Have

- [ ] Infinite scroll on homepage
- [ ] Emoji picker, image attach in comments
- [ ] Report spam / moderation flags
- [ ] Custom domain (e.g. boardofpeace.io)

---

## 7. Costs (Free Tier)

| Service | Free Tier | When to Pay |
|---------|-----------|-------------|
| Vercel | 100 GB bandwidth, 1M function invocations | Pro $20/mo if you outgrow |
| Supabase | 50k MAU, 500 MB DB, 1 GB storage, 5 GB egress | Pro $25/mo if you outgrow |
| UptimeRobot | 50 monitors, 5-min interval | Free tier sufficient |

**At 5–10 new members/day:** $0/month.  
**At ~1,000–2,000 visitors/day:** Still within free tier.  
**At ~5,000+/day:** Consider Supabase Pro + possibly Vercel Pro.

---

## 8. Quick Reference

| Task | Command / Action |
|------|------------------|
| Run locally | `npm run dev` |
| Build | `npm run build` |
| Run schema (needs DB password) | `npm run db:schema` |
| Admin URL | `/admin` (password required) |
| Submit project | `/submit` |
| Keep-alive | `GET /api/keepalive` |

---

## 9. Contacts & Links

- **Community:** Potheads XRP (X/Twitter @potheadsXRP)
- **XRPL Resources:** XRPL.org, XRPSCAN, XUMM Wallet
- **Disclaimer:** Informational only. Not financial advice. DYOR.

---

*Last updated: Feb 2026*
