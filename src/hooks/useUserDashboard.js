import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';

export function useUserDashboard(walletAddress) {
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress || !hasSupabase) {
      setSubmissions([]);
      setComments([]);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      try {
        const { data: projects } = await supabase
          .from('projects')
          .select('id, name, ticker, issuer, status, created_at')
          .eq('submitted_by', walletAddress)
          .order('created_at', { ascending: false });

        const { data: commentRows } = await supabase
          .from('comments')
          .select('id, project_id, content, created_at')
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })
          .limit(20);

        setSubmissions(projects || []);
        setComments(commentRows || []);
      } catch (e) {
        setSubmissions([]);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [walletAddress]);

  return { submissions, comments, loading };
}
