#!/usr/bin/env node
/**
 * Run run-supabase-migrations.sql via direct Postgres connection.
 * Requires in .env: VITE_SUPABASE_URL, SUPABASE_DB_PASSWORD
 * Get DB password: Supabase Dashboard > Project Settings > Database > Connection string
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const password = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !password) {
  console.error('Missing env vars. Add to .env:');
  console.error('  VITE_SUPABASE_URL');
  console.error('  SUPABASE_DB_PASSWORD (from Supabase Dashboard > Project Settings > Database)');
  process.exit(1);
}

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;

async function main() {
  const migrationsPath = join(__dirname, '..', 'run-supabase-migrations.sql');
  const sql = readFileSync(migrationsPath, 'utf8');

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    await client.query(sql);
    console.log('Migrations applied successfully.');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
