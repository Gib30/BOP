import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import { Check, X, ExternalLink } from 'lucide-react';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabase) {
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
  }, []);

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
