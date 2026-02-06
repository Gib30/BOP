#!/usr/bin/env node
/**
 * Print Vercel env vars from .env for easy copy-paste
 * Run: node scripts/setup-vercel-env.js
 */
import { readFileSync, existsSync } from 'fs';

const envPath = '.env';
const env = {};

if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  });
}

const vars = [
  ['VITE_SUPABASE_URL', env.VITE_SUPABASE_URL || 'PASTE_FROM_SUPABASE'],
  ['VITE_SUPABASE_ANON_KEY', env.VITE_SUPABASE_ANON_KEY || 'PASTE_FROM_SUPABASE'],
  ['ADMIN_PASSWORD', env.ADMIN_PASSWORD || 'CHOOSE_A_PASSWORD'],
  ['VITE_XUMM_API_KEY', env.VITE_XUMM_API_KEY],
  ['VITE_TREASURY_WALLET', env.VITE_TREASURY_WALLET],
];

console.log('\n=== Add these to Vercel → Settings → Environment Variables ===\n');
vars.forEach(([k, v]) => {
  if (v && !v.startsWith('PASTE_') && !v.startsWith('CHOOSE_')) {
    console.log(`${k}=${v}`);
  }
});
console.log('\nSet ADMIN_PASSWORD to a strong password for /admin access.');
console.log('Vercel: Project → Settings → Environment Variables → Add each one.\n');
