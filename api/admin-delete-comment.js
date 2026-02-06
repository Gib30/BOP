import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const COOKIE_NAME = 'bop_admin';
const MAX_AGE_SEC = 60 * 60; // 1 hour

function verify(cookieVal) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !cookieVal) return false;
  const [b64, sig] = cookieVal.split('.');
  if (!b64 || !sig) return false;
  try {
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (Date.now() - data.t > MAX_AGE_SEC * 1000) return false;
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(data)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const cookie = req.headers.cookie?.split(';').find((c) => c.trim().startsWith(COOKIE_NAME + '='));
  const cookieVal = cookie?.split('=')[1]?.trim();
  if (!verify(cookieVal)) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(503).json({ ok: false, error: 'Supabase not configured' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }
  const commentId = body.commentId;
  if (!commentId) return res.status(400).json({ ok: false, error: 'commentId required' });

  const supabase = createClient(supabaseUrl, serviceKey);
  const { error } = await supabase.from('comments').delete().eq('id', commentId);

  if (error) return res.status(500).json({ ok: false, error: error.message });
  return res.status(200).json({ ok: true });
}
