---
name: Backend Keep-Alive and Admin Protection
overview: Add a keep-alive API endpoint to prevent Supabase inactivity pause, and password-protect the Admin moderation page.
todos: []
isProject: false
---

# Backend: Keep-Alive Endpoint + Admin Protection

## 1. Keep-Alive API Endpoint

**Goal:** Create a serverless function that pings Supabase so UptimeRobot (or similar) can hit it every 5 minutes and prevent the 1-week inactivity pause.

**Implementation:**

- Create `[api/keepalive.js](api/keepalive.js)` at project root
- Use `@supabase/supabase-js` with env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Vercel injects these)
- Perform a minimal query: `supabase.from('projects').select('id').limit(1)`
- Return 200 with `{ ok: true }` on success, 503 on failure
- Vercel auto-detects `api/` folder; no config change needed (rewrites apply to SPA routes, `/api/*` is handled by serverless first)

**Vercel rewrite:** Current `vercel.json` has catch-all to `index.html`. Vercel routes `/api/*` to serverless functions before applying rewrites, so no change needed.

**Post-deploy:** User adds `https://your-app.vercel.app/api/keepalive` to UptimeRobot, interval 5 min.

---

## 2. Admin Page Password Protection

**Goal:** Gate `/admin` behind a password so only authorized users can access the moderation queue.

**Approach:** Server-side password check via API + sessionStorage. Password never stored in client code.

**Implementation:**


| File                                                 | Change                                                                                                                                                                                                     |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[api/admin-auth.js](api/admin-auth.js)`             | New serverless function. POST body `{ password }`. Compare to `ADMIN_PASSWORD` env var. Return 200 + `{ ok: true }` if match, 401 otherwise.                                                               |
| `[.env.example](.env.example)`                       | Add `ADMIN_PASSWORD=your_secret_password`                                                                                                                                                                  |
| `[src/pages/AdminPage.jsx](src/pages/AdminPage.jsx)` | Add auth gate: if no `sessionStorage.adminAuth`, show password form. On submit, POST to `/api/admin-auth`. If 200, set `sessionStorage.adminAuth = '1'` and render queue. Style form to match existing UI. |


**Env vars:** Add `ADMIN_PASSWORD` to local `.env` and Vercel project settings. Do not commit the actual password.

**Security note:** Supabase RLS currently allows anyone with anon key to update projects. This gate prevents casual access to the admin UI. A determined attacker could still call Supabase directly; full protection would require Supabase Auth + RLS. For MVP, UI gate is sufficient.

---

## 3. Files to Create/Modify


| Action | Path                                                  |
| ------ | ----------------------------------------------------- |
| Create | `api/keepalive.js`                                    |
| Create | `api/admin-auth.js`                                   |
| Edit   | `.env.example` (add ADMIN_PASSWORD)                   |
| Edit   | `src/pages/AdminPage.jsx` (auth gate + password form) |


---

## 4. Optional: Update README

Add brief notes to [README.md](README.md):

- Keep-alive: Set up UptimeRobot to hit `/api/keepalive` every 5 min
- Admin: Set `ADMIN_PASSWORD` in env

