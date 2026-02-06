import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import { MOCK_TOKENS } from '../lib/constants';
import { enrichBadges } from '../lib/utils';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!hasSupabase) {
        setProjects(
          MOCK_TOKENS.map((t) => ({
            ...t,
            trustLines: t.trustLines,
            comments: t.comments ?? 0,
            badges: enrichBadges(t.badges || [], t.category, t.createdAt),
            createdAt: t.createdAt,
          }))
        );
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'approved')
          .order('views', { ascending: false });

        if (err) throw err;

        setProjects(
          (data || []).map((p) => ({
            id: p.id,
            name: p.name,
            ticker: p.ticker,
            tagline: p.tagline,
            description: p.description,
            issuer: p.issuer,
            supply: p.supply,
            holders: p.holders,
            trustLines: p.trust_lines,
            badges: enrichBadges(p.badges || [], p.category, p.created_at),
            category: p.category,
            views: p.views || 0,
            comments: p.comments_count || 0,
            logoUrl: p.logo_url,
            bannerUrl: p.banner_url,
            mediaUrls: p.media_urls || [],
            videoUrl: p.video_url,
            website: p.website,
            twitter: p.twitter,
            discord: p.discord,
            telegram: p.telegram,
            github: p.github,
            whitepaper: p.whitepaper,
            roadmap: p.roadmap || [],
            team: p.team || [],
            createdAt: p.created_at,
          }))
        );
      } catch (e) {
        setError(e.message);
        setProjects(
          MOCK_TOKENS.map((t) => ({
            ...t,
            trustLines: t.trustLines,
            comments: t.comments ?? 0,
            badges: enrichBadges(t.badges || [], t.category, t.createdAt),
            createdAt: t.createdAt,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
