import crypto from 'crypto';

const COOKIE_NAME = 'bop_admin';
const MAX_AGE_SEC = 60 * 60; // 1 hour

function sign(payload) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(data).toString('base64url') + '.' + sig;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ ok: false, error: 'Admin not configured' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const password = body.password;
  if (!password || password !== expected) {
    return res.status(401).json({ ok: false, error: 'Invalid password' });
  }

  const val = sign({ t: Date.now() });
  if (val) {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${val}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE_SEC}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  }

  return res.status(200).json({ ok: true });
}
