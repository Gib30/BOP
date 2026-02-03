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

  return res.status(200).json({ ok: true });
}
