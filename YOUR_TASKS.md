# Your Tasks (Manual Steps)

**See [PROJECT_STATUS.md](PROJECT_STATUS.md) for current state.** Most setup is done.

---

## If starting fresh

1. **Supabase SQL** – Run `run-supabase-migrations.sql` in SQL Editor (or `npm run db:migrate` if you have `SUPABASE_DB_PASSWORD` in .env)
2. **Vercel env** – Add vars (see INSTRUCTIONS.md); or run `node scripts/add-vercel-env.js`
3. **XUMM** – Add `https://your-app.vercel.app` to allowed origins at apps.xumm.dev
4. **Treasury** – Run `node scripts/generate-treasury-wallet.js`, fund it, add `VITE_TREASURY_WALLET`
5. **UptimeRobot** – Monitor `https://your-app.vercel.app/api/keepalive` (5 min)

---

## Optional

- **Vercel env sync** – Add `SUPABASE_SERVICE_ROLE_KEY` to .env, then `node scripts/add-vercel-env.js` to push to Vercel (comment delete needs it)
- **Local dev with Connect Wallet** – Add `http://localhost:5173` to XUMM origins
- **Mainnet** – Omit `VITE_XRPL_NETWORK` or set to mainnet; fund treasury on mainnet
