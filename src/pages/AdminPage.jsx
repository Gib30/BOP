import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import { Check, X, Lock } from 'lucide-react';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem('adminAuth'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!hasSupabase || !authenticated) {
      setLoading(false);
      return;
    }

    async function fetchPending() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error) setPending(data || []);
      setLoading(false);
    }

    fetchPending();
  }, [authenticated]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        sessionStorage.setItem('adminAuth', '1');
        setAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid password');
      }
    } catch {
      setAuthError('Could not reach server. Deploy to Vercel for admin auth.');
    } finally {
      setAuthLoading(false);
    }
  };

  const approve = async (id) => {
    const { error } = await supabase.from('projects').update({ status: 'approved' }).eq('id', id);
    if (!error) setPending((p) => p.filter((x) => x.id !== id));
  };

  const reject = async (id) => {
    const { error } = await supabase.from('projects').update({ status: 'rejected' }).eq('id', id);
    if (!error) setPending((p) => p.filter((x) => x.id !== id));
  };

  if (!hasSupabase) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Admin</h1>
        <p className="text-neutral-400">Supabase not configured. Add env vars to enable moderation.</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-400" />
            Admin Access
          </h1>
          <p className="text-neutral-400 text-sm mb-6">Enter the admin password to access the moderation queue.</p>
          <form onSubmit={handleAuthSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black/40 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-700 mb-4"
              autoFocus
              disabled={authLoading}
            />
            {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
            >
              {authLoading ? 'Checking...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-white mb-8">Moderation Queue</h1>

      {loading ? (
        <div className="text-neutral-400">Loading...</div>
      ) : pending.length === 0 ? (
        <div className="text-neutral-500 py-12">No pending submissions.</div>
      ) : (
        <div className="space-y-6">
          {pending.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex items-start justify-between gap-6"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl font-bold text-white mb-2">{p.name}</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-400 font-mono">${p.ticker}</span>
                  <span className="text-neutral-500 text-sm">{p.category}</span>
                </div>
                <p className="text-neutral-400 text-sm mb-2">{p.tagline}</p>
                <code className="text-amber-400/80 text-xs block truncate">{p.issuer}</code>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => approve(p.id)}
                  className="p-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => reject(p.id)}
                  className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
