// XRPSCAN token stats proxy with 10-min cache (stays within free 10K req/day)
const CACHE_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency, issuer } = req.query;
  if (!currency || !issuer) {
    return res.status(400).json({ error: 'currency and issuer required' });
  }

  const key = `${currency}.${issuer}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');
    return res.status(200).json(cached.data);
  }

  try {
    const url = `https://api.xrpscan.com/api/v1/token/${encodeURIComponent(currency)}.${encodeURIComponent(issuer)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'XRPSCAN request failed' });
    }
    const data = await resp.json();

    const out = {
      holders: data.metrics?.holders ?? data.holders ?? null,
      trustlines: data.metrics?.trustlines ?? null,
      supply: data.metrics?.supply ?? data.supply ?? null,
      volume24h: data.metrics?.volume_24h ?? null,
      price: data.metrics?.price ?? data.price ?? null,
      marketcap: data.metrics?.marketcap ?? data.marketcap ?? null,
    };

    cache.set(key, { data: out, ts: Date.now() });
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');
    return res.status(200).json(out);
  } catch (e) {
    return res.status(502).json({ error: String(e?.message || e) });
  }
}
