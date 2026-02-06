# BOP – Project Status

**Last updated:** Feb 2025

## ✅ Done (no action needed)

| Item | Status |
|------|--------|
| Vercel deployment | Live at https://bop-green.vercel.app |
| Supabase | Connected, schema run |
| Env vars | `ADMIN_PASSWORD`, `VITE_XUMM_API_KEY`, `VITE_TREASURY_WALLET`, `VITE_XRPL_NETWORK=testnet`, `SUPABASE_SERVICE_ROLE_KEY` (for admin) |
| Treasury | Funded on testnet |
| XUMM | Production URL in allowed origins; Connect Wallet + 1 XRP payment flow working |
| UptimeRobot | Monitor on `/api/keepalive` (5 min) |
| Submit flow | Form → payment QR → Supabase insert; tested end-to-end |
| Testnet | App uses testnet; user switches Xaman to XRPL Testnet in app (Developer mode → network button) |
| Featured section | Carousel of featured projects; Admin badge management (Featured, Verified, OG, New, Meme) |
| Sorting | Trending, Rising, Verified first, safe holders parsing |
| Comment moderation | Admin Comments tab: view recent comments, delete via `/api/admin-delete-comment` |
| Notifications | Schema + triggers; bell icon when wallet connected |
| UI polish | Loading skeletons, mobile-friendly featured carousel |
| E2E tests | Playwright smoke tests (`npm run test:e2e`; run `npx playwright install` first) |

## Optional (only if needed)

| Item | When |
|------|------|
| `http://localhost:5173` in XUMM origins | Only if testing Connect Wallet locally |
| Mainnet | When ready for production; change `VITE_XRPL_NETWORK`, fund treasury on mainnet |

## Reference

- **README.md** – Setup for new devs / fresh clone
- **INSTRUCTIONS.md** – Supabase SQL, Vercel env (for initial setup)
- **YOUR_TASKS.md** – One-time setup checklist (most steps already done)
