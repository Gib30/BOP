/**
 * Run Supabase schema - requires SUPABASE_DB_PASSWORD in .env
 * Get it from: Supabase Dashboard > Project Settings > Database > Connection string
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
  console.error('  VITE_SUPABASE_URL (you have this)');
  console.error('  SUPABASE_DB_PASSWORD (from Supabase Dashboard > Project Settings > Database)');
  process.exit(1);
}

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;

async function main() {
  const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf8');

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    await client.query(schema);
    console.log('Schema applied successfully.');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
