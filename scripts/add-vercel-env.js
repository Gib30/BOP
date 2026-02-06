#!/usr/bin/env node
/**
 * Add env vars to Vercel via API
 * 1. Get token: vercel.com/account/tokens → Create
 * 2. Add to .env: VERCEL_TOKEN=your_token
 * 3. Run: node scripts/add-vercel-env.js
 */
import { readFileSync, existsSync } from 'fs';

function loadEnv() {
  const env = {};
  if (existsSync('.env')) {
    readFileSync('.env', 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim();
    });
  }
  return env;
}

const env = loadEnv();
const token = env.VERCEL_TOKEN;
const projectName = env.VERCEL_PROJECT || 'BOP';

if (!token) {
  console.log('Add VERCEL_TOKEN to .env (get from vercel.com/account/tokens)');
  process.exit(1);
}

const vars = [
  { key: 'VITE_SUPABASE_URL', value: env.VITE_SUPABASE_URL },
  { key: 'VITE_SUPABASE_ANON_KEY', value: env.VITE_SUPABASE_ANON_KEY },
  { key: 'ADMIN_PASSWORD', value: env.ADMIN_PASSWORD || 'bop-admin-' + Date.now() },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', value: env.SUPABASE_SERVICE_ROLE_KEY },
  { key: 'VITE_XUMM_API_KEY', value: env.VITE_XUMM_API_KEY },
  { key: 'VITE_TREASURY_WALLET', value: env.VITE_TREASURY_WALLET },
].filter((v) => v.value);

async function addEnv(key, value) {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(projectName)}/env`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        value,
        target: ['production', 'preview', 'development'],
        type: 'encrypted',
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
  return res.json();
}

(async () => {
  console.log('Adding env vars to Vercel...\n');
  for (const { key, value } of vars) {
    try {
      await addEnv(key, value);
      console.log('  ✓', key);
    } catch (e) {
      console.log('  ✗', key, '-', e.message);
    }
  }
  console.log('\nDone. Redeploy your project for changes to take effect.\n');
})();
