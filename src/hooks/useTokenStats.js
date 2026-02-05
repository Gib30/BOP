import { useState, useEffect } from 'react';

export function useTokenStats(currency, issuer) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currency || !issuer) {
      setStats(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/token-stats?currency=${encodeURIComponent(currency)}&issuer=${encodeURIComponent(issuer)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [currency, issuer]);

  return { stats, loading };
}
