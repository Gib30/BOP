import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(503).json({ ok: false, error: 'Supabase not configured' });
  }

  try {
    const supabase = createClient(url, key);
    const { error } = await supabase.from('projects').select('id').limit(1);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(503).json({ ok: false, error: String(e?.message || e) });
  }
}
